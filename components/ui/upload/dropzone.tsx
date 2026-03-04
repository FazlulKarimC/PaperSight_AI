import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadIcon } from "lucide-react"
import { MAX_FILE_SIZE_BYTES, MAX_FILE_COUNT, validateFiles } from "@/lib/pdf-parser-client"

interface DropZoneProps {
  onFilesSelect: (files: File[]) => void
  onError: (error: string) => void
  disabled?: boolean
  currentFileCount?: number
}

export function DropZone({ onFilesSelect, onError, disabled, currentFileCount = 0 }: DropZoneProps) {
  const remainingSlots = MAX_FILE_COUNT - currentFileCount

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      // Combine with check for total count
      if (acceptedFiles.length > remainingSlots) {
        onError(`You can add ${remainingSlots} more PDF${remainingSlots !== 1 ? "s" : ""} (max ${MAX_FILE_COUNT} total).`)
        return
      }

      // Validate all files
      const errors = validateFiles(acceptedFiles)
      if (errors.length > 0) {
        onError(errors.join(" "))
        return
      }

      onFilesSelect(acceptedFiles)
    },
    [onFilesSelect, onError, remainingSlots]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: remainingSlots,
    multiple: true,
    maxSize: MAX_FILE_SIZE_BYTES,
    onDropRejected: (rejections) => {
      const errors = rejections.map((r) => {
        const fileName = r.file.name
        const reasons = r.errors.map((e) => {
          if (e.code === "file-too-large") {
            const sizeMB = (r.file.size / (1024 * 1024)).toFixed(1)
            return `"${fileName}" is ${sizeMB}MB — max 16MB per file.`
          }
          if (e.code === "file-invalid-type") return `"${fileName}" is not a PDF.`
          if (e.code === "too-many-files") return `Max ${MAX_FILE_COUNT} files allowed.`
          return e.message
        })
        return reasons.join(" ")
      })
      onError(errors.join(" "))
    },
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${isDragActive ? "border-accent bg-accent/5 surface-sunken" : "border-muted-foreground/20 hover:border-accent/50"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <input {...getInputProps()} disabled={disabled} />
      <div className="flex flex-col items-center justify-center gap-3">
        <UploadIcon className={`h-10 w-10 transition-colors duration-200 ${isDragActive ? "text-accent" : "text-muted-foreground"}`} />
        <div>
          <p className="font-medium">
            {isDragActive
              ? "Drop to upload"
              : currentFileCount > 0
                ? `Add more PDFs (${currentFileCount}/${MAX_FILE_COUNT})`
                : "Drag & drop up to 5 PDFs here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          PDF files up to 16MB each • max {MAX_FILE_COUNT} files • batch creates one combined summary
        </p>
      </div>
    </div>
  )
}