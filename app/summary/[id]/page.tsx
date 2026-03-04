import { getSummaryById } from "@/lib/getSummaries"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SummaryContent } from "./summary-content"
import { currentUser } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { GUEST_COOKIE_NAME, GUEST_PREFIX } from "@/lib/guest-constants"

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    // Resolve userId: Clerk for signed-in, cookie for guests
    const user = await currentUser()
    let userId = user?.id
    if (!userId) {
        const cookieStore = await cookies()
        const guestId = cookieStore.get(GUEST_COOKIE_NAME)?.value
        if (guestId?.startsWith(GUEST_PREFIX)) {
            userId = guestId
        }
    }

    // Pass userId so getSummaryById scopes the query to the owner
    const summary = await getSummaryById(id, userId)

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