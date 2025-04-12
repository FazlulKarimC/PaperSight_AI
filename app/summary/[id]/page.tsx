import CheatsheetViewer from "@/components/ui/summary/cheatsheet-viewer";
import { getSummaryById } from "@/lib/getSummaries";
import { notFound } from "next/navigation";

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const summaries = await getSummaryById(id);
    
    if (!summaries || summaries.length === 0) {
        notFound();
    }    
    
    const summary = summaries[0];
    
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-8">
            <CheatsheetViewer summary={summary} />
        </div>
    )
}