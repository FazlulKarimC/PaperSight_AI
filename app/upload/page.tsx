"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropZone } from "@/components/ui/upload/dropzone"
import { FilePreview } from "@/components/ui/upload/file-preview"
import { usePDFUpload } from "@/hooks/use-pdf-upload"
import Link from "next/link"
import { Navbar } from "@/components/hero-section"
import { FileText } from "lucide-react";

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
    <div className="min-h-screen w-full relative mx-auto my-10 flex max-w-7xl flex-col items-stretch justify-center">
      <Navbar />
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="px-8 py-4 md:py-20 flex justify-between w-full">
        <div>
          <h1 className="font-bold tracking-tight text-foreground mb-2">Upload PDF</h1>
          <p className="text-muted-foreground">Transform your PDFs into concise, actionable insights</p>
        </div>
        <Link href="/dashboard">
          <Button className="mt-4 sm:mt-0">
            <FileText className="w-4 h-4" />
            All Summaries
          </Button>
        </Link>
      </div>

      <div className="md:w-2xl flex flex-col p-4 w-full m-auto">
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
      </div>
    </div>
  )
}
