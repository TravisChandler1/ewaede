"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/hero-background.jpg')",
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Subtle Glowing Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-purple-400/10 to-transparent rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-gradient-radial from-indigo-500/15 via-indigo-400/5 to-transparent rounded-full animate-pulse animation-delay-1000" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {mounted && Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container flex flex-col items-center px-4 py-20 text-center md:py-32 relative z-10">
        {/* Navigation Links */}
        <nav className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex items-center bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-gray-900 hover:text-white hover:bg-primary"
            >
              Home
            </Link>
            <Link
              href="/courses"
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-gray-700 hover:text-white hover:bg-primary"
            >
              Courses
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-gray-700 hover:text-white hover:bg-primary"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-gray-700 hover:text-white hover:bg-primary"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Ẹwà Èdè Yorùbá Academy"
              className="h-12 md:h-16 lg:h-20 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Animated Icon */}
        <div className="mb-8 animate-bounce-slow">
          <div className="relative">
            <BookOpen className="w-16 h-16 text-primary mx-auto animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-ping" />
          </div>
        </div>

        {/* Animated Title */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
          Learn Yoruba with
          <span className="block mt-4">
            <img
              src="/logo.png"
              alt="Ewa Ede Yoruba Academy"
              className="h-12 md:h-16 lg:h-20 w-auto mx-auto"
            />
          </span>
        </h1>

        {/* Animated Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground animate-fade-in-up animation-delay-300">
          Discover the beauty of the Yoruba language through our interactive courses,
          expert tutors, and immersive learning experience.
        </p>

        {/* Animated Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Button
            size="lg"
            asChild
            className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-glow"
          >
            <Link href="/courses" className="flex items-center">
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 animate-bounce-right" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="hover:scale-105 transition-all duration-300 hover:bg-primary/10 animate-glow-outline"
          >
            <Link href="/about" className="flex items-center">
              Learn More
            </Link>
          </Button>
        </div>

        {/* Auth Buttons */}
        <div className="mt-6 flex items-center justify-center gap-4 animate-fade-in-up animation-delay-700">
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
      </div>
    </section>
  )
}
