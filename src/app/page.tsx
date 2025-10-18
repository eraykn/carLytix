"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

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
        </>
      )}
    </div>
  );
}
