"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Heading {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([])
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        // Extract headings from the article
        const article = document.querySelector("article")
        if (!article) return

        const elements = article.querySelectorAll("h2, h3")
        const extractedHeadings: Heading[] = []

        elements.forEach((element, index) => {
            const id = element.id || `heading-${index}`
            if (!element.id) {
                element.id = id
            }
            extractedHeadings.push({
                id,
                text: element.textContent || "",
                level: parseInt(element.tagName[1]),
            })
        })

        setHeadings(extractedHeadings)

        // Set up intersection observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "-80px 0px -80% 0px" }
        )

        elements.forEach((element) => observer.observe(element))

        return () => observer.disconnect()
    }, [])

    if (headings.length === 0) {
        return null
    }

    return (
        <nav className={cn("space-y-1", className)}>
            <p className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                On This Page
            </p>
            <ul className="space-y-2">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                    >
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }}
                            className={cn(
                                "block text-sm py-1 transition-colors hover:text-foreground",
                                activeId === heading.id
                                    ? "text-accent font-medium"
                                    : "text-muted-foreground"
                            )}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
