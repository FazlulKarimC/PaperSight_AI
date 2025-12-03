import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground mb-8">Last updated: December 3, 2025</p>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
                            <p className="text-muted-foreground">
                                By accessing or using PaperSight AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
                            <p className="text-muted-foreground mb-4">
                                Permission is granted to temporarily use PaperSight AI for personal or commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
                            </p>
                            <p className="text-muted-foreground mb-4">Under this license you may not:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Modify or copy the service materials</li>
                                <li>Use the service for any unlawful purpose</li>
                                <li>Attempt to reverse engineer any software contained in the service</li>
                                <li>Remove any copyright or proprietary notations</li>
                                <li>Transfer the service to another person or entity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
                            <p className="text-muted-foreground">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Content Ownership</h2>
                            <p className="text-muted-foreground">
                                You retain all rights to the documents you upload to PaperSight AI. We do not claim ownership of your content. However, by using our service, you grant us a license to process your documents to provide the summarization service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptable Use</h2>
                            <p className="text-muted-foreground mb-4">You agree not to use PaperSight AI to:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Upload illegal, harmful, or offensive content</li>
                                <li>Violate any intellectual property rights</li>
                                <li>Transmit viruses or malicious code</li>
                                <li>Interfere with the service's operation</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                            <p className="text-muted-foreground">
                                PaperSight AI shall not be liable for any damages arising from the use or inability to use the service, even if we have been notified of the possibility of such damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Modifications</h2>
                            <p className="text-muted-foreground">
                                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                            <p className="text-muted-foreground">
                                For questions about these Terms of Service, please contact us at legal@papersight.ai
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
