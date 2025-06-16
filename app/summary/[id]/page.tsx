import CheatsheetViewer from "@/components/ui/summary/cheatsheet-viewer";
import { getSummaryById } from "@/lib/getSummaries";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/hero-section"
import HeaderBar from "@/components/ui/summary/header-bar"

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
            <div className="py-10 w-full px-4">
                <HeaderBar
                    title={summary.title}
                    date={new Date(summary.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                    readTime={`${Math.ceil(summary.word_count / 100)} min read`}
                    source={summary.file_name}
                    originalfileurl={summary.original_file_url}
                    summaryText={summary.summary_text}
                />
            </div>

            <div className="flex flex-col items-center pb-10">
                <CheatsheetViewer summary={summary} />
            </div>
        </div>
    )
}