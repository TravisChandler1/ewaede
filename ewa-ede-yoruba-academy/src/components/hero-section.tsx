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

      {/* Header with Logo and Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 transition-all duration-200 group-hover:bg-white/20 group-hover:border-white/30">
                <img
                  src="/logo.png"
                  alt="Ẹwà Èdè Yorùbá Academy Logo"
                  className="h-14 md:h-18 lg:h-24 w-auto object-contain drop-shadow-lg transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    e.currentTarget.style.display = 'none';
                    // Show fallback text
                    const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                    if (fallback) (fallback as HTMLElement).style.display = 'block';
                  }}
                />
                <div className="logo-fallback hidden text-white font-bold text-lg md:text-xl">
                  Ẹwà Èdè Yorùbá
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-white font-medium hover:text-yellow-300 transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/courses"
                className="text-white font-medium hover:text-yellow-300 transition-colors duration-200 relative group"
              >
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/about"
                className="text-white font-medium hover:text-yellow-300 transition-colors duration-200 relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-white font-medium hover:text-yellow-300 transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-white font-medium hover:text-yellow-300 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-full transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container flex flex-col items-center px-4 py-20 text-center md:py-32 relative z-10 pt-24 md:pt-32">
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
          <span className="block mt-4 text-yellow-300">
            Expert Tutors
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
      </div>
    </section>
  )
}
