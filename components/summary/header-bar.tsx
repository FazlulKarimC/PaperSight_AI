import { ExternalLink, Calendar, Clock, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DownloadSummary } from "@/components/summary/download-summary"
import Link from "next/link"

interface HeaderBarProps {
  title: string
  date: string
  readTime: string
  source: string
  originalfileurl: string
  summaryText: string
}

export default function HeaderBar({ title, date, readTime, source, originalfileurl, summaryText }: HeaderBarProps) {
  return (
    <div className="space-y-6">
      {/* Top bar with badge and navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 transition-colors">
            <Sparkles className="mr-1.5 h-3 w-3" />
            AI Summary
          </Badge>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="text-accent/60 h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="text-accent/60 h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2 border-border hover:border-accent/50 hover:bg-accent/10 transition-colors">
            <FileText className="w-4 h-4" />
            All Summaries
          </Button>
        </Link>
      </div>

      {/* Title section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
      </div>

      {/* Source and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-border">
        {originalfileurl ? (
          <Link href={originalfileurl} target="_blank" rel="noopener noreferrer" className="group">
            <div className="flex items-center text-sm text-muted-foreground hover:text-accent transition-colors">
              <FileText className="mr-1.5 text-accent/60 h-4 w-4" />
              Source: <span className="ml-1 group-hover:underline underline-offset-2">{source}</span>
            </div>
          </Link>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-1.5 text-accent/60 h-4 w-4" />
            Source: {source}
          </div>
        )}

        <div className="flex gap-3">
          {originalfileurl && (
            <Link href={originalfileurl} target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2.5 rounded-xl bg-secondary text-foreground hover:bg-accent/20 hover:text-accent border border-border hover:border-accent/30 transition-all duration-200 flex items-center justify-center font-medium text-sm gap-2 hover:scale-[1.02]">
                <ExternalLink className="h-4 w-4" />
                View Original
              </button>
            </Link>
          )}
          <DownloadSummary title={title} content={summaryText} />
        </div>
      </div>
    </div>
  )
}
