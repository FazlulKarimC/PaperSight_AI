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
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-pink-50 text-pink-500 hover:bg-pink-50 border-pink-100">
            <span className="mr-1 text-pink-500">✨</span> AI Summary
          </Badge>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="text-pink-500 h-4 w-4" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="text-pink-500 h-4 w-4" />
              {readTime}
            </div>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="bg-pink-50 text-pink-500 hover:bg-pink-100 border-pink-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back <span className="hidden lg:block">to Dashboard</span>
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center">
      </div>
      <div>
        <h1 className="text-2xl font-bold text-pink-600">{title}</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {originalfileurl ? (
          <Link href={originalfileurl} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-1 text-pink-500 h-4 w-4" />
              Source: {source}
            </div>
          </Link>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-1 text-pink-500 h-4 w-4" />
            Source: {source}
          </div>
        )}
        <div className="mt-2 sm:mt-0 flex gap-2">
          {originalfileurl && (
            <Button variant="outline" size="sm" className="text-pink-500 hover:text-pink-600">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Original
            </Button>
          )}
          <DownloadSummary title={title} content={summaryText} />
        </div>
      </div>
    </div>
  )
}
