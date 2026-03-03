'use client';

import { motion } from 'framer-motion';
import CheatsheetViewer from "@/components/summary/cheatsheet-viewer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText, Link as LinkIcon, Zap, TrendingDown } from "lucide-react";
import { PageTransition } from "@/components/ui/loading/page-transition";
import { fadeIn } from "@/lib/animations";
import { Summary } from "@/lib/getSummaries";
import { calculateTimeSaved } from "@/lib/utils";
import { PdfSplitView } from "@/components/summary/pdf-viewer";
import { ChatPanel } from "@/components/summary/chat-panel";

interface SummaryContentProps {
  summary: Summary;
}

export function SummaryContent({ summary }: SummaryContentProps) {
  const timeSaved = summary.original_word_count
    ? calculateTimeSaved(summary.original_word_count, summary.word_count)
    : null;

  const summaryCard = (
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
  );

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
            {summary.summary_style && summary.summary_style !== 'viral' && (
              <span className="ml-1 capitalize">• {summary.summary_style}</span>
            )}
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

        {/* Reading Time Savings Banner */}
        {timeSaved && timeSaved.savedMinutes > 0 && (
          <motion.div
            className="mb-8 rounded-xl border border-accent/20 bg-linear-to-r from-accent/5 via-accent/10 to-accent/5 p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/15">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    You saved ~{timeSaved.savedMinutes} min of reading time
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Original: {timeSaved.originalMinutes} min → Summary: {timeSaved.summaryMinutes} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-accent" />
                <span className="text-sm font-bold text-accent">{timeSaved.savedPercent}% shorter</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Content with optional PDF split view */}
        {summary.original_file_url ? (
          <PdfSplitView fileUrl={summary.original_file_url}>
            {summaryCard}
          </PdfSplitView>
        ) : (
          summaryCard
        )}
      </div>

      {/* RAG Chat Panel — floating button + slide-up panel */}
      <ChatPanel
        summaryId={summary.id}
        summaryTitle={summary.title || 'Untitled Document'}
      />
    </PageTransition>
  );
}
