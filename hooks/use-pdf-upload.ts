import { useState, useRef } from "react"
import { toast } from "sonner"
import { useUploadThing } from "@/utils/uploadthing"
import { formatFileName } from "@/utils/fileNameFormatter"
import { useRouter } from "next/navigation"
import type { SummaryStyle } from "@/lib/utils"

interface UsePDFUploadOptions {
  onUploadComplete?: () => void
  isSignedIn?: boolean
}

export type UploadStage = 'idle' | 'uploading' | 'parsing' | 'saving' | 'success' | 'error'

export interface TrialSummary {
  fileUrl: string
  fileName: string
  title: string
  summary: string
  createdAt: string
  wordCount: number
  originalWordCount: number
  summaryStyle: SummaryStyle
}

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
 * Reads the /api/summarize SSE stream and returns accumulated summary + metadata
 */
async function consumeSummarizeStream(
  fileUrl: string,
  style: SummaryStyle,
  onChunk?: (text: string) => void,
): Promise<{ summary: string; originalWordCount: number }> {
  const res = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrl, style }),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(errorBody.error || `Server error: ${res.status}`)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error("No response stream available")

  const decoder = new TextDecoder()
  let buffer = ""
  let summary = ""
  let originalWordCount = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Process complete SSE events (each ends with \n\n)
    const events = buffer.split("\n\n")
    buffer = events.pop() ?? "" // keep incomplete event in buffer

    for (const event of events) {
      const line = event.trim()
      if (!line.startsWith("data: ")) continue

      const data = JSON.parse(line.slice(6))
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
  }

  if (!summary) throw new Error("No summary received from stream")
  return { summary, originalWordCount }
}

export function usePDFUpload({ onUploadComplete, isSignedIn = true }: UsePDFUploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>('viral')
  const [streamingText, setStreamingText] = useState<string>("")
  const cancelUploadRef = useRef<boolean>(false)
  const activeToastRef = useRef<string | number | null>(null)
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
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    setUploadStage('uploading')
    setUploadProgress(0)
    setStreamingText("")
    cancelUploadRef.current = false

    let currentToastId: string | number | null = null

    try {
      // Step 1: Upload file to storage
      currentToastId = toast.loading(`Uploading ${file.name}...`)
      activeToastRef.current = currentToastId
      setUploadProgress(10)

      const response = await withTimeout(
        startUpload([file]),
        60000,
        "Upload timed out. Please try again with a smaller file."
      )

      if (!response) {
        toast.error("Upload failed", {
          description: "An error occurred while uploading the file.",
          id: currentToastId,
        })
        activeToastRef.current = null
        throw new Error("Upload failed")
      }

      setUploadProgress(40)
      toast.success(`Upload Successful`, {
        description: `${file.name} has been uploaded successfully.`,
        id: currentToastId,
      })
      activeToastRef.current = null

      const uploadedFileUrl = response[0]?.ufsUrl
      if (!uploadedFileUrl) throw new Error("No file URL returned from upload")

      // Step 2: Stream summary from /api/summarize (SSE)
      setUploadStage('parsing')
      currentToastId = toast.loading("Generating Summary", {
        description: `Streaming ${summaryStyle} style summary...`,
      })
      activeToastRef.current = currentToastId
      setUploadProgress(50)

      const { summary, originalWordCount } = await consumeSummarizeStream(
        uploadedFileUrl,
        summaryStyle,
        (partialText) => {
          setStreamingText(partialText)
          // Smoothly increment progress during streaming
          setUploadProgress((prev) => Math.min(prev + 0.5, 68))
        }
      )

      setUploadProgress(70)
      toast.success(`Summary Generated`, {
        description: "Your PDF has been summarized successfully!",
        id: currentToastId,
      })
      activeToastRef.current = null

      // Step 3: Save or redirect
      if (isSignedIn) {
        setUploadStage('saving')
        currentToastId = toast.loading("Saving Summary", {
          description: "Storing your summary...",
        })
        activeToastRef.current = currentToastId
        setUploadProgress(80)

        const saveResponse = await withTimeout(
          fetch('/api/save-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileUrl: uploadedFileUrl,
              summary,
              title: formatFileName(file.name),
              fileName: file.name,
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
        toast.success("Summary Saved", {
          description: "Your summary has been saved successfully!",
          id: currentToastId,
        })
        activeToastRef.current = null
        onUploadComplete?.()

        await new Promise(resolve => setTimeout(resolve, 1000))

        if (savedSummary.data?.[0]?.id) {
          router.push(`/summary/${savedSummary.data[0].id}`)
        }
      } else {
        // Guest user: store in sessionStorage
        setUploadStage('saving')
        setUploadProgress(90)

        const trialSummary: TrialSummary = {
          fileUrl: uploadedFileUrl,
          fileName: file.name,
          title: formatFileName(file.name),
          summary,
          createdAt: new Date().toISOString(),
          wordCount: summary.split(/\s+/).length,
          originalWordCount,
          summaryStyle,
        }

        sessionStorage.setItem('trialSummary', JSON.stringify(trialSummary))

        setUploadProgress(100)
        setUploadStage('success')
        onUploadComplete?.()

        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/summary/trial')
      }

    } catch (error) {
      dismissActiveToast()
      setUploadStage('error')
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setUploadError(errorMessage)

      const isUnsupportedPDF = errorMessage.includes("no extractable text") || errorMessage.includes("scanned")
      const isTimeout = errorMessage.includes("timed out") || errorMessage.includes("timeout")
      const isRateLimit = errorMessage.includes("rate limit") || errorMessage.includes("quota")

      toast.error(
        isUnsupportedPDF ? "Unsupported PDF Format" :
          isTimeout ? "Request Timeout" :
            isRateLimit ? "Rate Limit Reached" : "Process Failed",
        { description: errorMessage }
      )
    } finally {
      if (uploadStage !== 'error') {
        setTimeout(() => {
          setFile(null)
          setIsUploading(false)
          setUploadStage('idle')
          setUploadProgress(0)
          setStreamingText("")
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
    handleUpload()
  }

  const cancelUpload = () => {
    cancelUploadRef.current = true
    setIsUploading(false)
    toast.error("Upload Cancelled", {
      description: "The file upload was cancelled.",
    })
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setValidationError(null)
  }

  const handleError = (error: string) => {
    setValidationError(error)
    setFile(null)
  }

  const removeFile = () => {
    setFile(null)
    setValidationError(null)
  }

  return {
    file,
    isUploading,
    uploadStage,
    uploadProgress,
    validationError,
    uploadError,
    summaryStyle,
    setSummaryStyle,
    streamingText,
    handleUpload,
    cancelUpload,
    retryUpload,
    handleFileSelect,
    handleError,
    removeFile,
  }
}