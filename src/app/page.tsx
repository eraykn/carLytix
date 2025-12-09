"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/common/Footer";

export default function App() {
  // Start with null to indicate we haven't determined the state yet
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  useEffect(() => {
    // Check sessionStorage only on client after hydration
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    sessionStorage.setItem("hasVisited", "true");
  }, []);

  // Show nothing during initial hydration to prevent mismatch
  if (isLoading === null) {
    return (
      <div className="w-full overflow-x-hidden bg-[#0f172a] relative min-h-screen" />
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-[#0f172a] relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      {!isLoading && (
        <>
          <HeroSection />
          <AboutSection />
          <Footer />
        </>
      )}
    </div>
  );
}
