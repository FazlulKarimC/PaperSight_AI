import { FileText, Copy, Sparkles } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { DeleteSummary } from "./delete-summary"

interface SummaryProps {
  summary: {
    id: string
    title: string
    created_at: string
    summary_text: string
    status: string
  }
  onDelete: (id: string) => void
}

export default function SummaryListItem({ summary, onDelete }: SummaryProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.summary_text)
      toast.success("Copied to Clipboard", {
        description: "Summary text has been copied successfully."
      })
    } catch {
      toast.error("Copy Failed", {
        description: "Unable to copy summary to clipboard. Please try again."
      })
    }
  }

  return (
    <Card className="relative overflow-hidden border border-border bg-card group cursor-pointer hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-3">
          <Link href={`/summary/${summary.id}`} className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-accent transition-colors truncate">
                {summary.title}
              </h3>
            </div>
          </Link>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleCopy}
              className="size-9 rounded-lg bg-secondary hover:bg-accent/20 transition-all duration-200 flex items-center justify-center hover:scale-105"
              title="Copy summary"
            >
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
            <DeleteSummary summaryId={summary.id} onDelete={onDelete} />
          </div>
        </div>

        <Link href={`/summary/${summary.id}`} className="block">
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent/60" />
            {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
          </p>

          <div className="text-muted-foreground text-sm mb-4 line-clamp-3 group-hover:text-foreground/80 transition-colors leading-relaxed">
            {summary.summary_text}
          </div>

          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 transition-colors">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Generated
          </Badge>
        </Link>
      </CardContent>
    </Card>
  )
}
