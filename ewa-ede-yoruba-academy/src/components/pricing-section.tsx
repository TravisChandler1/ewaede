import { Check, Star } from "lucide-react"
import { Button } from "./ui/button"

type PricingTier = {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

export function PricingSection() {
  const tiers: PricingTier[] = [
    {
      name: "Novice",
      price: "₦15,000",
      description: "Perfect for absolute beginners starting their Yoruba journey",
      features: [
        "Basic greetings and introductions",
        "Essential vocabulary (200+ words)",
        "Simple sentence structures",
        "Access to learning materials",
        "Weekly group practice sessions",
      ],
      cta: "Start Learning",
    },
    {
      name: "Beginner",
      price: "₦25,000",
      description: "For those with basic knowledge looking to build fluency",
      features: [
        "Expanded vocabulary (500+ words)",
        "Common phrases and expressions",
        "Basic grammar structures",
        "Listening and speaking practice",
        "Bi-weekly one-on-one sessions",
      ],
      popular: true,
      cta: "Get Started",
    },
    {
      name: "Intermediate",
      price: "₦35,000",
      description: "For learners who can hold basic conversations",
      features: [
        "Advanced vocabulary (1000+ words)",
        "Complex sentence structures",
        "Reading and writing practice",
        "Cultural insights and proverbs",
        "Weekly one-on-one sessions",
      ],
      cta: "Enroll Now",
    },
    {
      name: "Advanced",
      price: "₦45,000",
      description: "For those aiming for fluency and cultural mastery",
      features: [
        "Advanced conversation skills",
        "Idiomatic expressions",
        "Literature and media analysis",
        "Debate and presentation skills",
        "Twice weekly one-on-one sessions",
      ],
      cta: "Become Fluent",
    },
  ]

  return (
    <section className="py-20" id="pricing">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Learning Path
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Flexible pricing options to suit your learning needs and goals
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md pricing-glow ${
                tier.popular ? 'ring-2 ring-primary pricing-glow-border' : 'border-border'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className="mt-2 text-muted-foreground">{tier.description}</p>
              <div className="mt-6">
                <p className="text-4xl font-bold tracking-tight">
                  {tier.price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <Button className="mt-6 w-full" size="lg">
                  {tier.cta}
                </Button>
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Group classes included. Private lessons available at additional cost.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
