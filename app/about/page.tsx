import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
                        About PaperSight AI
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-xl text-muted-foreground mb-8">
                            We&apos;re on a mission to make document analysis accessible to everyone through the power of AI.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">Our Story</h2>
                        <p className="text-muted-foreground mb-6">
                            PaperSight AI was founded with a simple vision: to help professionals, researchers, and students save time by instantly extracting key insights from lengthy PDF documents. We understand that in today&apos;s fast-paced world, time is precious, and reading through hundreds of pages isn&apos;t always feasible.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">What We Do</h2>
                        <p className="text-muted-foreground mb-6">
                            Our AI-powered platform analyzes PDF documents and generates concise, accurate summaries that capture the essential information. Whether you&apos;re reviewing research papers, legal documents, business reports, or educational materials, PaperSight AI helps you understand the content quickly and efficiently.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">Our Technology</h2>
                        <p className="text-muted-foreground mb-6">
                            Built on cutting-edge AI models, PaperSight AI uses advanced natural language processing to understand context, identify key points, and generate human-readable summaries. Our technology is constantly evolving to provide you with the most accurate and useful insights.
                        </p>

                        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">Our Values</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                            <li><strong>Accuracy:</strong> We prioritize delivering precise and reliable summaries</li>
                            <li><strong>Privacy:</strong> Your documents are processed securely and never shared</li>
                            <li><strong>Simplicity:</strong> We believe powerful tools should be easy to use</li>
                            <li><strong>Innovation:</strong> We continuously improve our AI to serve you better</li>
                        </ul>

                        <div className="mt-12 p-8 bg-secondary rounded-xl border border-border">
                            <h3 className="text-xl font-semibold text-foreground mb-4">Join Us</h3>
                            <p className="text-muted-foreground mb-6">
                                Ready to transform how you work with documents? Start using PaperSight AI today and experience the future of document analysis.
                            </p>
                            <Link href="/upload">
                                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
