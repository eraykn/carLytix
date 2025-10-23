"use client";

import { motion } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const CompareBox = ({ title, index }: { title: string; index: number }) => {
  const carBrands = ["Marka Seçin", "BMW", "Audi", "Mercedes-Benz", "Tesla", "TOGG"];
  const carModels = ["Model Seçin", "128i", "A3", "C200 AMG", "Model Y"];
  const carYears = ["Yıl Seçin", "2025", "2024", "2023", "2022", "2021"];

  const SelectInput = ({ options }: { options: string[] }) => (
    <div className="relative w-full">
      <select
        className="w-full appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-all duration-300"
        aria-label="Araç seçimi"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-sm bg-white/90 backdrop-blur-2xl border border-gray-200/80 rounded-3xl shadow-2xl shadow-gray-500/10 p-8 flex flex-col items-center gap-6"
    >
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        viewport={{ once: true }}
        className="w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300"
      >
        <ImageWithFallback
          src="/car-no-image.jpg"
          alt="Araç görseli"
          className="w-40 h-40 object-contain opacity-50"
        />
      </motion.div>

      <div className="w-full flex flex-col gap-4">
        <SelectInput options={carBrands} />
        <SelectInput options={carModels} />
        <SelectInput options={carYears} />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Ekle</span>
      </motion.button>
    </motion.div>
  );
};

export function CompareSection() {
  return (
    <section
      id="compare"
      className="relative w-full min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex items-center justify-center py-20 px-10 overflow-hidden"
    >
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 z-0">
        {/* Background Noise */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12">
        <CompareBox title="1. Aracı Ekle" index={1} />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="hidden lg:block p-4 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-lg"
        >
          <p className="text-2xl font-bold text-blue-500">VS</p>
        </motion.div>
        <CompareBox title="2. Aracı Ekle" index={2} />
      </div>
    </section>
  );
}
