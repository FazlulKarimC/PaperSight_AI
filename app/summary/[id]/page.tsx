import { getSummaryById } from "@/lib/getSummaries"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SummaryContent } from "./summary-content"

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const summaries = await getSummaryById(id)

    if (!summaries || summaries.length === 0) {
        notFound()
    }

    const summary = summaries[0]

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <SummaryContent summary={summary} />
            </main>

            <Footer />
        </div>
    )
}