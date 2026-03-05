import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { currentUser } from "@clerk/nextjs/server"
import { DashboardContent } from "./dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your PaperSight AI dashboard — manage all your PDF summaries in one place.",
  robots: { index: false, follow: false },
}


export default async function SummariesPage() {
  const user = await currentUser()
  const userId = user?.id

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <DashboardContent userId={userId} />
      </main>

      <Footer />
    </div>
  )
}
