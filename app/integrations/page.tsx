import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Slack, Cloud, Database, FileText, Trello, CheckSquare } from "lucide-react"

const integrations = [
    {
        name: "Slack",
        icon: Slack,
        description: "Get PDF summaries delivered directly to your Slack channels",
        status: "Available"
    },
    {
        name: "Google Drive",
        icon: Cloud,
        description: "Automatically summarize PDFs from your Google Drive",
        status: "Available"
    },
    {
        name: "Dropbox",
        icon: Database,
        description: "Sync and summarize documents from Dropbox",
        status: "Available"
    },
    {
        name: "Notion",
        icon: FileText,
        description: "Save summaries directly to your Notion workspace",
        status: "Coming Soon"
    },
    {
        name: "Trello",
        icon: Trello,
        description: "Attach summaries to your Trello cards",
        status: "Coming Soon"
    },
    {
        name: "Asana",
        icon: CheckSquare,
        description: "Link summaries to your Asana tasks",
        status: "Coming Soon"
    }
]

export default function IntegrationsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Integrations
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Connect PaperSight AI with your favorite tools and workflows
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map((integration) => {
                            const Icon = integration.icon
                            return (
                                <div key={integration.name} className="border border-border rounded-xl p-6 hover:border-accent transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <Icon className="h-10 w-10 text-foreground" />
                                        <span className={`text-xs px-3 py-1 rounded-full ${integration.status === "Available"
                                                ? "bg-green-500/10 text-green-500"
                                                : "bg-yellow-500/10 text-yellow-500"
                                            }`}>
                                            {integration.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {integration.name}
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        {integration.description}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled={integration.status === "Coming Soon"}
                                    >
                                        {integration.status === "Available" ? "Connect" : "Notify Me"}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-16 bg-secondary rounded-xl p-8 border border-border text-center">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">
                            Need a Custom Integration?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            We're always looking to expand our integration ecosystem. Let us know which tools you'd like to see integrated with PaperSight AI.
                        </p>
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                            Request Integration
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
