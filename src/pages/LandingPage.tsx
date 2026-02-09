import { Navbar } from "@/components/landing/Navbar";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { NewsSection } from "@/components/landing/NewsSection";
import { MarketOverview } from "@/components/landing/MarketOverview";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { FloatingChatbot } from "@/components/chat/FloatingChatbot";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MarketTicker />
      <Hero />
      <Features />
      <NewsSection />
      <MarketOverview />
      <CTA />
      <Footer />
      <FloatingChatbot />
    </div>
  );
}
