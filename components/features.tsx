import { Brain, Zap, Shield, FileSearch, Languages, MessageSquare } from "lucide-react"

const capabilities = [
  {
    icon: MessageSquare,
    title: "Chat with PDFs",
    description:
      "Ask follow-up questions and get answers grounded directly in your document content using RAG-powered conversational AI.",
    span: "lg:col-span-2",
  },
  {
    icon: Brain,
    title: "RAG-Powered Analysis",
    description:
      "Retrieval-Augmented Generation embeds your document into a vector store, retrieves the most relevant passages, and generates grounded responses — no hallucination.",
    span: "lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get comprehensive summaries in seconds. Stream results in real-time as the AI processes.",
    span: "",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Documents are processed in memory and never stored permanently. Your data stays yours.",
    span: "",
  },
  {
    icon: FileSearch,
    title: "Key Point Extraction",
    description: "Automatically identify and highlight the most important points, statistics, and conclusions.",
    span: "",
  },
  {
    icon: Languages,
    title: "Multi-Language",
    description: "Summarize documents in 50+ languages with accurate, context-aware processing.",
    span: "",
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="mono-label mb-4">Capabilities</div>
          <h2 className="heading-display text-4xl sm:text-5xl text-foreground mb-4">
            What PaperSight<br className="hidden sm:block" /> can do for you.
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg">
            Built for researchers, students, and professionals who need to process documents faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className={`group surface-raised surface-hover rounded-xl p-6 ${cap.span}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 group-hover:bg-accent/15 transition-colors">
                  <cap.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="heading-ui text-base text-foreground">{cap.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
