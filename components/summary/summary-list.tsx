"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SummaryListItem from "@/components/summary/summary-list-item"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { getSummaries } from "@/lib/getSummaries"
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import type { Summary } from '@/lib/getSummaries'
import { getGuestUserId } from '@/lib/utils'
import { staggerContainer } from "@/lib/animations"
import { SkeletonCard } from "@/components/ui/loading/skeleton-card"



export default function SummaryList() {
  const { user } = useUser()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null)

  useEffect(() => {
    const clerkUserId = user?.id;
    const guestUserId = getGuestUserId();
    setEffectiveUserId(clerkUserId || guestUserId || null);
  }, [user?.id]);

  useEffect(() => {
    async function loadSummaries() {
      if (!effectiveUserId) {
        setSummaries([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const newSummaries = await getSummaries(effectiveUserId);
        if (!newSummaries) {
          return;
        }
        setSummaries(newSummaries);
      } catch (error) {
        console.error('Failed to load summaries:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSummaries();
  }, [effectiveUserId])

  const handleDelete = (deletedId: string) => {
    setSummaries(current => current.filter(summary => summary.id !== deletedId))
  }

  return (
    <div className="relative">
      {!isLoading && summaries.length === 0 ? (
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

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
    </div>
  )
}
