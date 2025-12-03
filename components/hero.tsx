"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, AlertCircleIcon, X } from "lucide-react"
import { DropZone } from "@/components/ui/upload/dropzone"
import { FilePreview } from "@/components/ui/upload/file-preview"
import { useUser, SignInButton } from "@clerk/nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { useUploadThing } from "@/utils/uploadthing"
import { summarizePDF, savePDFSummary } from "@/actions/summarizePDF"
import { formatFileName } from "@/utils/fileNameFormatter"
import { useRouter } from "next/navigation"

export function Hero() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [trialSummary, setTrialSummary] = useState<string | null>(null)
  const [showTrialModal, setShowTrialModal] = useState(false)
  const cancelUploadRef = useRef<boolean>(false)

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!")
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err)
      toast.error("Upload Error", {
        description: "An error occurred while uploading the file.",
      })
    },
    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName)
    },
  })

  const handleStartClick = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setValidationError(null)
  }

  const handleError = (error: string) => {
    setValidationError(error)
    setFile(null)
  }

  const removeFile = () => {
    setFile(null)
    setValidationError(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    cancelUploadRef.current = false

    try {
      const toastId = toast.loading(`Uploading ${file.name}...`)
      const response = await startUpload([file])

      if (!response) {
        toast.error("Upload failed", {
          description: "An error occurred while uploading the file.",
          id: toastId,
        })
        throw new Error("Upload failed")
      }

      toast.success(`Upload Successful`, {
        description: `${file.name} has been uploaded successfully.`,
        id: toastId,
      })

      const summaryToastId = toast.loading("Generating Summary", {
        description: "AI is analyzing your PDF...",
      })

      const summary = await summarizePDF(response[0]?.url)
      if (!summary?.success) {
        toast.error("Summarization Failed", {
          description: summary?.message || "Failed to summarize PDF",
          id: summaryToastId,
        })
        throw new Error(summary?.message || "Failed to summarize PDF")
      }

      toast.success(`Summary Generated`, {
        description: "Your PDF has been summarized successfully!",
        id: summaryToastId
      })

      if (isSignedIn) {
        console.log("Saving summary to database...")

        const savedSummary = await savePDFSummary({
          fileUrl: response[0].url,
          summary: summary.data,
          title: formatFileName(file.name),
          fileName: file.name,
        })

        if (!savedSummary?.success) {
          throw new Error(savedSummary?.message || "Failed to save summary")
        }

        if (savedSummary.data?.[0]?.id) {
          router.push(`/summary/${savedSummary.data[0].id}`)
        }
      } else {
        setTrialSummary(summary.data)
        setShowTrialModal(true)
        toast.info("Trial Mode", {
          description: "Sign in to save your summaries permanently!",
        })
      }

    } catch (error) {
      toast.error("Process Failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setTimeout(() => {
        setFile(null)
        setIsUploading(false)
      }, 1000)
    }
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
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
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View demo
          </Button>
        </div>

        <div id="upload-section" className="mt-16 mx-auto max-w-4xl">
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
                You can try our service without signing in! Note that summaries won't be saved to your account.
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

              {file && !isUploading && <FilePreview file={file} onRemove={removeFile} />}

              {isUploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Processing {file?.name}</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              )}

              {file && !isUploading && (
                <div className="mt-6 flex justify-end gap-3">
                  {!isSignedIn && (
                    <SignInButton mode="modal">
                      <Button variant="outline">
                        Sign In to Save
                      </Button>
                    </SignInButton>
                  )}
                  <Button onClick={handleUpload} disabled={!file || isUploading} className="px-8">
                    {isSignedIn ? "Upload & Save" : "Try for Free"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTrialModal && trialSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Summary (Trial Mode)</h2>
                <p className="text-sm text-muted-foreground mt-1">Sign in to save this summary permanently</p>
              </div>
              <button
                onClick={() => {
                  setShowTrialModal(false)
                  setTrialSummary(null)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-foreground">{trialSummary}</pre>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Want to save this summary?</p>
              <SignInButton mode="modal">
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  Sign In to Save
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
