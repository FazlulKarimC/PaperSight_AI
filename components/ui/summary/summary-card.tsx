import { Card, CardContent } from "@/components/ui/card"
import { Summary } from "@/lib/getSummaries"
import { FileText } from "lucide-react"

interface SummaryCardProps {
  summary: Summary
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="w-full shadow-md">
      <CardContent className="pt-6 pb-12">
        <div className="absolute right-4 top-4 text-sm text-gray-400 flex items-center">
          <FileText className="mr-1 w-4 h-4" />
          {summary.word_count} words
        </div>
        <h2 className="text-2xl font-bold">{summary.title}</h2>
        <p className="text-gray-500 mt-2">{summary.summary_text}</p>
      </CardContent>
    </Card>
  )
}
