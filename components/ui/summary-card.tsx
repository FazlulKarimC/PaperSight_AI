import { FileText, Copy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    } catch (error) {
      toast.error("Failed to copy summary")
    }
  }

  return (
    <Card className="overflow-hidden border group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/summary/${summary.id}`} className="flex-1">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-rose-500" />
              <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {summary.title}
              </h3>
            </div>
          </Link>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="text-muted-foreground"
              onClick={handleCopy}
              title="Copy summary"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <DeleteSummary summaryId={summary.id} onDelete={onDelete} />
          </div>
        </div>

        <Link href={`/summary/${summary.id}`} className="block">
          <p className="text-sm text-muted-foreground mb-3">
            {formatDistanceToNow(new Date(summary.created_at), { addSuffix: true })}
          </p>

          <div className="text-sm mb-4 line-clamp-3 group-hover:text-primary/90 transition-colors">
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
