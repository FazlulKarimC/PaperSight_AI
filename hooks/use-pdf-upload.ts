import { useState, useRef } from "react"
import { toast } from "sonner"
import { useUploadThing } from "@/utils/uploadthing"
import { savePDFSummary, summarizePDF } from "@/actions/summarizePDF"
import { formatFileName } from "@/utils/fileNameFormatter"
import { useRouter } from "next/navigation"

interface UsePDFUploadOptions {
  onUploadComplete?: () => void
}

export function usePDFUpload({ onUploadComplete }: UsePDFUploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
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
    cancelUploadRef.current = false

    try {
      // Step 1: Upload file
      const toastId = toast.loading(`Uploading ${file.name}...`)
      const response = await startUpload([file])

      if (!response) {
        throw new Error("Upload failed")
      }

      toast.success(`Upload Successful`, {
        description: `${file.name} has been uploaded successfully.`,
        id: toastId,
      })

      // Step 2: Parse PDF
      const summaryToastId = toast.loading("Parsing PDF", {
        description: "Parsing the PDF file...",
      })
      
      const summary = await summarizePDF(response[0]?.ufsUrl)
      if (!summary?.success) {
        throw new Error(summary?.message || "Failed to summarize PDF")
      }

      toast.success(`Parse Successful`, {
        description: "The PDF file has been parsed successfully.",
        id: summaryToastId
      })

      // Step 3: Save to database
      const saveToastId = toast.loading("Saving summary...", {
        description: "Saving the summary to the database...",
      })

      const savedSummary = await savePDFSummary({
        fileUrl: response[0].ufsUrl,
        summary: summary.data,
        title: formatFileName(file.name),
        fileName: file.name,
      })

      if (!savedSummary?.success) {
        throw new Error(savedSummary?.message || "Failed to save summary")
      }

      toast.success(`Save Successful`, {
        description: "The summary has been saved to the database.",
        id: saveToastId,
      })

      onUploadComplete?.()
      
      // Redirect to the summary page
      if (savedSummary.data?.[0]?.id) {
        router.push(`/summary/${savedSummary.data[0].id}`)
      }

    } catch (error) {
      toast.error("Process Failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      // Reset form
      setTimeout(() => {
        setFile(null)
        setIsUploading(false)
      }, 1000)
    }
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
    validationError,
    handleUpload,
    cancelUpload,
    handleFileSelect,
    handleError,
    removeFile,
  }
}