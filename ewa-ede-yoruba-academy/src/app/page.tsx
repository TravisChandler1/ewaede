import { MainNav } from "@/components/main-nav"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <NewsletterSubscription />
      </main>
      <Footer />
    </div>
  );
}
