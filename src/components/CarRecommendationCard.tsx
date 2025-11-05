"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface CarRecommendation {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  body: string;
  fuel: string;
  drivetrain: string;
  priceTRY: number;
  tags: string[];
  media: {
    image_main: string;
    image_interior?: string;
    brand_logo: string;
  };
  specs: {
    performans: {
      guc_hp: number;
      tork_Nm: number;
      [key: string]: any;
    };
    boyutlar: {
      bagaj_l: string | number;
      [key: string]: any;
    };
    guc_aktarma: {
      cekis: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

interface CarRecommendationCardProps {
  car: CarRecommendation;
  onLearnMore?: () => void;
}

export function CarRecommendationCard({ car, onLearnMore }: CarRecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.5 
      }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2db7f5]/10 to-[#0ea5d8]/10 opacity-50" />
        
        {/* Animated gradient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2db7f5]/20 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32" />
        
        {/* Header - Clean Logo + Badge */}
        <div className="relative z-10 px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            {/* Logo - Clean & Big */}
            <div className="relative group flex-shrink-0">
              {/* Logo */}
              <Image
                src="/carlytix-concept-a-logo.svg"
                alt="Carlytix"
                width={160}
                height={60}
                className="object-contain drop-shadow-[0_2px_8px_rgba(45,183,245,0.4)]"
              />
            </div>
            
            {/* Badge - Powered by */}
            <div className="flex-1 bg-gradient-to-r from-[#2db7f5]/15 to-[#0ea5d8]/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-[#3CC6F0]/20">
              <div className="flex items-center justify-between">
                {/* Badge text */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-[#3CC6F0]/70 font-semibold tracking-wider uppercase">
                    Powered by
                  </span>
                  <span className="text-sm text-white font-black tracking-wide">
                    CARLYTIX AI
                  </span>
                </div>
                
                {/* Pulse indicator */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="text-xs text-green-400 font-semibold">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Car Name - Enhanced */}
        <div className="relative z-10 px-6 pt-2 pb-1">
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80 tracking-tight leading-tight">
              {car.brand} {car.model}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm text-white/50 font-semibold">
              {car.year}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-sm text-[#3CC6F0]/80 font-medium">
              {car.trim}
            </span>
          </div>
        </div>

        {/* Specs - 3 Column Grid - Modern Cards */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 px-6 pt-5 pb-5">
          {/* Güç */}
          <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10 hover:border-[#3CC6F0]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#3CC6F0]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3CC6F0]/0 to-[#3CC6F0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">
                  {car.specs?.performans?.guc_hp || '-'}
                </span>
                <span className="text-[10px] text-white/40 font-bold uppercase">HP</span>
              </div>
              <div className="text-[9px] text-white/50 mt-1.5 font-semibold tracking-wider uppercase">
                Güç
              </div>
            </div>
          </div>

          {/* Çekiş */}
          <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10 hover:border-[#3CC6F0]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#3CC6F0]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3CC6F0]/0 to-[#3CC6F0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">
                  {car.specs?.guc_aktarma?.cekis || '-'}
                </span>
              </div>
              <div className="text-[9px] text-white/50 mt-1.5 font-semibold tracking-wider uppercase">
                Çekiş
              </div>
            </div>
          </div>

          {/* Bagaj */}
          <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10 hover:border-[#3CC6F0]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#3CC6F0]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3CC6F0]/0 to-[#3CC6F0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">
                  {!car.specs?.boyutlar?.bagaj_l || car.specs.boyutlar.bagaj_l === '-' || car.specs.boyutlar.bagaj_l === '' 
                    ? '-' 
                    : car.specs.boyutlar.bagaj_l}
                </span>
                {car.specs?.boyutlar?.bagaj_l && car.specs.boyutlar.bagaj_l !== '-' && car.specs.boyutlar.bagaj_l !== '' && (
                  <span className="text-[10px] text-white/40 font-bold uppercase">L</span>
                )}
              </div>
              <div className="text-[9px] text-white/50 mt-1.5 font-semibold tracking-wider uppercase">
                Bagaj
              </div>
            </div>
          </div>
        </div>

        {/* Description Text */}
        <div className="relative z-10 px-6 pb-4">
          <p className="text-sm text-white/60 italic leading-relaxed">
            "{car.tags?.[0] || 'Şehir içi'} kullanım için ideal; düşük tüketim ve geniş iç mekan."
          </p>
        </div>

        {/* CTA Button - Modern */}
        <div className="relative z-10 px-6 pb-6">
          <motion.button
            onClick={onLearnMore}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-[#2db7f5] via-[#1ba5db] to-[#0ea5d8] text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-[#2db7f5]/20 hover:shadow-2xl hover:shadow-[#2db7f5]/40 transition-all duration-300"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0ea5d8] via-[#1ba5db] to-[#2db7f5] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-between cursor-pointer">
              <span className="text-base tracking-wide font-extrabold">Neden bu araç?</span>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-80 font-medium">Detaylar</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </motion.button>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2db7f5] via-[#3CC6F0] to-[#0ea5d8]" />
      </div>
    </motion.div>
  );
}
