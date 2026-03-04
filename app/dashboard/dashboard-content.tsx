'use client';

/**
 * Dashboard Content Component
 * Client component that wraps dashboard content with animations
 * Implements stagger animations for stat cards and summary cards
 */

import { motion } from 'framer-motion';
import SummariesList from "@/components/summary/summary-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircleIcon, Plus, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageTransition } from "@/components/ui/loading/page-transition";
import { slideUp, staggerContainer } from "@/lib/animations";

interface DashboardContentProps {
  userId: string | undefined;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Your AI-Generated Summaries
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
                Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage and access all your PDF summaries in one place
              </p>
            </div>
            <Link href="/upload">
              <Button className="bg-foreground text-background hover:bg-foreground/90 gap-2">
                <Plus className="h-4 w-4" />
                New Summary
              </Button>
            </Link>
          </div>
        </div>

        {/* Guest landing state */}
        {!userId && (
          <div className="mb-8 rounded-xl border border-border bg-card p-8 text-center">
            <AlertCircleIcon className="w-8 h-8 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to access your Dashboard</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your saved summaries, reading history, and chat sessions are available when you sign in.
              You can still <Link href="/upload" className="text-accent hover:underline">try a free summary</Link> without an account!
            </p>
          </div>
        )}

        {/* Summaries List Section — only for authenticated users */}
        {userId && (
          <div className="relative rounded-xl border border-border bg-card p-8">
            <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Summaries</h2>
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
