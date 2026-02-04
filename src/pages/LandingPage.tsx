import { Navbar } from "@/components/landing/Navbar";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { Hero } from "@/components/landing/Hero";
import { MarketOverview } from "@/components/landing/MarketOverview";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MarketTicker />
      <Hero />
      <MarketOverview />
      <CTA />
      <Footer />
    </div>
  );
}
