import { Upload, Cpu, FileText } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your PDF",
    description: "Drag and drop or browse to upload a text-based PDF document.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI analyzes content",
    description: "Advanced language models parse document structure and extract key insights in seconds.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Read & interact",
    description: "Get a structured summary with key points, then chat with the document using RAG.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="mono-label mb-4">Process</div>
          <h2 className="heading-display text-4xl sm:text-5xl text-foreground mb-4">
            Three steps to clarity.
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            From uploaded PDF to actionable insights in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border/50" />
              )}
              <div className="relative flex flex-col">
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl surface-raised group-hover:border-accent/30 transition-colors">
                    <step.icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="mono-label">{step.number}</span>
                </div>
                <h3 className="heading-ui text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
