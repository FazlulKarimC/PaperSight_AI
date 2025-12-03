import { Zap, Shield, Brain, Clock, FileSearch, Languages } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced language models understand context, extracting the most relevant information from your documents.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get comprehensive summaries in seconds, not hours. Process documents 100x faster than manual reading.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your documents are encrypted end-to-end. We never store or train on your data.",
  },
  {
    icon: FileSearch,
    title: "Key Point Extraction",
    description: "Automatically identify and highlight the most important points, statistics, and conclusions.",
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description: "Summarize documents in over 50 languages with automatic translation capabilities.",
  },
  {
    icon: Clock,
    title: "Batch Processing",
    description: "Upload multiple documents at once and get organized summaries for each file.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powerful features for
            <br />
            <span className="text-muted-foreground">document intelligence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform how you process and understand documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 hover:border-muted-foreground/30 transition-colors"
            >
              <div className="rounded-lg bg-secondary p-3 w-fit mb-4">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
