import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Code, Zap, Shield, BookOpen } from "lucide-react"

export default function ApiDocsPage() {
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
                        API Documentation
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Integrate PaperSight AI into your applications with our powerful API
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="border border-border rounded-xl p-6">
                            <Code className="h-8 w-8 text-accent mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">RESTful API</h3>
                            <p className="text-muted-foreground mb-4">
                                Simple, intuitive REST API endpoints for document summarization
                            </p>
                            <Button variant="outline">View Documentation</Button>
                        </div>
                        <div className="border border-border rounded-xl p-6">
                            <Zap className="h-8 w-8 text-accent mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Fast & Reliable</h3>
                            <p className="text-muted-foreground mb-4">
                                99.9% uptime SLA with lightning-fast response times
                            </p>
                            <Button variant="outline">View Status</Button>
                        </div>
                        <div className="border border-border rounded-xl p-6">
                            <Shield className="h-8 w-8 text-accent mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Private</h3>
                            <p className="text-muted-foreground mb-4">
                                Enterprise-grade security with API key authentication
                            </p>
                            <Button variant="outline">Security Details</Button>
                        </div>
                        <div className="border border-border rounded-xl p-6">
                            <BookOpen className="h-8 w-8 text-accent mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">SDKs & Libraries</h3>
                            <p className="text-muted-foreground mb-4">
                                Official SDKs for Python, JavaScript, Ruby, and more
                            </p>
                            <Button variant="outline">Browse SDKs</Button>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Quick Start</h2>
                        <p className="text-muted-foreground mb-6">
                            Get started with the PaperSight AI API in minutes
                        </p>
                        <div className="bg-secondary rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6">
                            <pre className="text-foreground">
                                {`curl -X POST https://api.papersight.ai/v1/summarize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/document.pdf",
    "length": "medium"
  }'`}
                            </pre>
                        </div>
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                            Get API Key
                        </Button>
                    </div>

                    <div className="bg-secondary rounded-xl p-8 border border-border">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Need Help?</h2>
                        <p className="text-muted-foreground mb-6">
                            Our developer support team is here to help you integrate PaperSight AI into your application.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="outline">Contact Support</Button>
                            <Button variant="outline">Join Discord</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
