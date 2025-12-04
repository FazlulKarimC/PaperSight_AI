import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out SummarizeAI",
    features: ["5 PDFs per month", "Up to 20 pages per PDF", "Basic summaries", "Email support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals and small teams",
    features: [
      "Unlimited PDFs",
      "Up to 200 pages per PDF",
      "Advanced AI summaries",
      "Key point extraction",
      "Priority support",
      "API access",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per month",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited pages",
      "Custom integrations",
      "SSO & advanced security",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Start free trial",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-8 ${plan.popular ? "border-foreground bg-card" : "border-border bg-card"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/upload">
                <Button
                  className={`w-full ${plan.popular ? "bg-foreground text-background hover:bg-foreground/90" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                >
                  {plan.cta}
                </Button>
              </Link>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
