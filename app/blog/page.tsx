import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"

import { blogPosts } from "@/lib/blog-data"

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Blog
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Insights, updates, and tips from the PaperSight AI team
                    </p>

                    <div className="grid gap-8 md:grid-cols-2">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="border border-border rounded-xl p-6 hover:border-accent transition-colors">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                                        {post.category}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {post.date}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 hover:text-accent transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">By {post.author}</span>
                                    <Link href={`/blog/${post.slug}`}>
                                        <Button variant="ghost" size="sm">
                                            Read More →
                                        </Button>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
