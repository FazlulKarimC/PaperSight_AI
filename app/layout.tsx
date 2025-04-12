import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/common/navbar";
import Footer from "@/components/ui/common/footer";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "sonner";

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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}>
          <Navbar />
          <main className="flex-1 w-full bg-gradient-to-b from-indigo-300 via-indigo-200 to-white">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
