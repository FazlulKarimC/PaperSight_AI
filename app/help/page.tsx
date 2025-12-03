import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, HelpCircle, MessageCircle, Book, Video } from "lucide-react"

const helpTopics = [
    {
        category: "Getting Started",
        icon: Book,
        articles: [
            "How to create an account",
            "Uploading your first PDF",
            "Understanding your summary",
            "Managing your documents"
        ]
    },
    {
        category: "Account & Billing",
        icon: HelpCircle,
        articles: [
            "Changing your plan",
            "Payment methods",
            "Billing history",
            "Canceling subscription"
        ]
    },
    {
        category: "Troubleshooting",
        icon: MessageCircle,
        articles: [
            "Upload errors",
            "Summary quality issues",
            "Login problems",
            "Browser compatibility"
        ]
    },
    {
        category: "Video Tutorials",
        icon: Video,
        articles: [
            "Platform overview",
            "Advanced features",
            "API integration",
            "Best practices"
        ]
    }
]

export default function HelpPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Help Center
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Find answers to common questions and get support
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        {helpTopics.map((topic) => {
                            const Icon = topic.icon
                            return (
                                <div key={topic.category} className="border border-border rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Icon className="h-6 w-6 text-accent" />
                                        <h2 className="text-xl font-semibold text-foreground">{topic.category}</h2>
                                    </div>
                                    <ul className="space-y-2">
                                        {topic.articles.map((article) => (
                                            <li key={article}>
                                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                                    <span className="text-accent">→</span>
                                                    {article}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-secondary rounded-xl p-8 border border-border">
                            <MessageCircle className="h-8 w-8 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Live Chat Support</h2>
                            <p className="text-muted-foreground mb-6">
                                Get instant help from our support team. Available Monday-Friday, 9AM-5PM EST.
                            </p>
                            <Button className="bg-foreground text-background hover:bg-foreground/90">
                                Start Chat
                            </Button>
                        </div>

                        <div className="bg-secondary rounded-xl p-8 border border-border">
                            <HelpCircle className="h-8 w-8 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Email Support</h2>
                            <p className="text-muted-foreground mb-6">
                                Send us an email and we'll get back to you within 24 hours.
                            </p>
                            <Link href="/contact">
                                <Button variant="outline">
                                    Contact Us
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
