import { FileIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MAX_FILE_COUNT } from "@/lib/pdf-parser-client"

interface FilePreviewProps {
  files: File[]
  onRemoveFile: (index: number) => void
}

export function FilePreview({ files, onRemoveFile }: FilePreviewProps) {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="mt-6 space-y-2">
      {/* File count badge */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
        <span className="font-medium">
          {files.length} PDF{files.length !== 1 ? "s" : ""} selected
          <span className="text-xs ml-1">({(totalSize / (1024 * 1024)).toFixed(2)} MB total)</span>
        </span>
        <span className="text-xs">{files.length}/{MAX_FILE_COUNT} max</span>
      </div>

      {/* File list */}
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileIcon className="h-6 w-6 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-md">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={() => onRemoveFile(index)}
            aria-label={`Remove ${file.name}`}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}