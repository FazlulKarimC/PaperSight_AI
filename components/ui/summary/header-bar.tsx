import { ArrowLeft, ExternalLink, Calendar, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DownloadSummary } from "@/components/ui/download-summary"
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-indigo-50 text-indigo-600 hover:border-indigo-800">
            <span className="mr-1 text-indigo-600">✨</span> AI Summary
          </Badge>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="text-indigo-200 h-4 w-4" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="text-indigo-200 h-4 w-4" />
              {readTime}
            </div>
          </div>
        </div>
        <Link href="/dashboard">
          <Button className="mt-4 sm:mt-0">
            <FileText className="w-4 h-4" />
            All Summaries
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center">
      </div>
      <div>
        <h1 className="text-2xl font-bold text-indigo-50">{title}</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {originalfileurl ? (
          <Link href={originalfileurl} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center text-sm text-muted">
              <FileText className="mr-1 text-indigo-200 h-4 w-4" />
              Source: {source}
            </div>
          </Link>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-1 text-indigo-200 h-4 w-4" />
            Source: {source}
          </div>
        )}
        <div className="mt-2 sm:mt-0 flex gap-2">
          {originalfileurl && (
            <Link href={originalfileurl} target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2 rounded-2xl bg-indigo-100 text-indigo-800 hover:bg-indigo-200 shadow-md transition-color flex items-center justify-center font-semibold text-sm">
                <ExternalLink className="mr-2 h-4 w-4" />
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
