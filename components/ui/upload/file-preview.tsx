import { FileIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilePreviewProps {
  file: File
  onRemove: () => void
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  return (
    <div className="mt-6 flex items-center justify-between p-4 border rounded-md bg-muted/50">
      <div className="flex items-center gap-3">
        <FileIcon className="h-8 w-8 text-primary" />
        <div>
          <p className="font-medium truncate max-w-[250px] sm:max-w-md">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove file">
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}