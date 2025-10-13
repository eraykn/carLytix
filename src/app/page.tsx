"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { HeroSection } from "@/components/HeroSection";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#0f172a]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        ) : (
          <HeroSection key="hero" />
        )}
      </AnimatePresence>
    </div>
  );
}
