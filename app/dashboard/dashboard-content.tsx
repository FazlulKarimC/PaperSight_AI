'use client';

/**
 * Dashboard Content Component
 * Client component that wraps dashboard content with animations
 */

import SummariesList from "@/components/summary/summary-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircleIcon, Plus } from "lucide-react";
import { PageTransition } from "@/components/ui/loading/page-transition";

interface DashboardContentProps {
  userId: string | undefined;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <div className="mono-label mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Your Workspace
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-display text-4xl sm:text-5xl text-foreground mb-3">
                Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage and access all your PDF summaries in one place.
              </p>
            </div>
            <Link href="/upload">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-medium">
                <Plus className="h-4 w-4" />
                New Summary
              </Button>
            </Link>
          </div>
        </div>

        {/* Guest landing state */}
        {!userId && (
          <div className="mb-8 surface-raised rounded-xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
            <div className="relative">
              <AlertCircleIcon className="w-8 h-8 text-accent mx-auto mb-4" />
              <h2 className="heading-ui text-xl text-foreground mb-2">Sign in to access your Dashboard</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your saved summaries, reading history, and chat sessions are available when you sign in.
                You can still <Link href="/upload" className="text-accent hover:underline">try a free summary</Link> without an account!
              </p>
            </div>
          </div>
        )}

        {/* Summaries List Section — only for authenticated users */}
        {userId && (
          <div className="relative surface-raised rounded-xl p-8">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-ui text-xl text-foreground">Your Summaries</h2>
                <Link href="/upload">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Upload PDF
                  </Button>
                </Link>
              </div>
              <SummariesList />
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
