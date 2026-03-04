import { getSummaryById } from "@/lib/getSummaries"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SummaryContent } from "./summary-content"

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const summary = await getSummaryById(id)

    if (!summary) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-20">
                <SummaryContent summary={summary} />
            </main>

            <Footer />
        </div>
    )
}