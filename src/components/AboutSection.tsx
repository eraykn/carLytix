"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayedText, setDisplayedText] = useState("");
  
  const fullText = "CarLytix, araç verisini anlamlı içgörülere dönüştüren modern ve güvenilir bir analiz platformudur. Gerçek zamanlı telemetri ve tarihsel verilerle arıza öngörüsü, bakım optimizasyonu ve performans iyileştirmesi sunar. Hazır paneller ve güçlü entegrasyonlarla karar alma süreçlerini hızlandırır, operasyonel maliyetleri düşürür. Basit, güvenli ve ölçeklenebilir altyapısıyla filoları ve bireysel kullanıcıları geleceğe taşır.";

  useEffect(() => {
    if (isInView && displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 8); // Her 8ms'de bir karakter ekle (daha hızlı)

      return () => clearTimeout(timeout);
    }
  }, [isInView, displayedText, fullText]);

  return (
    <section 
      id="about"
      ref={ref}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex items-center justify-center py-20 px-10"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Sol - Typewriter Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent"
          >
            Neden CarLytix?
          </motion.h2>
          
          <div className="relative">
            <p className="text-lg text-[#cbd5e1] leading-relaxed font-light">
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-6 bg-[#3b82f6] ml-1"
              />
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView && displayedText.length === fullText.length ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-4 pt-6"
          >
            <button 
              onClick={() => {
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
              }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer"
            >
              Keşfet
            </button>
            <button className="px-8 py-3 rounded-xl border-2 border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300">
              Daha Fazla
            </button>
          </motion.div>
        </motion.div>

        {/* Sağ - Araba Görseli */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-8">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1080&auto=format&fit=crop"
              alt="Porsche 911 GT3 RS"
              className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
            />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3b82f6]/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
