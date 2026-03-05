import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Upload PDF",
    description:
        "Upload your PDF to get an AI-generated summary in seconds. Supports up to 5 PDFs per batch, 16MB per file. Powered by Gemini AI.",
    robots: { index: false, follow: false },
}

export default function UploadLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
