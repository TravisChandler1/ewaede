"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/courses",
      label: "Courses",
      active: pathname === "/courses",
    },
    {
      href: "/about",
      label: "About Us",
      active: pathname === "/about",
    },
    {
      href: "/contact",
      label: "Contact",
      active: pathname === "/contact",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Ewa Ede
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          <div className="relative flex items-center bg-muted/50 rounded-lg p-1">
            {/* Active tab background indicator */}
            <div
              className="absolute top-1 left-1 h-8 bg-primary rounded-md transition-all duration-300 ease-in-out"
              style={{
                width: `${100 / routes.length}%`,
                transform: `translateX(${routes.findIndex(route => route.active) * 100}%)`,
              }}
            />

            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "relative z-10 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  route.active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-foreground/60 hover:text-foreground/80 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "py-3 px-4 rounded-lg transition-all duration-200",
                    route.active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
            {/* Auth buttons removed from mobile menu - now handled by MobileNav component */}
          </div>
        </div>
      )}
    </header>
  )
}
