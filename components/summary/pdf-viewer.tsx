"use client"

import { useState, useEffect } from "react"
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels"
import { GripVertical, Maximize2, Minimize2 } from "lucide-react"
import { toast } from "sonner"

interface PdfViewerProps {
    fileUrl: string
    children: React.ReactNode
}

export function PdfSplitView({ fileUrl, children }: PdfViewerProps) {
    const [showPdf, setShowPdf] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    const handleToggle = () => {
        if (isMobile) {
            toast.info("Desktop only", {
                description: "Split PDF view is only available on desktop screens.",
            })
            return
        }
        setShowPdf(true)
    }

    if (!showPdf) {
        return (
            <div>
                <button
                    onClick={handleToggle}
                    className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${isMobile
                        ? "border-border bg-secondary/30 text-muted-foreground/50 cursor-not-allowed"
                        : "border-border bg-secondary/50 text-muted-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/30"
                        }`}
                >
                    <Maximize2 className="h-4 w-4" />
                    View alongside PDF
                </button>
                {children}
            </div>
        )
    }

    return (
        <div>
            <button
                onClick={() => setShowPdf(false)}
                className="mb-4 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/20"
            >
                <Minimize2 className="h-4 w-4" />
                Close PDF view
            </button>
            <PanelGroup
                direction="horizontal"
                className="rounded-xl border border-border overflow-hidden"
            >
                {/* Summary Panel */}
                <Panel defaultSize={50} minSize={25}>
                    <div className="h-[75vh] overflow-y-auto bg-card">
                        {children}
                    </div>
                </Panel>

                {/* Resize Handle */}
                <PanelResizeHandle
                    className="w-2 bg-border hover:bg-accent/30 transition-colors duration-200 flex items-center justify-center group"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </PanelResizeHandle>

                {/* PDF Panel */}
                <Panel defaultSize={50} minSize={20}>
                    <iframe
                        src={fileUrl}
                        className="w-full h-[75vh] bg-secondary"
                        title="Original PDF"
                    />
                </Panel>
            </PanelGroup>
        </div>
    )
}
