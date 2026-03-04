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
  title: "PaperSight AI - AI-Powered PDF Summarization",
  description: "Transform lengthy PDFs into clear, actionable summaries in seconds. Powered by advanced AI.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
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
