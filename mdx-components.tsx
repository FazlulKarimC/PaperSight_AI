import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/blog/callout'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Custom heading styling
        h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-10 mb-4 first:mt-0">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-3">
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">
                {children}
            </h4>
        ),
        // Paragraph styling
        p: ({ children }) => (
            <p className="text-muted-foreground leading-7 mb-6">
                {children}
            </p>
        ),
        // Strong/bold text
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
                {children}
            </strong>
        ),
        // Italic text
        em: ({ children }) => (
            <em className="italic text-foreground/90">
                {children}
            </em>
        ),
        // Lists
        ul: ({ children }) => (
            <ul className="list-disc list-outside pl-6 mb-6 space-y-2 text-muted-foreground">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 mb-6 space-y-2 text-muted-foreground">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="leading-7">
                {children}
            </li>
        ),
        // Blockquote styling
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-6 py-2 my-6 bg-secondary/30 rounded-r-lg italic text-muted-foreground">
                {children}
            </blockquote>
        ),
        // Code blocks
        pre: ({ children }) => (
            <pre className="bg-secondary rounded-lg p-4 overflow-x-auto mb-6 text-sm font-mono">
                {children}
            </pre>
        ),
        code: ({ children }) => (
            <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-accent">
                {children}
            </code>
        ),
        // Links
        a: ({ href, children }) => (
            <a
                href={href}
                className="text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
                {children}
            </a>
        ),
        // Horizontal rule
        hr: () => (
            <hr className="border-border my-8" />
        ),
        // Custom Callout component
        Callout,
        ...components,
    }
}
