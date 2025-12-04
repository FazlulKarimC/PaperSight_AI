import { useState, useRef } from "react"
import { toast } from "sonner"
import { useUploadThing } from "@/utils/uploadthing"
import { savePDFSummary, summarizePDF } from "@/actions/summarizePDF"
import { formatFileName } from "@/utils/fileNameFormatter"
import { useRouter } from "next/navigation"

interface UsePDFUploadOptions {
  onUploadComplete?: () => void
}

export type UploadStage = 'idle' | 'uploading' | 'parsing' | 'saving' | 'success' | 'error'

export function usePDFUpload({ onUploadComplete }: UsePDFUploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const cancelUploadRef = useRef<boolean>(false)
  const router = useRouter()

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!")
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err)
      toast.error("Upload Error", {
        description: "An error occurred while uploading the file.",
      })
    },
    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName)
    },
  })

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    setUploadStage('uploading')
    setUploadProgress(0)
    cancelUploadRef.current = false

    try {
      // Step 1: Upload file
      const toastId = toast.loading(`Uploading ${file.name}...`)
      setUploadProgress(10)
      
      const response = await startUpload([file])

      if (!response) {
        toast.error("Upload failed", {
          description: "An error occurred while uploading the file.",
          id: toastId,
        })
        throw new Error("Upload failed")
      }

      setUploadProgress(40)
      toast.success(`Upload Successful`, {
        description: `${file.name} has been uploaded successfully.`,
        id: toastId,
      })

      // Step 2: Parse PDF
      setUploadStage('parsing')
      const summaryToastId = toast.loading("Parsing PDF", {
        description: "Parsing the PDF file...",
      })
      setUploadProgress(50)
      
      const summary = await summarizePDF(response[0]?.ufsUrl)
      if (!summary?.success) {
        throw new Error(summary?.message || "Failed to summarize PDF")
      }

      setUploadProgress(70)
      toast.success(`Parse Successful`, {
        description: "The PDF file has been parsed successfully.",
        id: summaryToastId
      })

      // Step 3: Save to database
      setUploadStage('saving')
      console.log("Saving summary to database...")
      setUploadProgress(80)

      const savedSummary = await savePDFSummary({
        fileUrl: response[0].ufsUrl,
        summary: summary.data,
        title: formatFileName(file.name),
        fileName: file.name,
      })

      if (!savedSummary?.success) {
        throw new Error(savedSummary?.message || "Failed to save summary")
      }

      setUploadProgress(100)
      setUploadStage('success')
      onUploadComplete?.()
    
      // Show success animation before redirect
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to the summary page
      if (savedSummary.data?.[0]?.id) {
        router.push(`/summary/${savedSummary.data[0].id}`)
      }

    } catch (error) {
      setUploadStage('error')
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setUploadError(errorMessage)
      toast.error("Process Failed", {
        description: errorMessage,
      })
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