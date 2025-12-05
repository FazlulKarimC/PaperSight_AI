import { useState, useRef } from "react"
import { toast } from "sonner"
import { useUploadThing } from "@/utils/uploadthing"
import { summarizePDF } from "@/actions/summarizePDF"
import { formatFileName } from "@/utils/fileNameFormatter"
import { useRouter } from "next/navigation"

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

export function usePDFUpload({ onUploadComplete, isSignedIn = true }: UsePDFUploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const cancelUploadRef = useRef<boolean>(false)
  const activeToastRef = useRef<string | number | null>(null)
  const router = useRouter()

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      // Upload completed successfully
    },
    onUploadError: () => {
      toast.error("Upload Error", {
        description: "An error occurred while uploading the file.",
      })
    },
    onUploadBegin: () => {
      // Upload has begun
    },
  })

  // Helper to dismiss any active loading toast
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
    cancelUploadRef.current = false

    let currentToastId: string | number | null = null

    try {
      // Step 1: Upload file
      currentToastId = toast.loading(`Uploading ${file.name}...`)
      activeToastRef.current = currentToastId
      setUploadProgress(10)

      const response = await withTimeout(
        startUpload([file]),
        60000, // 60 second timeout for upload
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

      // Step 2: Parse PDF
      setUploadStage('parsing')
      currentToastId = toast.loading("Generating Summary", {
        description: "AI is analyzing your PDF...",
      })
      activeToastRef.current = currentToastId
      setUploadProgress(50)

      const summary = await withTimeout(
        summarizePDF(response[0]?.ufsUrl),
        120000, // 120 second timeout for AI processing
        "Summary generation timed out. Please try again."
      )

      if (!summary?.success) {
        toast.dismiss(currentToastId)
        activeToastRef.current = null
        throw new Error(summary?.message || "Failed to summarize PDF")
      }

      setUploadProgress(70)
      toast.success(`Summary Generated`, {
        description: "Your PDF has been summarized successfully!",
        id: currentToastId
      })
      activeToastRef.current = null

      // Step 3: Save or redirect based on sign-in status
      if (isSignedIn) {
        // Logged-in user: save to database via Edge API
        setUploadStage('saving')
        currentToastId = toast.loading("Saving Summary", {
          description: "Storing your summary...",
        })
        activeToastRef.current = currentToastId
        setUploadProgress(80)

        // Use Edge API route instead of server action to bypass body size limits
        const saveResponse = await withTimeout(
          fetch('/api/save-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileUrl: response[0].ufsUrl,
              summary: summary.data,
              title: formatFileName(file.name),
              fileName: file.name,
            }),
          }),
          30000, // 30 second timeout for saving
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
          id: currentToastId
        })
        activeToastRef.current = null
        onUploadComplete?.()

        // Show success animation before redirect
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Redirect to the summary page
        if (savedSummary.data?.[0]?.id) {
          router.push(`/summary/${savedSummary.data[0].id}`)
        }
      } else {
        // Guest user: store in sessionStorage and redirect to trial page
        setUploadStage('saving')
        setUploadProgress(90)

        const trialSummary: TrialSummary = {
          fileUrl: response[0].ufsUrl,
          fileName: file.name,
          title: formatFileName(file.name),
          summary: summary.data || '',
          createdAt: new Date().toISOString(),
          wordCount: (summary.data || '').split(/\s+/).length,
        }

        sessionStorage.setItem('trialSummary', JSON.stringify(trialSummary))

        setUploadProgress(100)
        setUploadStage('success')
        onUploadComplete?.()

        // Show success animation before redirect
        await new Promise(resolve => setTimeout(resolve, 1000))

        router.push('/summary/trial')
      }

    } catch (error) {
      // Always dismiss any active loading toast on error
      dismissActiveToast()

      setUploadStage('error')
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setUploadError(errorMessage)

      // Show specific toast title for scanned/image PDF errors
      const isUnsupportedPDF = errorMessage.includes("no extractable text") || errorMessage.includes("scanned")
      const isTimeout = errorMessage.includes("timed out")

      toast.error(
        isUnsupportedPDF ? "Unsupported PDF Format" :
          isTimeout ? "Request Timeout" : "Process Failed",
        {
          description: errorMessage,
        }
      )
    } finally {
      // Don't reset immediately on error so user can retry
      if (uploadStage !== 'error') {
        setTimeout(() => {
          setFile(null)
          setIsUploading(false)
          setUploadStage('idle')
          setUploadProgress(0)
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
    handleUpload,
    cancelUpload,
    retryUpload,
    handleFileSelect,
    handleError,
    removeFile,
  }
}