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
                        Get in touch with our team. We&apos;d love to hear from you.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="border border-border rounded-xl p-6 text-center">
                            <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Email</h3>
                            <p className="text-sm text-muted-foreground">fazlul0127@gmail.com</p>
                        </div>
                        <div className="border border-border rounded-xl p-6 text-center">
                            <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                            <p className="text-sm text-muted-foreground">8486853823</p>
                        </div>
                        <div className="border border-border rounded-xl p-6 text-center">
                            <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Office</h3>
                            <p className="text-sm text-muted-foreground">Bengaluru, India</p>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="font-semibold text-foreground mb-2">What&apos;s your response time?</h3>
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
                                        Yes! We&apos;d be happy to give you a personalized demo. Just mention it in your message.
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
