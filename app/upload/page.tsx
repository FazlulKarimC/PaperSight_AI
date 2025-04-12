"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropZone } from "@/components/ui/upload/dropzone"
import { FilePreview } from "@/components/ui/upload/file-preview"
import { usePDFUpload } from "@/hooks/use-pdf-upload"
import Link from "next/link"

export default function PdfUploadForm() {
  const {
    file,
    isUploading,
    validationError,
    handleUpload,
    cancelUpload,
    handleFileSelect,
    handleError,
    removeFile,
  } = usePDFUpload()

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <DropZone
            onFileSelect={handleFileSelect}
            onError={handleError}
            disabled={!!file || isUploading}
          />

          {validationError && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {validationError}
            </div>
          )}

          {file && !isUploading && <FilePreview file={file} onRemove={removeFile} />}

          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Uploading {file?.name}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={cancelUpload}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!isUploading && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleUpload} disabled={!file || isUploading} className="px-8">
                Upload PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Link href="/dashboard" className="pt-2 text-sm text-muted-foreground hover:text-primary">
        <Button>View Summaries</Button>
      </Link>
    </div>
  )
}
