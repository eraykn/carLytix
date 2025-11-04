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
      <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2db7f5]/10 to-[#0ea5d8]/10 opacity-50" />
        
        {/* Header - Logo ve Marka */}
        <div className="relative z-10 flex items-center gap-3 px-6 pt-6">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 overflow-hidden">
            <Image
              src="/carlytix-concept-a-logo.svg"
              alt="Carlytix Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#3CC6F0] font-medium tracking-wide">
              ÖNERİLEN ARAÇ
            </div>
          </div>
        </div>

        {/* Car Name */}
        <div className="relative z-10 px-6 pt-4">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {car.brand} {car.model}
          </h3>
          <p className="text-base text-white/60 mt-0.5 font-medium">
            {car.year}
          </p>
        </div>

        {/* Specs - 3 Column Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-3 px-6 pt-6 pb-5">
          {/* Güç */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/10 hover:border-[#3CC6F0]/30 transition-all duration-300">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">
                {car.specs?.performans?.guc_hp || 'N/A'}
              </span>
              <span className="text-xs text-white/50 font-medium">HP</span>
            </div>
            <div className="text-[10px] text-white/60 mt-1 font-medium tracking-wide uppercase">
              Güç
            </div>
          </div>

          {/* Çekiş */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/10 hover:border-[#3CC6F0]/30 transition-all duration-300">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">
                {car.specs?.guc_aktarma?.cekis || 'N/A'}
              </span>
            </div>
            <div className="text-[10px] text-white/60 mt-1 font-medium tracking-wide uppercase">
              Çekiş
            </div>
          </div>

          {/* Bagaj */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/10 hover:border-[#3CC6F0]/30 transition-all duration-300">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">
                {!car.specs?.boyutlar?.bagaj_l || car.specs.boyutlar.bagaj_l === '-' || car.specs.boyutlar.bagaj_l === '' 
                  ? 'N/A' 
                  : car.specs.boyutlar.bagaj_l}
              </span>
              {car.specs?.boyutlar?.bagaj_l && car.specs.boyutlar.bagaj_l !== '-' && car.specs.boyutlar.bagaj_l !== '' && (
                <span className="text-xs text-white/50 font-medium">L</span>
              )}
            </div>
            <div className="text-[10px] text-white/60 mt-1 font-medium tracking-wide uppercase">
              Bagaj
            </div>
          </div>
        </div>

        {/* Description Text */}
        <div className="relative z-10 px-6 pb-5">
          <p className="text-sm text-white/70 italic leading-relaxed">
            "{car.tags?.[0] || 'Şehir içi'} kullanım için ideal; düşük tüketim ve geniş iç mekan."
          </p>
        </div>

        {/* CTA Button */}
        <div className="relative z-10 px-6 pb-6">
          <motion.button
            onClick={onLearnMore}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] hover:from-[#0ea5d8] hover:to-[#2db7f5] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-[#2db7f5]/30 transition-all duration-300 flex items-center justify-between"
          >
            <span className="relative z-10 text-sm tracking-wide">Neden bu?</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            
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
