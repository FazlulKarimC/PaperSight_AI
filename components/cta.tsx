import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Cta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to transform how you
            <br />
            read documents?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of professionals saving hours every week with AI-powered document summaries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-8">
                Get started for free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Talk to sales
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}
