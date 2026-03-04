'use client';

/**
 * Trial Summary Page — DEPRECATED
 *
 * Guest summaries are now saved to the database and viewed at /summary/[id].
 * This page redirects to the upload page if anyone lands here from an old link.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Upload } from 'lucide-react';

export default function TrialSummaryPage() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect after 3 seconds
        const timer = setTimeout(() => router.push('/upload'), 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                        Page Moved
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Guest summaries are now saved and viewable like regular summaries.
                        Redirecting you to the upload page...
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/">
                            <Button variant="outline" className="gap-2">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>
                        <Link href="/upload">
                            <Button className="gap-2">
                                <Upload className="h-4 w-4" />
                                Upload PDF
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
