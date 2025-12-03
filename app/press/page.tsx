import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, Calendar } from "lucide-react"

const pressReleases = [
    {
        id: 1,
        title: "PaperSight AI Launches Revolutionary Document Summarization Platform",
        date: "December 1, 2025",
        excerpt: "PaperSight AI today announced the launch of its AI-powered document summarization platform, designed to help professionals save time and increase productivity."
    },
    {
        id: 2,
        title: "PaperSight AI Secures Series A Funding",
        date: "November 15, 2025",
        excerpt: "Leading venture capital firms invest in PaperSight AI's vision for the future of document intelligence."
    },
    {
        id: 3,
        title: "PaperSight AI Reaches 100,000 Users Milestone",
        date: "October 28, 2025",
        excerpt: "Platform experiences rapid growth as demand for AI-powered document analysis continues to surge."
    }
]

export default function PressPage() {
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

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Press & Media
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Latest news and announcements from PaperSight AI
                    </p>

                    <div className="space-y-8 mb-16">
                        {pressReleases.map((release) => (
                            <article key={release.id} className="border border-border rounded-xl p-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Calendar className="h-4 w-4" />
                                    {release.date}
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3">
                                    {release.title}
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    {release.excerpt}
                                </p>
                                <Button variant="ghost" size="sm">
                                    Read Full Release →
                                </Button>
                            </article>
                        ))}
                    </div>

                    <div className="border border-border rounded-xl p-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Media Inquiries</h2>
                        <p className="text-muted-foreground mb-6">
                            For press inquiries, interviews, or media kits, please contact our press team.
                        </p>
                        <div className="space-y-2 text-muted-foreground mb-6">
                            <p><strong>Email:</strong> press@papersight.ai</p>
                            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                        </div>
                        <Button className="bg-foreground text-background hover:bg-foreground/90 gap-2">
                            <FileText className="h-4 w-4" />
                            Download Media Kit
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
