import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Link href="/">
                        <Button variant="ghost" className="mb-8 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground mb-8">Last updated: December 3, 2025</p>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
                            <p className="text-muted-foreground">
                                At PaperSight AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                            <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information</h3>
                            <p className="text-muted-foreground mb-4">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Name and email address</li>
                                <li>Account credentials</li>
                                <li>Payment information (processed securely through third-party providers)</li>
                                <li>Communication preferences</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Document Data</h3>
                            <p className="text-muted-foreground">
                                When you upload PDF documents, we temporarily process and store them to generate summaries. We do not share your documents with third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>To provide and maintain our service</li>
                                <li>To process your documents and generate summaries</li>
                                <li>To send you technical notices and support messages</li>
                                <li>To respond to your comments and questions</li>
                                <li>To improve our service and develop new features</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                            <p className="text-muted-foreground">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
                            <p className="text-muted-foreground">
                                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time through your account settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                            <p className="text-muted-foreground mb-4">You have the right to:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                                <li>Export your data</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:fazlul0127@gmail.com" className="text-accent hover:underline">
                                    fazlul0127@gmail.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
