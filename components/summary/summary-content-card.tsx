import { Card, CardContent } from "@/components/ui/card"
import { Summary } from "@/lib/getSummaries"
import { FileText, Sparkles } from "lucide-react"
import { SummaryContentViewer } from "./summary-content-viewer"

interface SummaryCardProps {
  summary: Summary
}

export default function SummaryContentCard({ summary }: SummaryCardProps) {
  return (
    <Card className="relative overflow-hidden border border-border bg-card w-full">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <CardContent className="relative pt-6 pb-12">
        <div className="absolute right-4 top-4 text-sm text-muted-foreground flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
          <FileText className="w-4 h-4 text-accent" />
          <span>{summary.word_count} words</span>
        </div>
        <div className="mt-4">
          <SummaryContentViewer summaryText={summary.summary_text} />
        </div>
      </CardContent>
    </Card>
  )
}
