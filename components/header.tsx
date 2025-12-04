"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, FileText } from "lucide-react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-foreground" />
            <span className="text-lg font-semibold text-foreground">PaperSight AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Button>
            </Link>
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Log in
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button className="bg-foreground text-background hover:bg-foreground/90">Get Started</Button>
                </SignInButton>
              </>
            ) : (
              <>
                <Link href="/upload">
                  <Button className="bg-foreground text-background hover:bg-foreground/90">Upload PDF</Button>
                </Link>
                <UserButton />
              </>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                How it Works
              </Link>
              <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
                Documentation
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    Dashboard
                  </Button>
                </Link>
                {!isSignedIn ? (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                        Log in
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button className="w-full bg-foreground text-background">Get Started</Button>
                    </SignInButton>
                  </>
                ) : (
                  <>
                    <Link href="/upload">
                      <Button className="w-full bg-foreground text-background">Upload PDF</Button>
                    </Link>
                    <div className="pt-2 flex justify-center">
                      <UserButton />
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
