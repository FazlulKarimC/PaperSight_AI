import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen, Search, Code, Zap } from "lucide-react"

const docSections = [
    {
        title: "Getting Started",
        icon: Zap,
        description: "Quick start guide and basic concepts",
        links: ["Introduction", "First Upload", "Understanding Summaries", "Best Practices"]
    },
    {
        title: "User Guide",
        icon: BookOpen,
        description: "Complete guide to using PaperSight AI",
        links: ["Uploading Documents", "Managing Summaries", "Dashboard Overview", "Account Settings"]
    },
    {
        title: "API Reference",
        icon: Code,
        description: "Technical documentation for developers",
        links: ["Authentication", "Endpoints", "Rate Limits", "Error Handling"]
    },
    {
        title: "Tutorials",
        icon: Search,
        description: "Step-by-step guides and examples",
        links: ["Batch Processing", "Integration Examples", "Advanced Features", "Troubleshooting"]
    }
]

export default function DocsPage() {
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
                        Documentation
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Everything you need to know about using PaperSight AI
                    </p>

                    <div className="mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        {docSections.map((section) => {
                            const Icon = section.icon
                            return (
                                <div key={section.title} className="border border-border rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-accent/10 rounded-lg">
                                            <Icon className="h-6 w-6 text-accent" />
                                        </div>
                                        <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-4">{section.description}</p>
                                    <ul className="space-y-2">
                                        {section.links.map((link) => (
                                            <li key={link}>
                                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                                    <span className="text-accent">→</span>
                                                    {link}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>

                    <div className="bg-secondary rounded-xl p-8 border border-border">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Still have questions?</h2>
                        <p className="text-muted-foreground mb-6">
                            Can't find what you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/help">
                                <Button className="bg-foreground text-background hover:bg-foreground/90">
                                    Contact Support
                                </Button>
                            </Link>
                            <Link href="/community">
                                <Button variant="outline">
                                    Join Community
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
