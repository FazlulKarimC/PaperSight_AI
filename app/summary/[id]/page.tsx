import CheatsheetViewer from "@/components/ui/summary/cheatsheet-viewer";
import { getSummaryById } from "@/lib/getSummaries";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/hero-section"

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const summaries = await getSummaryById(id);

    if (!summaries || summaries.length === 0) {
        notFound();
    }

    const summary = summaries[0];

    return (
        <div className="min-h-screen w-full relative mx-auto my-10 flex max-w-7xl flex-col items-stretch justify-center">
            <Navbar />
            <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
                <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>

            <div className="flex flex-col items-center mb-4">
                <CheatsheetViewer summary={summary} />
            </div>
        </div>
    )
}