import SummaryContentCard from "@/components/summary/summary-content-card"
import { Summary } from "@/lib/getSummaries"

interface CheatsheetViewerProps {
  summary: Summary
}

export default function CheatsheetViewer({ summary }: CheatsheetViewerProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mt-4 relative">
        <SummaryContentCard
          summary={summary}
        />
      </div>
    </div>
  )
}
