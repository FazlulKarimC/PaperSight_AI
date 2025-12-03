import SummariesList from "@/components/ui/summary-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertCircleIcon, Plus, FileText, Clock, TrendingUp } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function SummariesPage() {
  const user = await currentUser()
  const userId = user?.id

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Your AI-Generated Summaries
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
                  Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage and access all your PDF summaries in one place
                </p>
              </div>
              <Link href="/upload">
                <Button className="bg-foreground text-background hover:bg-foreground/90 gap-2">
                  <Plus className="h-4 w-4" />
                  New Summary
                </Button>
              </Link>
            </div>
          </div>

          {/* Alert for non-logged in users */}
          {!userId && (
            <Alert className="mb-8 border-destructive/50 bg-destructive/10">
              <AlertCircleIcon className="w-4 h-4" color="red" />
              <AlertDescription className="text-rose-600">
                Log in to unlock your dashboard and access all your past summaries.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="relative rounded-xl border border-border bg-card p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">Total Summaries</div>
                <p className="text-sm text-muted-foreground">All your PDF summaries</p>
              </div>
            </div>

            <div className="relative rounded-xl border border-border bg-card p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">Recent Activity</div>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
            </div>

            <div className="relative rounded-xl border border-border bg-card p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">Time Saved</div>
                <p className="text-sm text-muted-foreground">Hours of reading</p>
              </div>
            </div>
          </div>

          {/* Summaries List Section */}
          <div className="relative rounded-xl border border-border bg-card p-8">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Summaries</h2>
                <Link href="/upload">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Upload PDF
                  </Button>
                </Link>
              </div>
              <SummariesList />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
