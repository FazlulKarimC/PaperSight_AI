import HeaderBar from "@/components/ui/summary/header-bar"
import SummaryCard from "@/components/ui/summary/summary-card"
import { Summary } from "@/lib/getSummaries"

interface CheatsheetViewerProps {
  summary: Summary
}

export default function CheatsheetViewer({ summary }: CheatsheetViewerProps) {
  return (
    <div className="mx-auto max-w-3xl pt-20">
      <HeaderBar
        title={summary.title}
        date={new Date(summary.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        readTime={`${Math.ceil(summary.word_count / 100)} min read`}
        source={summary.file_name}
        originalfileurl={summary.original_file_url}
        summaryText={summary.summary_text}
      />
      <div className="mt-4 relative">
        <SummaryCard
          summary={summary}
        />
      </div>
    </div>
  )
}
