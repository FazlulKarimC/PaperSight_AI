import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { currentUser } from "@clerk/nextjs/server"
import { DashboardContent } from "./dashboard-content"

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
