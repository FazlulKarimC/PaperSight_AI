"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SummaryListItem from "@/components/summary/summary-list-item"
import { Button } from "@/components/ui/button"
import { getSummaries } from "@/lib/getSummaries"
import { useUser } from '@clerk/nextjs'
import { FileText } from 'lucide-react'
import type { Summary } from '@/lib/getSummaries'
import { GUEST_COOKIE_NAME, GUEST_PREFIX } from "@/lib/guest-constants"
import { staggerContainer } from "@/lib/animations"
import { SkeletonCard } from "@/components/ui/loading/skeleton-card"
import useSWR, { useSWRConfig } from 'swr'

/** Read guest ID from cookie (client-side) */
function getGuestIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${GUEST_COOKIE_NAME}=`));
  const value = match?.split("=").slice(1).join("=");
  return value && value.startsWith(GUEST_PREFIX) ? value : null;
}

export default function SummaryList() {
  const { user, isLoaded } = useUser();
  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const clerkUserId = user?.id;
    const guestId = getGuestIdFromCookie();
    setEffectiveUserId(clerkUserId || guestId || null);
  }, [user?.id, isLoaded]);

  const swrKey = effectiveUserId ? `summaries/${effectiveUserId}` : null;
  const { data: summariesArray, error, isLoading } = useSWR(
    swrKey,
    (key: string) => getSummaries(key.split('/')[1])
  );

  const summaries = summariesArray || [];

  const { mutate } = useSWRConfig();
  const handleDelete = async (deletedId: string) => {
    // Optimistic UI update — remove the deleted summary from the local cache
    await mutate(
      effectiveUserId ? `summaries/${effectiveUserId}` : null,
      summaries.filter(summary => summary.id !== deletedId),
      false // Do not revalidate immediately
    );
  }

  return (
    <div className="relative">
      {/* Show skeletons while auth or data is loading */}
      {(!isLoaded || (effectiveUserId && !summariesArray && !error)) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : summaries.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mx-auto mb-6">
            <FileText className="h-8 w-8 text-accent" />
          </div>
          <h3 className="heading-display text-2xl text-foreground mb-3">No summaries yet</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Upload a PDF to get started with your first AI-powered summary.</p>
          <a href="/upload">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-8">Create Your First Summary</Button>
          </a>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {summaries.map((summary, index) => (
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <SummaryListItem
                summary={summary}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
