import SummariesList from "@/components/ui/summary-list"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function SummariesPage() {
  return (
    <div className="min-h-screen w-full py-20">
      <div className="container max-w-6xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Your Summaries</h1>
            <p className="text-muted-foreground">Transform your PDFs into concise, actionable insights</p>
          </div>
          <Link href="/upload">
            <Button className="mt-4 sm:mt-0">+ New Summary</Button>
          </Link>
        </div>

        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 mb-8">
          <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
            <span>You&apos;ve only 5 uploads on the Basic plan.</span>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" size="sm">
              Upgrade to Pro ✨
            </Button>
          </AlertDescription>
        </Alert>

        <SummariesList />
      </div>
    </div>
  )
}

