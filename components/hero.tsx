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

const MOCK_SUMMARY_LINES = [
  { type: "heading", text: "Key Findings" },
  { type: "body", text: "The study demonstrates a 47% improvement in processing efficiency through the proposed architecture, validated across three independent benchmarks." },
  { type: "body", text: "Latency was reduced from 240ms to 128ms under peak load conditions." },
  { type: "heading", text: "Methodology" },
  { type: "body", text: "Researchers employed a mixed-methods approach combining quantitative analysis of 1,200 production workloads with qualitative interviews from 34 engineering teams." },
]

export function Hero() {
  const { isSignedIn } = useUser()
  const uploadSectionRef = useRef<HTMLDivElement>(null)

  const {
    files,
    isUploading,
    uploadStage,
    uploadProgress,
    validationError,
    uploadError,
    handleUpload,
    retryUpload,
    handleFilesSelect,
    handleError,
    removeFile,
  } = usePDFUpload({ isSignedIn: isSignedIn ?? false })

  const file = files[0] ?? null

  const handleFileSelect = (selectedFile: File) => {
    handleFilesSelect([selectedFile])
  }

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
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Progress bar at top */}
      {isUploading && <ProgressBar progress={uploadProgress} />}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Top section: headline + live preview side by side ── */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-20">
          {/* Left: Editorial headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mono-label mb-6 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
              AI-Powered Document Analysis
            </div>

            <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl text-foreground mb-6">
              Read less,<br />
              <span className="text-accent">know more.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mb-10 text-pretty">
              Transform lengthy research papers, reports, and documents into clear,
              actionable summaries — then chat with them using AI-powered RAG.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-8 font-medium"
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
                See how it works
              </Button>
            </div>
          </motion.div>

          {/* Right: Live mini-summary preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="surface-raised rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="mono-label">AI Summary Preview</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="space-y-3">
                {MOCK_SUMMARY_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                  >
                    {line.type === "heading" ? (
                      <h4 className="heading-display text-lg text-foreground mt-2">{line.text}</h4>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">{line.text}</p>
                    )}
                  </motion.div>
                ))}
                <motion.span
                  className="inline-block w-2 h-4 bg-accent/60 rounded-sm"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              </div>
            </div>
            {/* Decorative glow behind the card */}
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-accent/5 blur-2xl" />
          </motion.div>
        </div>

        {/* ── Upload section ── */}
        <div ref={uploadSectionRef} className="mx-auto max-w-4xl">
          <Alert className="mb-4 surface-raised">
            <AlertCircleIcon className="w-4 h-4 text-accent" />
            <AlertDescription className="text-muted-foreground">
              Only text-based PDFs are supported. Scanned images or image-only PDFs cannot be processed.
            </AlertDescription>
          </Alert>

          {!isSignedIn && (
            <Alert className="mb-4 surface-raised">
              <AlertCircleIcon className="w-4 h-4 text-accent" />
              <AlertDescription className="text-muted-foreground">
                Try without signing in — summaries won&apos;t be saved to an account.
              </AlertDescription>
            </Alert>
          )}

          <div className="relative rounded-xl surface-raised p-8 sm:p-12">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/8 via-transparent to-transparent" />
            <div className="relative">
              <DropZone
                onFilesSelect={(selectedFiles) => handleFilesSelect(selectedFiles)}
                onError={handleError}
                disabled={!!file || isUploading}
              />

              {validationError && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {validationError}
                </div>
              )}

              {file && !isUploading && uploadStage === 'idle' && <FilePreview files={[file]} onRemoveFile={() => removeFile(0)} />}

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
                    className="px-8 bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
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
