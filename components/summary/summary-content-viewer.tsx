"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SummaryContentViewerProps {
  summaryText: string;
}

export const SummaryContentViewer = ({ summaryText }: SummaryContentViewerProps) => {
  return (
    <div className="w-full text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-xl font-semibold text-accent flex items-center gap-2 mt-8 mb-4 first:mt-0">
              <span className="w-1 h-6 bg-accent rounded-full shrink-0" />
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-lg font-semibold text-accent flex items-center gap-2 mt-6 mb-3">
              <span className="w-1 h-5 bg-accent/60 rounded-full shrink-0" />
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-muted-foreground hover:text-foreground transition-colors my-2">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 pl-3 border-l border-border my-3">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 pl-3 border-l border-border my-3 list-decimal list-inside">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed text-muted-foreground hover:text-foreground transition-colors pl-1">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="bg-secondary rounded-lg p-4 my-3 overflow-x-auto border border-border">
                  <code className="text-xs font-mono text-accent">{children}</code>
                </pre>
              );
            }
            return (
              <code className="px-1.5 py-0.5 rounded bg-secondary text-accent text-xs font-mono border border-border/50">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent/40 pl-4 my-3 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-t border-border text-muted-foreground">{children}</td>
          ),
          hr: () => <hr className="border-border/50 my-6" />,
        }}
      >
        {summaryText}
      </ReactMarkdown>
    </div>
  );
};