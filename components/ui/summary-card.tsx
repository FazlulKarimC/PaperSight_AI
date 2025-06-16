import { FileText, Copy } from "lucide-react"
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

export default function SummaryCard({ summary, onDelete }: SummaryProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.summary_text)
      toast.success("Summary copied to clipboard")
    } catch {
      toast.error("Failed to copy summary")
    }
  }

  return (
    <Card className="bg-indigo-50 overflow-hidden border group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/summary/${summary.id}`} className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 min-w-0">
              <FileText className="h-6 w-6 text-indigo-600" />
              <h3 className="font-medium text-lg text-indigo-500 line-clamp-1 group-hover:text-indigo-800 transition-colors truncate">
                {summary.title}
              </h3>
            </div>
          </Link>
          <div className="flex space-x-2">
            <button onClick={handleCopy} className="size-9 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors flex items-center justify-center" title="Copy summary">
              <Copy className="h-4 w-4 text-indigo-500" />
            </button>
            <DeleteSummary summaryId={summary.id} onDelete={onDelete} />
          </div>
        </div>

        <Link href={`/summary/${summary.id}`} className="block">
          <p className="text-sm text-muted-foreground mb-3">
            {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
          </p>

          <div className="text-black text-sm mb-4 line-clamp-3 group-hover:text-black/90 transition-colors">
            {summary.summary_text}
          </div>

          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            Completed
          </Badge>
        </Link>
      </CardContent>
    </Card>
  )
}
