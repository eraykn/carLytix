"use client";

import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

interface CarItem {
  id: string;
  model: string;
  brand: string;
  image: string;
  accentColor: string;
}

interface CarCarouselProps {
  cars: CarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CarCarousel({ cars, selectedId, onSelect }: CarCarouselProps) {
  return (
    <div className="flex flex-col gap-4">
      {cars.map((car, index) => (
        <motion.button
          key={car.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          onClick={() => onSelect(car.id)}
          whileHover={{ scale: 1.05 }}
          className={`
            relative w-[140px] h-[100px] rounded-xl overflow-hidden
            transition-all duration-300 group
            bg-white/[0.08] backdrop-blur-[16px] border
            ${selectedId === car.id ? "border-[#3b82f6] shadow-[0_8px_24px_rgba(59,130,246,0.3)]" : "border-white/[0.12] hover:border-white/[0.25]"}
          `}
        >
          {/* Car Image */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <ImageWithFallback
              src={car.image}
              alt={car.model}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-blue-500/10 to-transparent"
          />

          {/* Model Label */}
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <p className="text-[10px] text-[#e2e8f0] truncate">{car.model}</p>
          </div>

          {/* Number Badge */}
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <span className="text-[10px] text-[#94a3b8]">{car.id}</span>
          </div>

          {/* Selection Glow */}
          {selectedId === car.id && (
            <motion.div
              layoutId="selectedCarGlow"
              className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_0_20px_rgba(59,130,246,0.25)]"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}