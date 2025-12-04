'use client';

/**
 * Trial Summary Page
 * Displays summary for guest users from sessionStorage
 * Uses same UI as regular summary page
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText, Link as LinkIcon, Home } from "lucide-react";
import { PageTransition } from "@/components/ui/loading/page-transition";
import { fadeIn } from "@/lib/animations";
import { SummaryContentViewer } from "@/components/summary/summary-content-viewer";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TrialSummary } from "@/hooks/use-pdf-upload";
import { useRouter } from "next/navigation";

export default function TrialSummaryPage() {
    const [summary, setSummary] = useState<TrialSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const stored = sessionStorage.getItem('trialSummary');
        if (stored) {
            try {
                setSummary(JSON.parse(stored));
            } catch {
                // Invalid JSON, redirect home
                router.push('/');
            }
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-24 pb-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 animate-pulse">
                        <div className="h-8 bg-secondary rounded w-32 mb-8"></div>
                        <div className="h-12 bg-secondary rounded w-3/4 mb-6"></div>
                        <div className="h-64 bg-secondary rounded"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="pt-24 pb-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl font-bold text-foreground mb-4">No Summary Found</h1>
                        <p className="text-muted-foreground mb-8">
                            It looks like you haven&apos;t generated a summary yet, or your session has expired.
                        </p>
                        <Link href="/">
                            <Button className="gap-2">
                                <Home className="h-4 w-4" />
                                Go to Home
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-20">
                <PageTransition>
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        {/* Back Button */}
                        <Link href="/">
                            <Button variant="ghost" className="mb-8 gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>

                        {/* Summary Header Section */}
                        <motion.div
                            className="mb-12"
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                                AI-Generated Summary
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 text-balance">
                                {summary.title}
                            </h1>

                            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-accent" />
                                    {new Date(summary.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-accent" />
                                    {Math.ceil(summary.wordCount / 100)} min read
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-accent" />
                                    {summary.fileName}
                                </div>
                                {summary.fileUrl && (
                                    <a
                                        href={summary.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                                    >
                                        <LinkIcon className="h-4 w-4 text-accent" />
                                        View Original PDF
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Summary Content */}
                        <motion.div
                            className="relative"
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="relative overflow-hidden border border-border bg-card w-full">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

                                <CardContent className="relative pt-6 pb-12">
                                    <div className="absolute right-4 top-4 text-sm text-muted-foreground flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                                        <FileText className="w-4 h-4 text-accent" />
                                        <span>{summary.wordCount} words</span>
                                    </div>
                                    <div className="mt-4">
                                        <SummaryContentViewer summaryText={summary.summary} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </PageTransition>
            </main>

            <Footer />
        </div>
    );
}
