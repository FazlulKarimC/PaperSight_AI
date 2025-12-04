'use client';

/**
 * Summary Content Component
 * Client component that wraps summary detail content with animations
 * Implements fade-in animation for content display
 */

import { motion } from 'framer-motion';
import CheatsheetViewer from "@/components/summary/cheatsheet-viewer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText, Link as LinkIcon } from "lucide-react";
import { PageTransition } from "@/components/ui/loading/page-transition";
import { fadeIn } from "@/lib/animations";
import { Summary } from "@/lib/getSummaries";

interface SummaryContentProps {
  summary: Summary;
}

export function SummaryContent({ summary }: SummaryContentProps) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
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
              {new Date(summary.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              {Math.ceil(summary.word_count / 100)} min read
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              {summary.file_name}
            </div>
            {summary.original_file_url && (
              <a
                href={summary.original_file_url}
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

        {/* Summary Content with fade-in animation */}
        <motion.div
          className="relative rounded-xl border border-border bg-card p-8 sm:p-12 shadow-sm"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
          <div className="relative">
            <CheatsheetViewer summary={summary} />
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
