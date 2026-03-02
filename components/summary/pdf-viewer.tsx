"use client"

import { useState } from "react"
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels"
import { GripVertical, Maximize2, Minimize2 } from "lucide-react"

interface PdfViewerProps {
    fileUrl: string
    children: React.ReactNode
}

export function PdfSplitView({ fileUrl, children }: PdfViewerProps) {
    const [showPdf, setShowPdf] = useState(false)

    if (!showPdf) {
        return (
            <div>
                <button
                    onClick={() => setShowPdf(true)}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all duration-200"
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
            <PanelGroup direction="horizontal" className="rounded-xl border border-border overflow-hidden">
                {/* Summary Panel */}
                <Panel defaultSize={50} minSize={30}>
                    <div className="h-[75vh] overflow-y-auto p-6 bg-card">
                        {children}
                    </div>
                </Panel>

                {/* Resize Handle */}
                <PanelResizeHandle className="w-2 bg-border hover:bg-accent/30 transition-colors duration-200 flex items-center justify-center group">
                    <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </PanelResizeHandle>

                {/* PDF Panel */}
                <Panel defaultSize={50} minSize={25}>
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
