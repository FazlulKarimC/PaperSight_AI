import type React from "react"
import type { Metadata } from "next"
import { Geist, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { ErrorBoundary } from "@/components/ui/error"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://papersight.vercel.app"),
  title: {
    default: "PaperSight AI — Read Less, Know More",
    template: "%s | PaperSight AI",
  },
  description:
    "Transform lengthy research papers, reports, and PDFs into clear, actionable summaries in seconds — then chat with them using AI-powered RAG. Free to try, no sign-up required.",
  keywords: [
    "AI PDF summarizer",
    "research paper summarizer",
    "PDF to summary",
    "chat with PDF",
    "RAG AI",
    "document analysis AI",
    "academic paper summarizer",
    "PaperSight AI",
    "AI document reader",
    "PDF reader AI",
  ],
  authors: [{ name: "Fazlul Karim", url: "https://github.com/FazlulKarimC" }],
  creator: "Fazlul Karim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://papersight.vercel.app",
    siteName: "PaperSight AI",
    title: "PaperSight AI — Read Less, Know More",
    description:
      "Transform lengthy research papers and PDFs into clear, actionable summaries in seconds. Chat with your documents using AI-powered RAG.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PaperSight AI — AI-Powered PDF Summarization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PaperSight AI — Read Less, Know More",
    description:
      "Transform lengthy research papers and PDFs into clear summaries in seconds. Chat with your documents using AI.",
    images: ["/og-image.png"],
    creator: "@FazlulKarim_fk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://papersight.vercel.app",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geist.variable} ${instrumentSerif.variable} font-sans antialiased`}>
          <div className="mesh-gradient" aria-hidden="true" />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
