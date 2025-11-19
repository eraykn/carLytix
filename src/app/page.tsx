"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/common/Footer";

export default function App() {
  const [isLoading, setIsLoading] = useState(() => {
    // Tarayıcı ortamında olup olmadığımızı kontrol edelim.
    if (typeof window !== "undefined") {
      // Eğer 'hasVisited' anahtarı sessionStorage'da yoksa, yükleme ekranını göster.
      return !sessionStorage.getItem("hasVisited");
    }
    // Sunucu tarafında varsayılan olarak yükleme ekranını gösterme.
    return false;
  });

  useEffect(() => {
    sessionStorage.setItem("hasVisited", "true");
  }, []);

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
