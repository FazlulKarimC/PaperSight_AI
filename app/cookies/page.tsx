import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CookiesPage() {
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
                        Cookie Policy
                    </h1>
                    <p className="text-muted-foreground mb-8">Last updated: December 3, 2025</p>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
                            <p className="text-muted-foreground">
                                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>

                            <div className="space-y-6">
                                <div className="border border-border rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Essential Cookies</h3>
                                    <p className="text-muted-foreground mb-2">
                                        These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and accessibility.
                                    </p>
                                    <p className="text-sm text-muted-foreground italic">
                                        Duration: Session or up to 1 year
                                    </p>
                                </div>

                                <div className="border border-border rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Performance Cookies</h3>
                                    <p className="text-muted-foreground mb-2">
                                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service.
                                    </p>
                                    <p className="text-sm text-muted-foreground italic">
                                        Duration: Up to 2 years
                                    </p>
                                </div>

                                <div className="border border-border rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Functional Cookies</h3>
                                    <p className="text-muted-foreground mb-2">
                                        These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                                    </p>
                                    <p className="text-sm text-muted-foreground italic">
                                        Duration: Up to 1 year
                                    </p>
                                </div>

                                <div className="border border-border rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Targeting Cookies</h3>
                                    <p className="text-muted-foreground mb-2">
                                        These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads on other sites.
                                    </p>
                                    <p className="text-sm text-muted-foreground italic">
                                        Duration: Up to 2 years
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
                            <p className="text-muted-foreground mb-4">
                                You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and some functionality may no longer be available.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Most browsers allow you to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>View what cookies are stored and delete them individually</li>
                                <li>Block third-party cookies</li>
                                <li>Block cookies from specific sites</li>
                                <li>Block all cookies</li>
                                <li>Delete all cookies when you close your browser</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
                            <p className="text-muted-foreground">
                                We use services from third parties such as analytics providers and advertising networks. These third parties may set their own cookies on your device. We do not control these cookies and recommend checking the third-party websites for more information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
                            <p className="text-muted-foreground">
                                We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have questions about our use of cookies, please contact us at privacy@papersight.ai
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 bg-secondary rounded-xl p-6 border border-border">
                        <h3 className="text-xl font-semibold text-foreground mb-4">Cookie Preferences</h3>
                        <p className="text-muted-foreground mb-6">
                            Manage your cookie preferences and choose which types of cookies you want to accept.
                        </p>
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                            Manage Cookie Settings
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
