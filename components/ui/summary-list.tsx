"use client"

import { useEffect, useState } from "react"
import SummaryCard from "@/components/ui/summary-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { getSummaries } from "@/lib/getSummaries"
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import type { Summary } from '@/lib/getSummaries'

export default function SummaryList() {
  const { user }  = useUser()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSummaries() {
      if (!user?.id) return
      try {
        setIsLoading(true)
        const newSummaries = await getSummaries(user.id)
        if (!newSummaries) {
          return
        }
        setSummaries(newSummaries)
      } catch (error) {
        console.error('Failed to load summaries:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      loadSummaries()
    } else {
      setSummaries([])
      setIsLoading(false)
    }
  }, [user?.id])

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
            <SummaryCard 
              key={summary.id} 
              summary={summary} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
