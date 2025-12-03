"use client"

import { Button } from "@/components/ui/button"
import { DropZone } from "@/components/ui/upload/dropzone"
import { FilePreview } from "@/components/ui/upload/file-preview"
import { usePDFUpload } from "@/hooks/use-pdf-upload"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, AlertCircleIcon, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PdfUploadForm() {
  const {
    file,
    isUploading,
    validationError,
    handleUpload,
    handleFileSelect,
    handleError,
    removeFile,
  } = usePDFUpload()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-8 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              AI-Powered PDF Summarization
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Upload Your PDF
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform lengthy documents into clear, actionable summaries in seconds
            </p>
          </div>

          {/* Alert */}
          <Alert className="mb-6">
            <AlertCircleIcon className="w-4 h-4" color="red" />
            <AlertDescription className="text-rose-600">
              Please do not upload images or scanned PDFs. Only text-based PDFs are supported for summarization.
            </AlertDescription>
          </Alert>

          {/* Upload Section */}
          <div className="relative rounded-xl border border-border bg-card p-8 sm:p-12">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent"></div>
            <div className="relative">
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
                    <p className="text-sm font-medium text-foreground">Processing {file?.name}</p>
                    <p className="text-sm text-muted-foreground">Please wait...</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full animate-pulse transition-all duration-300" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uploading and analyzing your PDF with AI...
                  </p>
                </div>
              )}

              {file && !isUploading && (
                <div className="mt-6 flex justify-end gap-3">
                  <Link href="/dashboard">
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View All Summaries
                    </Button>
                  </Link>
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="px-8 bg-foreground text-background hover:bg-foreground/90"
                  >
                    Upload & Summarize
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg border border-border bg-card/50">
              <div className="text-3xl font-bold text-accent mb-2">20MB</div>
              <p className="text-sm text-muted-foreground">Maximum file size</p>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-card/50">
              <div className="text-3xl font-bold text-accent mb-2">~30s</div>
              <p className="text-sm text-muted-foreground">Average processing time</p>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-card/50">
              <div className="text-3xl font-bold text-accent mb-2">AI</div>
              <p className="text-sm text-muted-foreground">Powered by Gemini</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
