import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SummarySkeleton } from "./summary-skeleton";
import { LoadingSpinner } from "@/components/ui/loading";

/**
 * Loading state for summary detail page
 * Displays skeleton loader while fetching summary data
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Loading spinner at the top */}
        <div className="flex justify-center mb-8">
          <LoadingSpinner size="lg" />
        </div>
        
        {/* Skeleton loader */}
        <SummarySkeleton />
      </main>

      <Footer />
    </div>
  );
}
