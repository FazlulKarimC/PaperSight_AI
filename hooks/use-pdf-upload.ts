import { useState, useRef } from "react"
import { toast } from "sonner"
import { useUploadThing } from "@/utils/uploadthing"
import { formatFileName } from "@/utils/fileNameFormatter"
import { useRouter } from "next/navigation"
import type { SummaryStyle } from "@/lib/utils"
import { checkGuestQuotaClient } from "@/lib/guest-rate-limit-client"
import {
  parsePdfsInBrowser,
  checkContextLimit,
  type BatchParseResult,
} from "@/lib/pdf-parser-client"

interface UsePDFUploadOptions {
  onUploadComplete?: () => void
  isSignedIn?: boolean
}

export type UploadStage =
  | 'idle'
  | 'parsing-client'  // NEW: client-side PDF text extraction
  | 'uploading'
  | 'parsing'          // AI summarization
  | 'saving'
  | 'indexing'
  | 'success'
  | 'error'

// Helper to create a timeout promise
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ])
}

/**
 * Reads the /api/summarize-text SSE stream and returns accumulated summary + metadata
 */
async function consumeSummarizeTextStream(
  text: string,
  style: SummaryStyle,
  fileNames: string[],
  onChunk?: (text: string) => void,
  signal?: AbortSignal,
): Promise<{ summary: string; originalWordCount: number }> {
  const res = await fetch("/api/summarize-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, style, fileNames }),
    signal,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: "Unknown error" }))
    if (res.status === 429) {
      const err = new Error(errorBody.error || "Rate limit exceeded");
      (err as any).code = "RATE_LIMIT_EXCEEDED";
      throw err;
    }
    if (res.status === 413) {
      const err = new Error(errorBody.error || "Content too large");
      (err as any).code = "CONTEXT_TOO_LARGE";
      throw err;
    }
    throw new Error(errorBody.error || `Server error: ${res.status}`)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error("No response stream available")

  const decoder = new TextDecoder()
  let buffer = ""
  let summary = ""
  let originalWordCount = 0

  const processEvent = (event: string) => {
    const line = event.trim()
    if (!line.startsWith("data: ")) return

    let data;
    try { data = JSON.parse(line.slice(6)); } catch { return; }
    switch (data.type) {
      case "meta":
        originalWordCount = data.originalWordCount
        break
      case "chunk":
        summary += data.text
        onChunk?.(summary)
        break
      case "error":
        throw new Error(data.error)
      case "done":
        break
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    const events = buffer.split("\n\n")
    buffer = events.pop() ?? ""

    for (const event of events) {
      processEvent(event)
    }
  }

  // Process any remaining data in the buffer after stream ends
  if (buffer.trim()) {
    processEvent(buffer)
  }

  if (!summary) throw new Error("No summary received from stream")
  return { summary, originalWordCount }
}

