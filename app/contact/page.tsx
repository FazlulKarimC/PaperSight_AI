import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
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
                        Contact Us
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Get in touch with our team. We'd love to hear from you.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="border border-border rounded-xl p-6 text-center">
                            <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Email</h3>
                            <p className="text-sm text-muted-foreground">support@papersight.ai</p>
                        </div>
                        <div className="border border-border rounded-xl p-6 text-center">
                            <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                        <div className="border border-border rounded-xl p-6 text-center">
                            <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Office</h3>
                            <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a message</h2>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90">
                                    Send Message
                                </Button>
                            </form>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="font-semibold text-foreground mb-2">What's your response time?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We typically respond to all inquiries within 24 hours during business days.
                                    </p>
                                </div>
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="font-semibold text-foreground mb-2">Do you offer phone support?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Phone support is available for Enterprise plan customers. Contact us to learn more.
                                    </p>
                                </div>
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="font-semibold text-foreground mb-2">Can I schedule a demo?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Yes! We'd be happy to give you a personalized demo. Just mention it in your message.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
