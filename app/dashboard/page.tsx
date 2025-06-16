import SummariesList from "@/components/ui/summary-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navbar } from "@/components/hero-section"
import { AlertCircleIcon, Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { Alert, AlertDescription } from "@/components/ui/alert";


export default async function SummariesPage() {
  const user = await currentUser();
  const userId = user?.id;
  return (
    <div className="min-h-screen w-full relative mx-auto my-10 flex max-w-7xl flex-col items-stretch justify-center">
      <Navbar />
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="px-4 py-4 md:pt-20 md:pb-5 flex justify-between w-full">
        <div>
          <h1 className="font-bold tracking-tight text-secondary mb-2">Your Summaries</h1>
          <p className="tracking-tight text-muted">Transform your PDFs into concise, actionable insights</p>
        </div>
        <Link href="/upload">
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {!userId && (<Alert className="mx-4">
        <AlertCircleIcon className="w-4 h-4" color="red" />
        <AlertDescription className="text-rose-600">
          Log in to unlock your dashboard and access all your past summaries.
        </AlertDescription>
      </Alert>)}

      <div className="px-4 py-4 md:py-8 w-full">
        <SummariesList />
      </div>
    </div>
  )
}

