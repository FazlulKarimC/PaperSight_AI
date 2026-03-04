'use client';

import { motion } from 'framer-motion';
import CheatsheetViewer from "@/components/summary/cheatsheet-viewer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText, Link as LinkIcon, Zap, TrendingDown, MessageSquare } from "lucide-react";
import { PageTransition } from "@/components/ui/loading/page-transition";
import { fadeIn } from "@/lib/animations";
import { Summary } from "@/lib/getSummaries";
import { calculateTimeSaved } from "@/lib/utils";
import { PdfSplitView } from "@/components/summary/pdf-viewer";
import { ChatPanel } from "@/components/summary/chat-panel";
import { useUser, SignInButton } from "@clerk/nextjs";

interface SummaryContentProps {
  summary: Summary;
}

export function SummaryContent({ summary }: SummaryContentProps) {
  const { isSignedIn } = useUser();
  const timeSaved = summary.original_word_count
    ? calculateTimeSaved(summary.original_word_count, summary.word_count)
    : null;

  const summaryCard = (
    <motion.div
      className="relative rounded-xl surface-raised p-8 sm:p-12"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.2 }}
    >
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      <div className="relative prose-editorial">
        <CheatsheetViewer summary={summary} />
      </div>
    </motion.div>
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href={isSignedIn ? "/dashboard" : "/"}>
          <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {isSignedIn ? "Back to Dashboard" : "Back to Home"}
          </Button>
        </Link>

        {/* Summary Header Section */}
        <motion.div
          className="mb-12"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="mono-label mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            AI-Generated Summary
            {summary.summary_style && summary.summary_style !== 'viral' && (
              <span className="ml-1 capitalize">• {summary.summary_style}</span>
            )}
          </div>

          <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            {summary.title}
          </h1>

          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground border-b border-border/50 pb-8">
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
            className="mb-8 rounded-xl surface-raised p-5 border-accent/20"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20">
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
              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 border border-accent/20">
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

      {/* RAG Chat Panel — only for signed-in users */}
      {isSignedIn ? (
        <ChatPanel
          summaryId={summary.id}
          summaryTitle={summary.title || 'Untitled Document'}
        />
      ) : (
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors">
              <MessageSquare className="h-4 w-4" />
              Sign in to chat with this PDF
            </button>
          </SignInButton>
        </motion.div>
      )}
    </PageTransition>
  );
}
