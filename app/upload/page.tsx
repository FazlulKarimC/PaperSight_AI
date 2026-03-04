"use client"

import { Button } from "@/components/ui/button"
import { DropZone } from "@/components/ui/upload/dropzone"
import { FilePreview } from "@/components/ui/upload/file-preview"
import { usePDFUpload } from "@/hooks/use-pdf-upload"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, AlertCircleIcon, ArrowLeft, CheckCircle2, Upload, FileSearch, Save, ScanText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageTransition } from "@/components/ui/loading/page-transition"
import { ProgressBar } from "@/components/ui/loading/progress-bar"
import { InlineError } from "@/components/ui/error/error-display"
import { LoadingSkeleton } from "@/components/summary/loading-skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { fadeIn, scale } from "@/lib/animations"
import { SUMMARY_STYLES } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { MAX_FILE_COUNT } from "@/lib/pdf-parser-client"

export default function PdfUploadForm() {
  const { isSignedIn } = useUser()
  const {
    files,
    isUploading,
    uploadStage,
    uploadProgress,
    validationError,
    uploadError,
    summaryStyle,
    setSummaryStyle,
    streamingText,
    parseProgress,
    handleUpload,
    retryUpload,
    handleFilesSelect,
    handleError,
    removeFile,
    clearFiles,
  } = usePDFUpload({ isSignedIn: !!isSignedIn })

  const getStageInfo = () => {
    switch (uploadStage) {
      case 'parsing-client':
        return { icon: ScanText, text: parseProgress || 'Extracting text from PDFs...', color: 'text-accent' }
      case 'uploading':
        return { icon: Upload, text: 'Storing file...', color: 'text-accent' }
      case 'parsing':
        return { icon: FileSearch, text: 'AI is analyzing your document...', color: 'text-accent' }
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
  const hasFiles = files.length > 0
  const canAddMore = files.length < MAX_FILE_COUNT

  return (
    <div className="relative min-h-screen bg-background">
      <Header />

      {isUploading && <ProgressBar progress={uploadProgress} />}

      <PageTransition>
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link href={isSignedIn ? "/dashboard" : "/"}>
              <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                {isSignedIn ? "Back to Dashboard" : "Back to Home"}
              </Button>
            </Link>

            {/* Page Header */}
            <div className="mb-12">
              <div className="mono-label mb-4">Upload</div>
              <h1 className="heading-display text-4xl sm:text-5xl text-foreground mb-4">
                Upload Your PDFs
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Upload up to {MAX_FILE_COUNT} PDFs at once for a combined summary,
                or a single PDF for a focused analysis.
              </p>
            </div>

            {/* Alert */}
            <Alert className="mb-6 surface-raised">
              <AlertCircleIcon className="w-4 h-4 text-accent" />
              <AlertDescription className="text-muted-foreground">
                Only text-based PDFs are supported. Scanned images cannot be processed.
              </AlertDescription>
            </Alert>

            {/* Upload Section */}
            <div className="relative rounded-xl surface-raised p-8 sm:p-12">
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/8 via-transparent to-transparent" />
              <div className="relative">
                {/* Dropzone */}
                {(!hasFiles || canAddMore) && !isUploading && uploadStage === 'idle' && (
                  <DropZone
                    onFilesSelect={handleFilesSelect}
                    onError={handleError}
                    disabled={isUploading}
                    currentFileCount={files.length}
                  />
                )}

                {validationError && (
                  <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                    {validationError}
                  </div>
                )}

                {/* File List Preview */}
                {hasFiles && !isUploading && uploadStage === 'idle' && (
                  <FilePreview files={files} onRemoveFile={removeFile} />
                )}

                {/* Summary Style Selector */}
                {hasFiles && !isUploading && uploadStage === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-6"
                  >
                    <label className="mono-label mb-3 block">Summary Style</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {SUMMARY_STYLES.map((style) => (
                        <button
                          key={style.value}
                          type="button"
                          onClick={() => setSummaryStyle(style.value)}
                          className={`
                            relative flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-all duration-200
                            ${summaryStyle === style.value
                              ? 'border-accent bg-accent/10 text-accent shadow-sm shadow-accent/10'
                              : 'border-border bg-secondary/50 text-muted-foreground hover:border-accent/40 hover:bg-accent/5'
                            }
                          `}
                        >
                          <span className="text-lg">{style.icon}</span>
                          <span className="font-medium text-xs">{style.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {SUMMARY_STYLES.find(s => s.value === summaryStyle)?.description}
                    </p>
                  </motion.div>
                )}

                {/* Upload Progress with Stage Transitions */}
                <AnimatePresence mode="wait">
                  {isUploading && stageInfo && uploadStage !== 'parsing' && (
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
                        <p className="mono-label">{uploadProgress}%</p>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="bg-accent h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {files.length === 1 ? files[0]?.name : `${files.length} PDFs`}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Skeleton Loader during AI streaming */}
                <AnimatePresence>
                  {uploadStage === 'parsing' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6"
                    >
                      {streamingText ? (
                        <div className="rounded-xl surface-raised p-6 max-h-64 overflow-y-auto">
                          <p className="mono-label mb-3 flex items-center gap-2 text-accent">
                            <FileSearch className="h-3.5 w-3.5 animate-pulse" />
                            Streaming summary{files.length > 1 ? ` from ${files.length} PDFs` : ""}...
                          </p>
                          <div className="prose prose-sm prose-invert max-w-none text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                            {streamingText}
                            <span className="inline-block w-1.5 h-4 bg-accent/60 animate-pulse ml-0.5 align-text-bottom" />
                          </div>
                        </div>
                      ) : (
                        <LoadingSkeleton />
                      )}
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

                {/* Action Buttons */}
                {hasFiles && !isUploading && uploadStage === 'idle' && (
                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={clearFiles}>
                      Clear All
                    </Button>
                    <Link href={isSignedIn ? "/dashboard" : "/"}>
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        {isSignedIn ? "View All Summaries" : "Back to Home"}
                      </Button>
                    </Link>
                    <Button
                      onClick={handleUpload}
                      disabled={!hasFiles || isUploading}
                      className="px-8 bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                    >
                      {files.length > 1 ? `Summarize ${files.length} PDFs` : "Upload & Summarize"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              <div className="text-center p-6 surface-raised rounded-xl">
                <div className="heading-display text-3xl text-accent mb-2">16MB</div>
                <p className="text-sm text-muted-foreground">Max per file</p>
              </div>
              <div className="text-center p-6 surface-raised rounded-xl">
                <div className="heading-display text-3xl text-accent mb-2">{MAX_FILE_COUNT}</div>
                <p className="text-sm text-muted-foreground">PDFs per batch</p>
              </div>
              <div className="text-center p-6 surface-raised rounded-xl">
                <div className="heading-display text-3xl text-accent mb-2">AI</div>
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
