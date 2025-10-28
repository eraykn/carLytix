"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Route,
  Building2,
  MountainSnow,
  Car,
  CarFront,
  Package,
  Battery,
  Fuel,
  PlugZap,
  Wallet,
  Coins,
  MessageCircle
} from "lucide-react";
import { Footer } from "./Footer";

export function AssistantSection() {
  const [currentPath, setCurrentPath] = useState("");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const categories = [
    {
      id: "usage",
      label: "Arazi/Kullanım",
      options: ["Şehir içi", "Uzun yol", "Karma", "Off-road/hafif arazi", "Kış şartları", "Aile odaklı"]
    },
    {
      id: "body",
      label: "Gövde Tipi",
      options: ["SUV", "Sedan", "Hatchback", "Crossover", "Station"]
    },
    {
      id: "fuel",
      label: "Yakıt/Enerji",
      options: ["Elektrikli", "Benzin", "Dizel", "Hibrit"]
    },
    {
      id: "priorities",
      label: "Öncelikler",
      options: ["Güvenlik", "Düşük tüketim", "Performans", "Konfor", "Teknoloji/ADASC", "Uygun bakım"]
    }
  ];

  const handleStepClick = (stepId: string) => {
    setSelectedStep(stepId);
    setIsTyping(true);
    setChatMessage("");

    // Seçilen kategoriyi ve seçeneği ayır
    const [categoryId, option] = stepId.split('-', 2);

    setTimeout(() => {
      let message = "";
      switch (categoryId) {
        case "usage":
          message = `${option} seçildi. Bu kullanım için en uygun araçları öneriyorum.`;
          break;
        case "body":
          message = `${option} gövde tipi tercih edildi. Bu kategorideki en iyi seçenekleri inceliyorum.`;
          break;
        case "fuel":
          message = `${option} enerji türü seçildi. Bu tip araçlarda uzmanım.`;
          break;
        case "priorities":
          message = `${option} önceliği belirlendi. Bu kritere göre filtreleme yapıyorum.`;
          break;
        default:
          message = "Seçiminiz alındı. Size en uygun araçları buluyorum.";
      }
      setChatMessage(message);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <section
        id="assistant"
        className="relative w-full min-h-screen bg-gradient-to-b from-[#0E1726] to-[#0B1320] flex flex-col items-center justify-center py-32 px-10 overflow-hidden"
      >
        {/* Arka Plan Efektleri */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.02]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3CC6F0]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5BE7D1]/5 rounded-full blur-3xl" />
        </div>

        {/* Top Center Logo - Glassmorphism (küçültülmüş) */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <img
              src="/carlytix-concept-a-logo.svg"
              alt="CarLytix Logo"
              className="h-[36px] w-auto drop-shadow-[0_0_10px_rgba(60,198,240,0.4)] ml-2"
            />
          </div>
        </motion.div>

        {/* Top Right Navigation - Glassmorphism */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-8 right-10 z-20 hidden md:flex items-center gap-8 px-6 py-3 rounded-xl bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12]"
        >{[
            { name: "Anasayfa", href: "/" },
            { name: "Karşılaştır", href: "/compare" },
            { name: "Asistan", href: "/assistant" },
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`text-sm transition-colors duration-300 relative group ${
                currentPath === item.href
                  ? "text-[#3CC6F0]"
                  : "text-[#d1d5db] hover:text-[#3CC6F0]"
              }`}
            >
              {item.name}
              <span className={`absolute bottom-[-8px] left-0 h-0.5 bg-[#3CC6F0] transition-all duration-300 ${
                currentPath === item.href
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`} />
            </motion.a>
          ))}
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            href="#"
            className="text-xs text-[#94a3b8] hover:text-[#3CC6F0] transition-colors duration-300"
          >
            Geri Bildirim
          </motion.a>
        </motion.nav>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 right-10 z-20 md:hidden p-2 rounded-lg bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] hover:bg-white/[0.18] transition-colors"
        >
          <Menu className="w-6 h-6 text-[#e2e8f0]" />
        </motion.button>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-12 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.05] tracking-[-0.01em]">
              Seçimlerini tıkla, nokta atışı öneri al.
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-[1.5] font-normal">
              Yazmadan seçim yap; kullanım, gövde, yakıt ve bütçeye göre akıllı öneriler.
            </p>
          </motion.div>

          {/* Kategoriler ve Seçenekler */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full max-w-4xl space-y-8"
          >
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + categoryIndex * 0.1 }}
                className="space-y-4"
              >
                {/* Kategori Başlığı */}
                <h3 className="text-xl font-semibold text-white/90 text-center">
                  {category.label}
                </h3>

                {/* Alt Seçenekler */}
                <div className="flex flex-wrap justify-center gap-3">
                  {category.options.map((option, optionIndex) => (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + categoryIndex * 0.1 + optionIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStepClick(`${category.id}-${option}`)}
                      className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm ${
                        selectedStep === `${category.id}-${option}`
                          ? "bg-[#3CC6F0]/20 border-[#3CC6F0]/50 text-[#3CC6F0] shadow-lg shadow-[#3CC6F0]/20"
                          : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Kalıcı Sohbet Kutusu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg p-4 min-h-[120px] flex flex-col">
              {/* Sohbet Başlığı */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#3CC6F0]/20 flex items-center justify-center">
                  <MessageCircle className="w-3 h-3 text-[#3CC6F0]" />
                </div>
                <span className="text-xs text-white/70 font-medium">CarLytix Asistan</span>
              </div>

              {/* Mesaj Alanı */}
              <div className="flex-1 flex items-end">
                {selectedStep ? (
                  <AnimatePresence mode="wait">
                    {isTyping ? (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-1"
                      >
                        <motion.div
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-[#3CC6F0] rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-[#3CC6F0] rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-[#3CC6F0] rounded-full"
                        />
                      </motion.div>
                    ) : (
                      <motion.p
                        key="message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-white/90 text-sm leading-relaxed"
                      >
                        {chatMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                ) : (
                  <p className="text-white/50 text-sm italic">
                    Seçimlerinizi yaparak öneri alın...
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Güven Göstergeleri */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="relative z-10 mt-1 flex flex-wrap justify-center gap-8 text-white/70"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#3CC6F0]" />
              <span className="text-sm">Güncel veriler (Ekim 2025)</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#3CC6F0]" />
              <span className="text-sm">Açıklanabilir öneri</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#3CC6F0]" />
              <span className="text-sm">Hızlı (≤ 30 sn)</span>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}