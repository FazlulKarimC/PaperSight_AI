import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

export function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <article className="pt-24 pb-20">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <Link href="/blog">
                        <Button variant="ghost" className="mb-8 gap-2 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Button>
                    </Link>

                    <header className="mb-10">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {post.date}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-border pb-8">
                            <User className="h-4 w-4" />
                            <span>By {post.author}</span>
                        </div>
                    </header>

                    <div
                        className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:marker:text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
            <Footer />
        </main>
    )
}
