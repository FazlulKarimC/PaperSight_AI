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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg surface-raised group-hover:border-accent/30 transition-colors">
              <FileText className="h-4 w-4 text-accent" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">PaperSight AI</span>
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
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Button>
            </Link>
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Log in
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
                    Get Started
                  </Button>
                </SignInButton>
              </>
            ) : (
              <>
                <Link href="/upload">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">
                    Upload PDF
                  </Button>
                </Link>
                <UserButton />
              </>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-3">
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
                How it Works
              </Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground px-2 py-1.5" onClick={() => setMobileMenuOpen(false)}>
                Docs
              </Link>
              <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                    Dashboard
                  </Button>
                </Link>
                {!isSignedIn ? (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                        Log in
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button size="sm" className="w-full bg-accent text-accent-foreground">Get Started</Button>
                    </SignInButton>
                  </>
                ) : (
                  <>
                    <Link href="/upload">
                      <Button size="sm" className="w-full bg-accent text-accent-foreground">Upload PDF</Button>
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
