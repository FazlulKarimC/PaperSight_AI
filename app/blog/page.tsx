import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { getAllPosts } from "@/lib/mdx"
import Image from "next/image"

export default function BlogPage() {
    const posts = getAllPosts()

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <div className="mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                            Blogs
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Insights, updates, and tips from the PaperSight AI team.
                            Explore the latest trends in AI-powered document analysis and research productivity.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <article
                                key={post.slug}
                                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
                            >
                                {/* Featured Image Placeholder */}
                                {/* Featured Image */}
                                <div className="aspect-video bg-secondary relative overflow-hidden">
                                    {post.featuredImage ? (
                                        <Image
                                            src={post.featuredImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-linear-to-br from-accent/20 to-transparent" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-4xl font-bold text-accent/30">
                                                    {post.title.charAt(0)}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                                        <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground">
                                            {post.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {post.readingTime} min
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <span className="text-sm text-muted-foreground">
                                            By {post.author}
                                        </span>
                                        <Link href={`/blog/${post.slug}`}>
                                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                                Read More →
                                            </Button>
                                        </Link>
                                    </div>
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
