"use client";

import { motion } from "motion/react";
import { Volume2, Share2, Settings, Menu, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CarCarousel } from "./CarCarousel";
import { useState, useEffect, useRef } from "react";

const carData = [
  {
    id: "01",
    model: "911 GT3 RS",
    brand: "Porsche",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1080&auto=format&fit=crop",
    accentColor: "#3b82f6",
  },
  {
    id: "02",
    model: "M4 Comp",
    brand: "BMW",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1080&auto=format&fit=crop",
    accentColor: "#10b981",
  },
  {
    id: "03",
    model: "Range Rover Sport",
    brand: "Land Rover",
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600",
    accentColor: "#8b5cf6",
  },
  {
    id: "04",
    model: "RS6",
    brand: "Audi",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600",
    accentColor: "#ef4444",
  },
  {
    id: "05",
    model: "AMG GT 63",
    brand: "Mercedes",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZXJjZWRlcyUyMEFNRyUyMEdUfGVufDF8fHx8MTc2MDIwMDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    accentColor: "#06b6d4",
  },
];

export function HeroSection() {
  const [selectedCarId, setSelectedCarId] = useState("01");
  const selectedCar = carData.find((car) => car.id === selectedCarId) || carData[0];
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef(0);

  useEffect(() => {
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      // Sadece hero section içindeyken çalışsın
      const heroElement = document.querySelector('.hero-section');
      if (!heroElement || window.scrollY > 100) {
        return; // Normal scroll'a izin ver
      }

      const now = Date.now();
      
      // Debounce: en az 500ms bekle
      if (now - lastScrollTimeRef.current < 500 || isScrolling) {
        if (window.scrollY < 100) {
          e.preventDefault();
        }
        return;
      }

      isScrolling = true;
      lastScrollTimeRef.current = now;

      const currentIndex = carData.findIndex((car) => car.id === selectedCarId);
      
      if (e.deltaY > 0) {
        // Aşağı scroll - sonraki araba
        if (currentIndex < carData.length - 1) {
          const nextIndex = currentIndex + 1;
          setSelectedCarId(carData[nextIndex].id);
          e.preventDefault();
        }
        // Son karttaysa, normal scroll'a izin ver
      } else {
        // Yukarı scroll - önceki araba
        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          setSelectedCarId(carData[prevIndex].id);
          e.preventDefault();
        }
      }

      // 500ms sonra tekrar scroll yapılabilir
      setTimeout(() => {
        isScrolling = false;
      }, 500);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [selectedCarId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="hero-section relative w-full h-screen overflow-hidden"
    >
      {/* Background - Abstract Automotive */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwYWJzdHJhY3QlMjBibHVlfGVufDF8fHx8MTc2MDIwMDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Automotive Background"
          className="w-full h-full object-cover blur-[6px]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/85 via-[#1e293b]/70 to-[#1e293b]/60" />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />
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
      >
        {["Anasayfa", "Karşılaştır", "İstatistikler"].map((item, index) => (
          <motion.a
            key={item}
            href="#"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="text-sm text-[#d1d5db] hover:text-[#3b82f6] transition-colors duration-300 relative group"
          >
            {item}
            <span className="absolute bottom-[-8px] left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300" />
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

      {/* Left Side - Car Carousel (Glassmorphism) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute left-10 top-[180px] z-10"
      >
        <CarCarousel cars={carData} selectedId={selectedCarId} onSelect={setSelectedCarId} />
      </motion.div>

      {/* Center-Right - Main Car in Glassmorphism Frame */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[8%]">
        <motion.div
          key={selectedCarId}
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative"
        >
          {/* Glassmorphism Card */}
          <div className="w-[900px] h-[650px] rounded-3xl bg-white/[0.06] backdrop-blur-[24px] border border-white/[0.15] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-10 flex items-center justify-center">
            {/* Car Image */}
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={selectedCar.image}
                alt={selectedCar.model}
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Info Badge - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-10 left-10 px-6 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] min-w-[250px]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Seçili Model</p>
                  <h2 className="text-white tracking-tight">{selectedCar.model}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{selectedCar.brand}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/30 bg-gradient-to-br from-blue-500 to-transparent"
                >
                  <span className="text-white">{selectedCar.id}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Right - Control Icons (Glassmorphism) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-8 right-8 z-20 flex items-center gap-3"
      >
        {[
          { icon: Volume2, label: "Ses" },
          { icon: Share2, label: "Paylaş" },
          { icon: Settings, label: "Ayarlar" },
        ].map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.18)" }}
            className="w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] flex items-center justify-center transition-all duration-300 hover:border-[#3b82f6]"
            aria-label={item.label}
          >
            <item.icon className="w-5 h-5 text-[#e2e8f0] group-hover:text-[#3b82f6]" strokeWidth={2} />
          </motion.button>
        ))}
      </motion.div>

      {/* Scroll Indicator - Bottom Center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <div className="flex flex-col items-center gap-2 px-5 py-3 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 cursor-pointer">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-6 h-6 text-[#94a3b8]" strokeWidth={2} />
          </motion.div>
          <p className="text-xs text-[#64748b]">Keşfet</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
