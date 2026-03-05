import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Cta } from "@/components/cta"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "PaperSight AI — AI-Powered PDF Summarization & Chat",
  description:
    "Transform lengthy research papers, reports, and PDFs into clear summaries in seconds. Chat with your documents using AI-powered RAG. Free to try.",
  alternates: {
    canonical: "https://papersight.vercel.app",
  },
  openGraph: {
    title: "PaperSight AI — Read Less, Know More",
    description:
      "Transform lengthy research papers and PDFs into clear, actionable summaries. Chat with your documents using AI.",
    url: "https://papersight.vercel.app",
  },
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Cta />
      <Footer />
    </main>
  )
}
