import { Upload, Cpu, FileText } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your PDF",
    description: "Drag and drop or click to upload any PDF document up to 50MB.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI processes content",
    description: "Our AI analyzes the document structure, content, and context in seconds.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Get your summary",
    description: "Receive a clear, structured summary with key points and insights.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Get from document to summary in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 rounded-full border border-border bg-card p-4 mb-6">
                  <step.icon className="h-8 w-8 text-foreground" />
                </div>
                <span className="text-xs font-mono text-muted-foreground mb-2">{step.number}</span>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
