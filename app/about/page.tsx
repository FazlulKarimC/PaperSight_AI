import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about PaperSight AI — our mission to make document analysis accessible to everyone. Built for researchers, students, and professionals who value their time.",
    alternates: { canonical: "https://papersight.vercel.app/about" },
    openGraph: { url: "https://papersight.vercel.app/about" },
}


export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <div className="mono-label mb-4">About</div>
                    <h1 className="heading-display text-4xl sm:text-5xl text-foreground mb-6">
                        About PaperSight AI
                    </h1>

                    <div className="prose-editorial">
                        <p className="text-xl text-muted-foreground mb-8">
                            We&apos;re on a mission to make document analysis accessible to everyone through the power of AI.
                        </p>

                        <h2 className="heading-display text-2xl text-foreground mt-12 mb-4">Our Story</h2>
                        <p className="text-muted-foreground mb-6">
                            PaperSight AI was founded with a simple vision: to help professionals, researchers, and students save time by instantly extracting key insights from lengthy PDF documents. We understand that in today&apos;s fast-paced world, time is precious, and reading through hundreds of pages isn&apos;t always feasible.
                        </p>

                        <h2 className="heading-display text-2xl text-foreground mt-12 mb-4">What We Do</h2>
                        <p className="text-muted-foreground mb-6">
                            Our AI-powered platform analyzes PDF documents and generates concise, accurate summaries that capture the essential information. Whether you&apos;re reviewing research papers, legal documents, business reports, or educational materials, PaperSight AI helps you understand the content quickly and efficiently.
                        </p>

                        <h2 className="heading-display text-2xl text-foreground mt-12 mb-4">Our Technology</h2>
                        <p className="text-muted-foreground mb-6">
                            Built on cutting-edge AI models, PaperSight AI uses advanced natural language processing to understand context, identify key points, and generate human-readable summaries. Our technology is constantly evolving to provide you with the most accurate and useful insights.
                        </p>

                        <h2 className="heading-display text-2xl text-foreground mt-12 mb-4">Our Values</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                            <li><strong className="text-foreground">Accuracy:</strong> We prioritize delivering precise and reliable summaries</li>
                            <li><strong className="text-foreground">Privacy:</strong> Your documents are processed securely and never shared</li>
                            <li><strong className="text-foreground">Simplicity:</strong> We believe powerful tools should be easy to use</li>
                            <li><strong className="text-foreground">Innovation:</strong> We continuously improve our AI to serve you better</li>
                        </ul>

                        <div className="mt-12 p-8 surface-raised rounded-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
                            <div className="relative">
                                <h3 className="heading-display text-xl text-foreground mb-4">Join Us</h3>
                                <p className="text-muted-foreground mb-6">
                                    Ready to transform how you work with documents? Start using PaperSight AI today and experience the future of document analysis.
                                </p>
                                <Link href="/upload">
                                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
