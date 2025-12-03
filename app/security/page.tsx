import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, Server } from "lucide-react"

export default function SecurityPage() {
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
                        Security
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Your data security is our top priority
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="border border-border rounded-xl p-8">
                            <Lock className="h-10 w-10 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-3">End-to-End Encryption</h2>
                            <p className="text-muted-foreground">
                                All data transmitted between your device and our servers is encrypted using industry-standard TLS 1.3 protocol. Your documents are encrypted at rest using AES-256 encryption.
                            </p>
                        </div>

                        <div className="border border-border rounded-xl p-8">
                            <Shield className="h-10 w-10 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-3">SOC 2 Compliance</h2>
                            <p className="text-muted-foreground">
                                We maintain SOC 2 Type II certification, demonstrating our commitment to security, availability, and confidentiality of your data.
                            </p>
                        </div>

                        <div className="border border-border rounded-xl p-8">
                            <Eye className="h-10 w-10 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-3">Privacy by Design</h2>
                            <p className="text-muted-foreground">
                                We follow privacy-by-design principles. Your documents are processed only for summarization and are never used for training AI models or shared with third parties.
                            </p>
                        </div>

                        <div className="border border-border rounded-xl p-8">
                            <Server className="h-10 w-10 text-accent mb-4" />
                            <h2 className="text-2xl font-semibold text-foreground mb-3">Secure Infrastructure</h2>
                            <p className="text-muted-foreground">
                                Our infrastructure is hosted on enterprise-grade cloud providers with 99.9% uptime SLA, regular security audits, and automated backup systems.
                            </p>
                        </div>
                    </div>

                    <div className="bg-secondary rounded-xl p-8 border border-border mb-12">
                        <h2 className="text-2xl font-semibold text-foreground mb-6">Security Measures</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-foreground mb-3">Technical Safeguards</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Multi-factor authentication (MFA)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Regular security updates and patches</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Intrusion detection systems</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Automated vulnerability scanning</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-3">Organizational Safeguards</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Employee security training</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Access control policies</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Incident response procedures</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-1">✓</span>
                                        <span>Regular security audits</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Report a Security Issue</h2>
                        <p className="text-muted-foreground mb-6">
                            If you discover a security vulnerability, please report it to our security team immediately. We take all reports seriously and will respond promptly.
                        </p>
                        <div className="space-y-2 text-muted-foreground mb-6">
                            <p><strong>Email:</strong> security@papersight.ai</p>
                            <p><strong>PGP Key:</strong> Available upon request</p>
                        </div>
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                            Report Vulnerability
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
