import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Briefcase, MapPin, Clock } from "lucide-react"

const jobOpenings = [
    {
        id: 1,
        title: "Senior AI Engineer",
        department: "Engineering",
        location: "Remote / San Francisco, CA",
        type: "Full-time",
        description: "Help us build the next generation of AI-powered document analysis tools."
    },
    {
        id: 2,
        title: "Product Designer",
        department: "Design",
        location: "Remote / New York, NY",
        type: "Full-time",
        description: "Create beautiful and intuitive user experiences for our growing platform."
    },
    {
        id: 3,
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Remote",
        type: "Full-time",
        description: "Help our customers get the most value from PaperSight AI."
    },
    {
        id: 4,
        title: "Marketing Manager",
        department: "Marketing",
        location: "Remote / London, UK",
        type: "Full-time",
        description: "Drive growth and build our brand in the AI document analysis space."
    }
]

export default function CareersPage() {
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
                        Careers at PaperSight AI
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Join us in building the future of document intelligence
                    </p>

                    <div className="mb-16 p-8 bg-secondary rounded-xl border border-border">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Why Join Us?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">🚀 Innovation</h3>
                                <p className="text-sm text-muted-foreground">Work with cutting-edge AI technology</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">🌍 Remote-First</h3>
                                <p className="text-sm text-muted-foreground">Work from anywhere in the world</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">💡 Impact</h3>
                                <p className="text-sm text-muted-foreground">Help millions work more efficiently</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-foreground mb-8">Open Positions</h2>
                    <div className="space-y-6">
                        {jobOpenings.map((job) => (
                            <div key={job.id} className="border border-border rounded-xl p-6 hover:border-accent transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-2xl font-semibold text-foreground mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Button className="bg-foreground text-background hover:bg-foreground/90">
                                        Apply Now
                                    </Button>
                                </div>
                                <p className="text-muted-foreground">{job.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center p-8 bg-secondary rounded-xl border border-border">
                        <h3 className="text-2xl font-semibold text-foreground mb-4">Don't see a perfect fit?</h3>
                        <p className="text-muted-foreground mb-6">
                            We're always looking for talented people. Send us your resume and let us know how you'd like to contribute.
                        </p>
                        <Button size="lg" variant="outline">
                            Send General Application
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
