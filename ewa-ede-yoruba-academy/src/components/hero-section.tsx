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
      {/* Animated Background with Glowing Candle Effect */}
      <div className="absolute inset-0 -z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Glowing Candle Animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-purple-400/20 to-transparent rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-gradient-radial from-indigo-500/25 via-indigo-400/15 to-transparent rounded-full animate-pulse animation-delay-1000" />
          <div className="absolute inset-8 bg-gradient-radial from-violet-500/20 via-violet-400/10 to-transparent rounded-full animate-pulse animation-delay-2000" />
        </div>

        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-15">
          <div className="absolute inset-0 bg-gradient-radial from-orange-500/25 via-orange-400/15 to-transparent rounded-full animate-pulse animation-delay-1500" />
          <div className="absolute inset-6 bg-gradient-radial from-yellow-500/20 via-yellow-400/10 to-transparent rounded-full animate-pulse animation-delay-2500" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {mounted && Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
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
          <span className="block bg-gradient-to-r from-primary via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
            Ewa Ede Academy
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
