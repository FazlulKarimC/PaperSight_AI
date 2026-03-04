"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SummaryListItem from "@/components/summary/summary-list-item"
import { Button } from "@/components/ui/button"
import { getSummaries } from "@/lib/getSummaries"
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
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

  // fallback loading state check since we don't have effectiveUserId out of the gate
  const _isLoading = isLoading || (isLoaded && effectiveUserId && !summariesArray && !error);

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
      {!_isLoading && summaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center">
            <Image
              src="/file.svg"
              alt="No summaries"
              width={96}
              height={96}
              className="opacity-60 mb-4"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-secondary">No summaries yet</h3>
          <p className="text-muted mb-6">Upload a PDF to get started with your first summary</p>
          <a href="/upload">
            <Button>Create Your First Summary</Button>
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
                delay: index * 0.1, // 100ms stagger delay
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

      {_isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
    </div>
  )
}
