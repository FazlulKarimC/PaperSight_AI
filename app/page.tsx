import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Logos } from "@/components/logos"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { Cta } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <Pricing />
      <Cta />
      <Footer />
    </main>
  )
}
