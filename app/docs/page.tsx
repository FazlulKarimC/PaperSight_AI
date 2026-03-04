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
        <main className="relative min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <div className="mono-label mb-4">Resources</div>
                    <h1 className="heading-display text-4xl sm:text-5xl text-foreground mb-4">
                        Documentation
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12 max-w-lg">
                        Everything you need to know about using PaperSight AI.
                    </p>

                    <div className="mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl surface-raised text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-16">
                        {docSections.map((section) => {
                            const Icon = section.icon
                            return (
                                <div key={section.title} className="surface-raised surface-hover rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
                                            <Icon className="h-5 w-5 text-accent" />
                                        </div>
                                        <h2 className="heading-ui text-lg text-foreground">{section.title}</h2>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                                    <ul className="space-y-2">
                                        {section.links.map((link) => (
                                            <li key={link}>
                                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                                                    <span className="text-accent/60">→</span>
                                                    {link}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>

                    <div className="surface-raised rounded-xl p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
                        <div className="relative">
                            <h2 className="heading-display text-2xl text-foreground mb-4">Still have questions?</h2>
                            <p className="text-muted-foreground mb-6">
                                Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
                            </p>
                            <div className="flex gap-4">
                                <Link href="mailto:fazlul0127@gmail.com">
                                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
                                        Contact Support
                                    </Button>
                                </Link>
                                <Link href="https://x.com/FazlulKarim_fk" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline">
                                        Join Community
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
