"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Footer } from "./Footer";

export function AssistantSection() {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <>
      <section
        id="assistant"
        className="relative w-full min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex items-center justify-center py-32 px-10 overflow-hidden"
      >
        {/* Arka Plan Efektleri */}
        <div className="absolute inset-0 z-0">
          {/* Background Noise */}
          <div className="absolute inset-0 opacity-[0.02]" />
        </div>

        {/* Top Center Logo - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_0_rgba(255,255,255,0.1)]">
            {/* CarLytix Logo */}
            <img
              src="/carlytix-concept-a-logo.svg"
              alt="CarLytix Logo"
              className="h-[40px] w-auto drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] ml-2"
            />
          </div>
        </motion.div>

        {/* Top Right Navigation - Glassmorphism */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute top-12 right-10 z-20 hidden md:flex items-center gap-8 px-6 py-3 rounded-xl bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12]"
        >{[
            { name: "Anasayfa", href: "/" },
            { name: "Karşılaştır", href: "/compare" },
            { name: "Carlytix Asistan", href: "#" },
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`text-sm transition-colors duration-300 relative group ${
                currentPath === item.href
                  ? "text-[#3b82f6]"
                  : "text-[#d1d5db] hover:text-[#3b82f6]"
              }`}
            >
              {item.name}
              <span className={`absolute bottom-[-8px] left-0 h-0.5 bg-[#3b82f6] transition-all duration-300 ${
                currentPath === item.href
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`} />
            </motion.a>
          ))}
        </motion.nav>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute top-12 right-10 z-20 md:hidden p-2 rounded-lg bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] hover:bg-white/[0.18] transition-colors"
        >
          <Menu className="w-6 h-6 text-[#e2e8f0]" />
        </motion.button>

        {/* Assistant Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              CarLytix Asistan
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Araç seçiminizde size yardımcı olmak için buradayız. Sorularınızı sorun, öneriler alın.
            </p>
          </motion.div>

          {/* Assistant Interface Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl"
          >
            <div className="text-center text-white">
              <p className="text-lg mb-4">Asistan arayüzü burada olacak</p>
              <p className="text-sm text-gray-400">Bu bölüm daha sonra geliştirilecek</p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}