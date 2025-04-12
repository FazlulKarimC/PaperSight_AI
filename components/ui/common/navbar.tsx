"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isSignedIn } = useUser()

  // Handle scroll effect for transparent to solid background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-b from-slate-500 to-slate-700 flex items-center justify-center">
            <span className="text-white font-bold">PS</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">PaperSight AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/#features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link href="/#about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/#contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button size="icon" className="h-9 w-9 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>PaperSight AI</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-6 mt-8">
              <div className="flex flex-col pl-4">
                <Link href="/" className="text-base font-medium transition-colors hover:text-primary py-2">
                  Home
                </Link>
                <Link href="/#features" className="text-base font-medium transition-colors hover:text-primary py-2">
                  Features
                </Link>
                <Link href="/#pricing" className="text-base font-medium transition-colors hover:text-primary py-2">
                  Pricing
                </Link>
                <Link href="/#about" className="text-base font-medium transition-colors hover:text-primary py-2">
                  About
                </Link>
                <Link href="/#contact" className="text-base font-medium transition-colors hover:text-primary py-2">
                  Contact
                </Link>
              </div>
              <div className="mt-6">
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <Button className="w-full">Sign In</Button>
                  </SignInButton>
                ) : (
                  <div className="flex justify-center">
                    <UserButton />
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

