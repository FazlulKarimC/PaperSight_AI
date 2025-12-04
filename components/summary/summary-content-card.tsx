import { Card, CardContent } from "@/components/ui/card"
import { Summary } from "@/lib/getSummaries"
import { FileText } from "lucide-react"
import { SummaryContentViewer } from "./summary-content-viewer"

interface SummaryCardProps {
  summary: Summary
}

export default function SummaryContentCard({ summary }: SummaryCardProps) {
  return (
    <Card className="bg-indigo-50 w-full shadow-md">
      <CardContent className="pt-6 pb-12">
        <div className="absolute right-4 top-4 text-sm text-gray-400 flex items-center">
          <FileText className="mr-1 w-4 h-4" />
          {summary.word_count} words
        </div>
        <SummaryContentViewer summaryText={summary.summary_text} />
      </CardContent>
    </Card>
  )
}
