import SummariesList from "@/components/summary/summary-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertCircleIcon, Plus, FileText, Clock, TrendingUp } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardContent } from "./dashboard-content"

export default async function SummariesPage() {
  const user = await currentUser()
  const userId = user?.id

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <DashboardContent userId={userId} />
      </main>

      <Footer />
    </div>
  )
}
