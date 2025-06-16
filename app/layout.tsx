import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "sonner";
import { BackgroundBeams } from "@/components/ui/background-beams";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaperSightAI",
  description: "PaperSightAI is a platform for AI-powered paper analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`antialiased min-h-full flex flex-col`}>
          <BackgroundBeams className="absolute inset-0 z-0" />
          <main className="flex-1 w-full bg-gradient-to-b from-indigo-900 via-gray-900 to-indigo-950">
            {children}
          </main>
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
