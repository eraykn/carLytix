"use client";

import { useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { motion, useSpring } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import carsData from "@/json/cars.json";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type BrandName = string;
type ModelName = string;

type BrandModelYearMap = Record<
  BrandName,
  {
    label: ModelName;
    years: number[];
  }[]
>;

const CompareBox = ({
  title,
  index,
  brandOptions,
  modelsByBrand,
}: {
  title: string;
  index: number;
  brandOptions: BrandName[];
  modelsByBrand: BrandModelYearMap;
}) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const rotateX = useSpring(0, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 18 });

  const modelsForBrand =
    selectedBrand && modelsByBrand[selectedBrand]
      ? modelsByBrand[selectedBrand]
      : [];

  const selectedModelData = modelsForBrand.find(
    (item) => item.label === selectedModel
  );

  const yearsForModel = selectedModelData ? selectedModelData.years : [];

  const SelectInput = ({
    options,
    placeholder,
    value,
    onChange,
    disabled = false,
  }: {
    options: string[];
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
  }) => (
    <div className="relative w-full">
      <select
        className="w-full h-12 appearance-none bg-white border border-gray-200 text-gray-800 text-base px-4 pr-10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
        <ChevronDown className="w-4 h-4" strokeWidth={2} />
      </div>
    </div>
  );

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = x / rect.width - 0.5;
    const percentY = y / rect.height - 0.5;

    rotateX.set(percentY * -6);
    rotateY.set(percentX * 6);
    setHoverSide(percentX < 0 ? "left" : "right");
  };

  const resetMotion = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHoverSide(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-500/10 p-10 flex flex-col items-center gap-6"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMotion}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-blue-500/25 blur-3xl"
        animate={
          hoverSide === "left"
            ? { opacity: 0.8, scale: 1.1, x: 6, y: 6 }
            : { opacity: 0.25, scale: 0.9, x: 0, y: 0 }
        }
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl"
        animate={
          hoverSide === "right"
            ? { opacity: 0.8, scale: 1.1, x: -6, y: 6 }
            : { opacity: 0.25, scale: 0.9, x: 0, y: 0 }
        }
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        viewport={{ once: true }}
        className="w-full h-44 bg-white rounded-2xl flex items-center justify-center"
      >
        <ImageWithFallback
          src="/car-no-image.webp"
          alt="Arac gorseli"
          className="h-100 object-contain"
        />
      </motion.div>

      <div className="w-full flex flex-col gap-4">
        <SelectInput
          options={brandOptions}
          placeholder="Marka Secin"
          value={selectedBrand}
          onChange={(value) => {
            setSelectedBrand(value);
            setSelectedModel("");
            setSelectedYear("");
          }}
        />
        <SelectInput
          options={modelsForBrand.map((item) => item.label)}
          placeholder="Model Secin"
          value={selectedModel}
          onChange={(value) => {
            setSelectedModel(value);
            setSelectedYear("");
          }}
          disabled={!selectedBrand}
        />
        <SelectInput
          options={yearsForModel.map(String)}
          placeholder="Yil Secin"
          value={selectedYear}
          onChange={setSelectedYear}
          disabled={!selectedModel}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>Ekle</span>
      </motion.button>
    </motion.div>
  );
};

export function CompareSection() {
  interface CarEntry {
    brand?: string;
    model?: string;
    year?: number;
  }

  const { brandOptions, modelsByBrand } = useMemo(() => {
    const brandMap = new Map<string, Map<string, number[]>>();

    // Build a lookup of brand -> model -> years using the JSON source.
    (carsData as CarEntry[]).forEach((car) => {
      const brand = car.brand?.trim();
      const model = car.model?.trim();
      const year = car.year;

      if (!brand || !model || typeof year !== "number") {
        return;
      }

      if (!brandMap.has(brand)) {
        brandMap.set(brand, new Map());
      }

      const modelMap = brandMap.get(brand)!;
      if (!modelMap.has(model)) {
        modelMap.set(model, []);
      }

      modelMap.get(model)!.push(year);
    });

    const sortedBrands = Array.from(brandMap.keys()).sort((a, b) =>
      a.localeCompare(b, "tr")
    );

    const structuredModels: BrandModelYearMap = {};

    sortedBrands.forEach((brand) => {
      const models = brandMap.get(brand)!;
      const sortedModels = Array.from(models.keys()).sort((a, b) =>
        a.localeCompare(b, "tr")
      );

      structuredModels[brand] = sortedModels.map((model) => ({
        label: model,
        years: models
          .get(model)!
          .slice()
          .sort((a, b) => b - a),
      }));
    });

    return {
      brandOptions: sortedBrands,
      modelsByBrand: structuredModels,
    };
  }, []);

  return (
    <section
      id="compare"
      className="relative w-full min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex items-center justify-center py-20 px-10 overflow-hidden"
    >
      {/* Arka Plan Efektleri */}
      <div className="absolute inset-0 z-0">
        {/* Background Noise */}
        <div className="absolute inset-0 opacity-[0.02]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12">
        <CompareBox
          title="1. Araci Ekle"
          index={1}
          brandOptions={brandOptions}
          modelsByBrand={modelsByBrand}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="hidden lg:block p-4 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-lg"
        >
          <p className="text-2xl font-bold text-blue-500">VS</p>
        </motion.div>
        <CompareBox
          title="2. Araci Ekle"
          index={2}
          brandOptions={brandOptions}
          modelsByBrand={modelsByBrand}
        />
      </div>
    </section>
  );
}