export function usePDFUpload({ onUploadComplete, isSignedIn = true }: UsePDFUploadOptions = {}) {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>('viral')
  const [streamingText, setStreamingText] = useState<string>("")
  const [parseProgress, setParseProgress] = useState<string>("")
  const cancelUploadRef = useRef<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const activeToastRef = useRef<string | number | null>(null)
  const didErrorRef = useRef<boolean>(false)
  const router = useRouter()

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => { },
    onUploadError: () => {
      toast.error("Upload Error", {
        description: "An error occurred while uploading the file.",
      })
    },
    onUploadBegin: () => { },
  })

  const dismissActiveToast = () => {
    if (activeToastRef.current) {
      toast.dismiss(activeToastRef.current)
      activeToastRef.current = null
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    // Guest rate limit check
    if (!isSignedIn) {
      const quota = checkGuestQuotaClient()
      if (!quota.allowed) {
        toast.error("Daily limit reached", {
          description: "You've used all 10 free summaries today. Try again tomorrow or sign in for unlimited access!",
          duration: 6000,
        })
        return
      }
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadStage('parsing-client')
    setUploadProgress(0)
    setStreamingText("")
    setParseProgress("")
    cancelUploadRef.current = false
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    didErrorRef.current = false

    let currentToastId: string | number | null = null

    try {
      // ── Step 1: Client-side PDF text extraction ────────────────
      currentToastId = toast.loading(`Extracting text from ${files.length} PDF${files.length !== 1 ? "s" : ""}...`)
      activeToastRef.current = currentToastId
      setUploadProgress(5)

      const parseResult: BatchParseResult = await parsePdfsInBrowser(
        files,
        (parsed, total) => {
          setParseProgress(`Parsed ${parsed}/${total} PDFs...`)
          setUploadProgress(Math.round((parsed / total) * 20))
        }
      )

      // Report per-file parse errors
      if (parseResult.errors.length > 0) {
        for (const err of parseResult.errors) {
          toast.error(`Failed: ${err.fileName}`, {
            description: err.error,
            duration: 5000,
          })
        }
      }

      // Check if we have any successfully parsed files
      if (parseResult.parsed.length === 0) {
        toast.error("No PDFs could be parsed", {
          description: "None of the uploaded PDFs contain extractable text.",
          id: currentToastId,
        })
        activeToastRef.current = null
        throw new Error("No extractable text found in any PDF")
      }

      // Check combined context limit
      const contextError = checkContextLimit(parseResult)
      if (contextError) {
        toast.error("Content too large", {
          description: contextError,
          id: currentToastId,
          duration: 6000,
        })
        activeToastRef.current = null
        const err = new Error(contextError);
        (err as any).code = "CONTEXT_TOO_LARGE";
        throw err;
      }

      setUploadProgress(25)
      toast.success("Text extracted", {
        description: `${parseResult.parsed.length} PDF${parseResult.parsed.length !== 1 ? "s" : ""} (${parseResult.totalWordCount.toLocaleString()} words, ${parseResult.totalPageCount} pages)`,
        id: currentToastId,
      })
      activeToastRef.current = null

      // ── Step 2: Upload to UploadThing (signed-in only, for storage) ──
      if (cancelUploadRef.current) throw new Error("Upload cancelled")
      let uploadedFileUrl: string | undefined
      if (isSignedIn && files.length === 1) {
        setUploadStage('uploading')
        currentToastId = toast.loading(`Storing PDF for later access...`)
        activeToastRef.current = currentToastId
        setUploadProgress(30)

        try {
          const response = await withTimeout(
            startUpload([files[0]]),
            60000,
            "File storage timed out."
          )
          uploadedFileUrl = response?.[0]?.ufsUrl
          toast.success("File stored", { id: currentToastId })
        } catch {
          // Non-blocking: PDF storage failure shouldn't stop summarization
          toast.warning("File storage skipped", {
            description: "Summary will still be generated. Original PDF won't be available for viewing later.",
            id: currentToastId,
          })
        }
        activeToastRef.current = null
      }

      // ── Step 3: Stream summary from Gemini ──────────────────────
      if (cancelUploadRef.current) throw new Error("Upload cancelled")
      setUploadStage('parsing')
      const fileNames = parseResult.parsed.map(p => p.fileName)
      currentToastId = toast.loading("Generating Summary", {
        description: `Streaming ${summaryStyle} style summary${fileNames.length > 1 ? ` from ${fileNames.length} PDFs` : ""}...`,
      })
      activeToastRef.current = currentToastId
      setUploadProgress(40)

      const { summary, originalWordCount } = await consumeSummarizeTextStream(
        parseResult.combinedText,
        summaryStyle,
        fileNames,
        (partialText) => {
          setStreamingText(partialText)
          setUploadProgress((prev) => Math.min(prev + 0.5, 68))
        },
        abortController.signal,
      )

      setUploadProgress(70)
      toast.success("Summary Generated", {
        description: `${fileNames.length > 1 ? `Combined summary from ${fileNames.length} PDFs` : "Your PDF has been summarized"} successfully!`,
        id: currentToastId,
      })
      activeToastRef.current = null

      // ── Step 4: Save summary ────────────────────────────────────
      setUploadStage('saving')
      currentToastId = toast.loading("Saving Summary", {
        description: "Storing your summary...",
      })
      activeToastRef.current = currentToastId
      setUploadProgress(80)

      const combinedTitle = fileNames.length > 1
        ? `Combined: ${fileNames.map(n => formatFileName(n)).join(", ")}`
        : formatFileName(fileNames[0])

      const combinedFileName = fileNames.length > 1
        ? fileNames.join(" + ")
        : fileNames[0]

      const saveResponse = await withTimeout(
        fetch('/api/save-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileUrl: uploadedFileUrl || "",
            summary,
            title: combinedTitle,
            fileName: combinedFileName,
            summaryStyle,
            originalWordCount,
          }),
        }),
        30000,
        "Failed to save summary. Please try again."
      )

      const savedSummary = await saveResponse.json()

      if (!savedSummary?.success) {
        toast.dismiss(currentToastId)
        activeToastRef.current = null
        throw new Error(savedSummary?.message || "Failed to save summary")
      }

      setUploadProgress(100)
      setUploadStage('success')

      if (isSignedIn) {
        toast.success("Summary Saved", {
          description: "Your summary has been saved successfully!",
          id: currentToastId,
        })
        activeToastRef.current = null
        onUploadComplete?.()

        // Fire-and-forget: trigger embedding generation
        if (savedSummary.data?.[0]?.id) {
          setUploadStage('indexing')
          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              summaryId: savedSummary.data[0].id,
              message: '__index__',
              history: [],
            }),
          }).catch((err) => console.error('Embedding indexing failed:', err))
        }
      } else {
        toast.success("Summary Generated!", {
          description: "Sign in to save summaries permanently and chat with your PDFs.",
          id: currentToastId,
          duration: 5000,
        })
        activeToastRef.current = null
        onUploadComplete?.()
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      if (savedSummary.data?.[0]?.id) {
        router.push(`/summary/${savedSummary.data[0].id}`)
      }

    } catch (error) {
      dismissActiveToast()
      setUploadStage('error')
      didErrorRef.current = true
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setUploadError(errorMessage)

      const isUnsupportedPDF = errorMessage.includes("no extractable text") || errorMessage.includes("scanned")
      const isTimeout = errorMessage.includes("timed out") || errorMessage.includes("timeout")
      const isRateLimit = errorMessage.includes("rate limit") || errorMessage.includes("quota") || (error as any)?.code === "RATE_LIMIT_EXCEEDED"
      const isContextTooLarge = (error as any)?.code === "CONTEXT_TOO_LARGE"

      if (!isContextTooLarge) {
        // Context errors are already toasted above
        toast.error(
          isUnsupportedPDF ? "Unsupported PDF Format" :
            isTimeout ? "Request Timeout" :
              isRateLimit ? "Daily Limit Reached" : "Process Failed",
          {
            description: isRateLimit
              ? "You've used all 10 free summaries today. Try again tomorrow or sign in for unlimited access!"
              : errorMessage,
            duration: isRateLimit ? 6000 : undefined,
          }
        )
      }
    } finally {
      if (!didErrorRef.current) {
        setTimeout(() => {
          setFiles([])
          setIsUploading(false)
          setUploadStage('idle')
          setUploadProgress(0)
          setStreamingText("")
          setParseProgress("")
        }, 1000)
      } else {
        setIsUploading(false)
      }
    }
  }

  const retryUpload = () => {
    setUploadError(null)
    setUploadStage('idle')
    setUploadProgress(0)
    setStreamingText("")
    setParseProgress("")
    handleUpload()
  }

  const cancelUpload = () => {
    cancelUploadRef.current = true
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsUploading(false)
    setUploadStage('idle')
    setUploadProgress(0)
    setStreamingText("")
    setParseProgress("")
    dismissActiveToast()
    toast.error("Upload Cancelled", {
      description: "The file upload was cancelled.",
    })
  }

  const handleFilesSelect = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles])
    setValidationError(null)
  }

  const handleError = (error: string) => {
    setValidationError(error)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setValidationError(null)
  }

  const clearFiles = () => {
    setFiles([])
    setValidationError(null)
  }

  return {
    files,
    isUploading,
    uploadStage,
    uploadProgress,
    validationError,
    uploadError,
    summaryStyle,
    setSummaryStyle,
    streamingText,
    parseProgress,
    handleUpload,
    cancelUpload,
    retryUpload,
    handleFilesSelect,
    handleError,
    removeFile,
    clearFiles,
  }
}