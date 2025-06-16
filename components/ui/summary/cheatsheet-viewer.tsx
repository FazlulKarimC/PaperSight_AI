import SummaryCard from "@/components/ui/summary/summary-card"
import { Summary } from "@/lib/getSummaries"

interface CheatsheetViewerProps {
  summary: Summary
}

export default function CheatsheetViewer({ summary }: CheatsheetViewerProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mt-4 relative">
        <SummaryCard
          summary={summary}
        />
      </div>
    </div>
  )
}
