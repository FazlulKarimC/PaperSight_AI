import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadIcon } from "lucide-react"
import { z } from "zod"

// Constants
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8MB
const ACCEPTED_FILE_TYPES = ["application/pdf"]

// Validation schema
const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than 8MB.`,
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only PDF files are accepted.",
    }),
})

interface DropZoneProps {
  onFileSelect: (file: File) => void
  onError: (error: string) => void
  disabled?: boolean
}

export function DropZone({ onFileSelect, onError, disabled }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const selectedFile = acceptedFiles[0]
      try {
        fileSchema.parse({ file: selectedFile })
        onFileSelect(selectedFile)
      } catch (error) {
        if (error instanceof z.ZodError) {
          onError(error.errors[0].message)
        }
      }
    },
    [onFileSelect, onError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <input {...getInputProps()} disabled={disabled} />
      <div className="flex flex-col items-center justify-center gap-3">
        <UploadIcon className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium">{isDragActive ? "Drop the PDF here" : "Drag & drop your PDF here"}</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Only PDF files up to 8MB are accepted</p>
      </div>
    </div>
  )
}