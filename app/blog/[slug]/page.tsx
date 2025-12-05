import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx"
import { notFound } from "next/navigation"
import { TableOfContents, AuthorBio, ReadingTime } from "@/components/blog"
import { MDXRemote } from "next-mdx-remote/rsc"
import { useMDXComponents } from "@/mdx-components"
import Image from "next/image"

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

export function generateStaticParams() {
    const slugs = getAllPostSlugs()
    return slugs.map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    const components = useMDXComponents({})

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <article className="pt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link href="/blog">
                        <Button variant="ghost" className="mb-8 gap-2 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Button>
                    </Link>

                    {/* Hero Section */}
                    <header className="mb-12">
                        {/* Featured Image Placeholder */}
                        {/* Featured Image */}
                        <div className="aspect-21/9 bg-secondary rounded-2xl mb-8 relative overflow-hidden">
                            {post.featuredImage ? (
                                <Image
                                    src={post.featuredImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-linear-to-br from-accent/20 via-transparent to-accent/10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-8xl font-bold text-accent/20">
                                            {post.title.charAt(0)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </span>
                            <ReadingTime minutes={post.readingTime} />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 max-w-4xl">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-xl text-muted-foreground max-w-3xl mb-6">
                            {post.excerpt}
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pb-8 border-b border-border">
                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                <span className="text-sm font-semibold text-accent">
                                    {post.author.split(" ").map(n => n[0]).join("")}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{post.author}</p>
                                <p className="text-xs text-muted-foreground">PaperSight AI</p>
                            </div>
                        </div>
                    </header>

                    {/* Content Layout */}
                    <div className="flex gap-12">
                        {/* Main Content */}
                        <div className="flex-1 max-w-3xl">
                            <div className="prose-article">
                                <MDXRemote
                                    source={post.content}
                                    components={components}
                                />
                            </div>

                            {/* Author Bio */}
                            <AuthorBio name={post.author} />
                        </div>

                        {/* Sidebar - Table of Contents */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <div className="sticky top-28">
                                <TableOfContents />
                            </div>
                        </aside>
                    </div>
                </div>
            </article>
            <Footer />
        </main>
    )
}
