import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users, MessageSquare, Github, Twitter } from "lucide-react"

export default function CommunityPage() {
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
                        Community
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Join thousands of users and developers using PaperSight AI
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="border border-border rounded-xl p-8 hover:border-accent transition-colors">
                            <MessageSquare className="h-10 w-10 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-3">Discord Community</h2>
                            <p className="text-muted-foreground mb-6">
                                Join our Discord server to chat with other users, get help, and share tips and tricks.
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">5,000+</div>
                                    <div className="text-sm text-muted-foreground">Members</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">24/7</div>
                                    <div className="text-sm text-muted-foreground">Active</div>
                                </div>
                            </div>
                            <Button className="bg-[#5865F2] text-white hover:bg-[#4752C4]">
                                Join Discord
                            </Button>
                        </div>

                        <div className="border border-border rounded-xl p-8 hover:border-accent transition-colors">
                            <Github className="h-10 w-10 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-3">GitHub Discussions</h2>
                            <p className="text-muted-foreground mb-6">
                                Participate in technical discussions, report issues, and contribute to our open-source projects.
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">1,200+</div>
                                    <div className="text-sm text-muted-foreground">Stars</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">150+</div>
                                    <div className="text-sm text-muted-foreground">Contributors</div>
                                </div>
                            </div>
                            <Button variant="outline">
                                View on GitHub
                            </Button>
                        </div>
                    </div>

                    <div className="bg-secondary rounded-xl p-8 border border-border mb-12">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Community Guidelines</h2>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">✓</span>
                                <span>Be respectful and inclusive to all community members</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">✓</span>
                                <span>Share knowledge and help others learn</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">✓</span>
                                <span>Provide constructive feedback and suggestions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent mt-1">✓</span>
                                <span>Report bugs and security issues responsibly</span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Follow Us</h2>
                        <p className="text-muted-foreground mb-6">
                            Stay updated with the latest news and announcements
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" size="lg" className="gap-2">
                                <Twitter className="h-5 w-5" />
                                Twitter
                            </Button>
                            <Button variant="outline" size="lg" className="gap-2">
                                <Users className="h-5 w-5" />
                                LinkedIn
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
