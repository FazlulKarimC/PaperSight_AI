import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { calculateReadingTime, countWords } from "@/lib/utils"

const contentDirectory = path.join(process.cwd(), "content/blog")

export interface BlogPostMeta {
    slug: string
    title: string
    excerpt: string
    date: string
    author: string
    category: string
    featuredImage?: string
    readingTime: number
}

export interface BlogPost extends BlogPostMeta {
    content: string
}


/**
 * Get all blog post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(contentDirectory)) {
        return []
    }

    const files = fs.readdirSync(contentDirectory)
    return files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx$/, ""))
}

/**
 * Get all blog posts metadata (for listing page)
 */
export function getAllPosts(): BlogPostMeta[] {
    const slugs = getAllPostSlugs()

    const posts = slugs.map((slug) => {
        const fullPath = path.join(contentDirectory, `${slug}.mdx`)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const { data, content } = matter(fileContents)

        return {
            slug,
            title: data.title || "",
            excerpt: data.excerpt || "",
            date: data.date || "",
            author: data.author || "",
            category: data.category || "",
            featuredImage: data.featuredImage || undefined,
            readingTime: calculateReadingTime(countWords(content)),
        }
    })

    // Sort by date, newest first
    return posts.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime()
    })
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)

    if (!fs.existsSync(fullPath)) {
        return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
        slug,
        title: data.title || "",
        excerpt: data.excerpt || "",
        date: data.date || "",
        author: data.author || "",
        category: data.category || "",
        featuredImage: data.featuredImage || undefined,
        readingTime: calculateReadingTime(countWords(content)),
        content,
    }
}
