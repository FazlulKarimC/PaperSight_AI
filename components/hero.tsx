"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircleIcon, CheckCircle2, Upload, FileSearch, Save } from "lucide-react"
import { DropZone } from "@/components/ui/upload/dropzone"
import { FilePreview } from "@/components/ui/upload/file-preview"
import { useUser } from "@clerk/nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePDFUpload } from "@/hooks/use-pdf-upload"
import { ProgressBar } from "@/components/ui/loading/progress-bar"
import { InlineError } from "@/components/ui/error/error-display"
import { motion, AnimatePresence } from "framer-motion"
import { fadeIn, scale } from "@/lib/animations"

export function Hero() {
  const { isSignedIn } = useUser()
  const uploadSectionRef = useRef<HTMLDivElement>(null)

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
  } = usePDFUpload({ isSignedIn: isSignedIn ?? false })

  const handleStartClick = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getStageInfo = () => {
    switch (uploadStage) {
      case 'uploading':
        return { icon: Upload, text: 'Uploading file...', color: 'text-accent' }
      case 'parsing':
        return { icon: FileSearch, text: 'Generating summary...', color: 'text-accent' }
      case 'saving':
        return { icon: Save, text: isSignedIn ? 'Saving summary...' : 'Preparing summary...', color: 'text-accent' }
      case 'success':
        return { icon: CheckCircle2, text: 'Success! Redirecting...', color: 'text-green-500' }
      case 'error':
        return { icon: AlertCircleIcon, text: 'Process failed', color: 'text-destructive' }
      default:
        return null
    }
  }

  const stageInfo = getStageInfo()

  return (
    <section className="pt-32 pb-20">
      {/* Progress bar at top */}
      {isUploading && <ProgressBar progress={uploadProgress} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Powered by advanced AI models
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
          The fastest way to
          <br />
          <span className="text-muted-foreground">summarize any PDF</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Transform lengthy documents into clear, actionable summaries in seconds. Extract key insights without reading
          hundreds of pages.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-8"
            onClick={handleStartClick}
          >
            Start summarizing <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View demo
          </Button>
        </div>

        <div ref={uploadSectionRef} className="mt-16 mx-auto max-w-4xl">
          <Alert className="mb-4">
            <AlertCircleIcon className="w-4 h-4" color="red" />
            <AlertDescription className="text-primary/50">
              Please do not upload images or scanned PDFs. Only text-based PDFs are supported for summarization.
            </AlertDescription>
          </Alert>

          {!isSignedIn && (
            <Alert className="mb-4">
              <AlertCircleIcon className="w-4 h-4" color="red" />
              <AlertDescription className="text-primary/50">
                You can try our service without signing in! Note that summaries won&apos;t be saved to your account.
              </AlertDescription>
            </Alert>
          )}

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
        </div>
      </div>
    </section>
  )
}
