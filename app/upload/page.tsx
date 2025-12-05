"use client"

import { Button } from "@/components/ui/button"
import { DropZone } from "@/components/ui/upload/dropzone"
import { FilePreview } from "@/components/ui/upload/file-preview"
import { usePDFUpload } from "@/hooks/use-pdf-upload"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, AlertCircleIcon, ArrowLeft, CheckCircle2, Upload, FileSearch, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageTransition } from "@/components/ui/loading/page-transition"
import { ProgressBar } from "@/components/ui/loading/progress-bar"
import { InlineError } from "@/components/ui/error/error-display"
import { motion, AnimatePresence } from "framer-motion"
import { fadeIn, scale } from "@/lib/animations"

export default function PdfUploadForm() {
  const {
    file,
    isUploading,
    uploadStage,
    uploadProgress,
    validationError,
    uploadError,
    handleUpload,
    retryUpload,
    handleFileSelect,
    handleError,
    removeFile,
  } = usePDFUpload()

  const getStageInfo = () => {
    switch (uploadStage) {
      case 'uploading':
        return { icon: Upload, text: 'Uploading file...', color: 'text-accent' }
      case 'parsing':
        return { icon: FileSearch, text: 'Parsing PDF...', color: 'text-accent' }
      case 'saving':
        return { icon: Save, text: 'Saving summary...', color: 'text-accent' }
      case 'success':
        return { icon: CheckCircle2, text: 'Success! Redirecting...', color: 'text-green-500' }
      case 'error':
        return { icon: AlertCircleIcon, text: 'Upload failed', color: 'text-destructive' }
      default:
        return null
    }
  }

  const stageInfo = getStageInfo()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Progress bar at top */}
      {isUploading && <ProgressBar progress={uploadProgress} />}

      <PageTransition>
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
              <AlertDescription className="text-destructive">
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

                {file && !isUploading && uploadStage === 'idle' && <FilePreview file={file} onRemove={removeFile} />}

                {/* Upload Progress with Stage Transitions */}
                <AnimatePresence mode="wait">
                  {isUploading && stageInfo && (
                    <motion.div
                      key={uploadStage}
                      variants={fadeIn}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <stageInfo.icon className={`h-5 w-5 ${stageInfo.color} ${uploadStage !== 'success' ? 'animate-pulse' : ''}`} />
                          <p className="text-sm font-medium text-foreground">{stageInfo.text}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-accent h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {file?.name}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Animation */}
                <AnimatePresence>
                  {uploadStage === 'success' && (
                    <motion.div
                      variants={scale}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Upload Complete!</p>
                          <p className="text-xs text-muted-foreground">Redirecting to your summary...</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error State with Retry */}
                {uploadError && uploadStage === 'error' && (
                  <div className="mt-6">
                    <InlineError message={uploadError} onRetry={retryUpload} />
                  </div>
                )}

                {file && !isUploading && uploadStage === 'idle' && (
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
                <div className="text-3xl font-bold text-accent mb-2">4MB</div>
                <p className="text-sm text-muted-foreground">Max file size (free tier)</p>
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
      </PageTransition>

      <Footer />
    </div>
  )
}
