import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { ErrorBoundary } from "@/components/ui/error"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PaperSight AI - AI-Powered PDF Summarization",
  description: "Transform lengthy PDFs into clear, actionable summaries in seconds. Powered by advanced AI.",
  generator: "v0.app",
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
        <body className={`${_geist.className} antialiased`}>
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
