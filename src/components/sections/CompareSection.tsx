"use client";

import { useMemo, useState, MouseEvent as ReactMouseEvent, useEffect } from "react";

import { motion } from "framer-motion";
import { Plus, ChevronDown, Menu } from "lucide-react";
import carsData from "@/lib/data/cars.json";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { CarDetailsPanel } from "@/components/car/CarDetailsPanel";
import { Footer } from "@/components/common/Footer";

type BrandName = string;
type ModelName = string;

type BrandModelYearMap = Record<
  BrandName,
  {
    label: ModelName;
    years: number[];
  }[]
>;

interface CarDetailsPanelProps {
  general: Record<string, string>;
  safety: Record<string, boolean>;
}

interface CarSpecificationMap {
  motor_hacmi_l?: number | string;
  guc_hp?: number | string;
  tork_Nm?: number | string;
  "0_100_kmh_s"?: number | string;
  maksimum_hiz_kmh?: number | string;
  yakit_tuketimi_avg_l_per_100km?: number | string;
  cekis?: string;
  agirlik_kg?: number | string;
  uzunluk_mm?: number | string;
  genislik_mm?: number | string;
  bagaj_kapasitesi_l?: number | string;
  pil_turu?: string;
  elektrik_araligi_NEDC_km?: number | string;
  elektrikli_menzil_WLTP_km?: number | string;
  ortalama_enerji_tuketimi_kWh_per_100km?: number | string;
  ortalama_enerji_tuketimi_WLTP_kWh_per_100km?: number | string;
}

interface CarEquipmentItem {
  isim?: string;
  mevcut?: boolean;
}

interface CarEquipment {
  guvenlik?: CarEquipmentItem[];
}

interface CarEntry {
  id?: string;
  brand?: string;
  model?: string;
  year?: number;
  photo?: string;
  details?: CarSpecificationMap;
  donanim?: CarEquipment;
}

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

const formatValue = (input: unknown) => {
  if (input === null || input === undefined || input === "") {
    return "-";
  }

  if (typeof input === "number") {
    return Number.isFinite(input) ? input.toString() : "-";
  }

  return String(input);
};

const buildCarDetails = (car: CarEntry): CarDetailsPanelProps => {
  const specs = car.details ?? {};
  const guvenlikDonanim = car.donanim?.guvenlik ?? [];

  const hasFeature = (
    donanimList: CarEquipmentItem[],
    ...keywords: string[]
  ) =>
    donanimList.some((item) => {
      if (!item?.mevcut || !item.isim) {
        return false;
      }
      const normalized = normalizeKey(item.isim);
      return keywords.some((key) => normalized.includes(key));
    });
  
  // Fotoğraf yolunu düzelt - eğer / ile başlıyorsa /images/cars/ ekle
  const photoPath = car.photo 
    ? (car.photo.startsWith('/images/') ? car.photo : `/images/cars${car.photo}`)
    : "/images/cars/car-no-image.webp";

  return {
    general: {
      photo: photoPath,
      motorHacmi: formatValue(specs.motor_hacmi_l),
      motorGucu: formatValue(specs.guc_hp),
      tork: formatValue(specs.tork_Nm),
      hizlanma: formatValue(specs["0_100_kmh_s"]),
      maxHiz: formatValue(specs.maksimum_hiz_kmh),
      yakit: formatValue(specs.yakit_tuketimi_avg_l_per_100km),
      cekis: formatValue(specs.cekis),
      agirlik: formatValue(specs.agirlik_kg),
      uzunluk: formatValue(specs.uzunluk_mm),
      genislik: formatValue(specs.genislik_mm),
      bagaj: formatValue(specs.bagaj_kapasitesi_l),
      pil: formatValue(specs.pil_turu),
      NEDC: formatValue(specs.elektrik_araligi_NEDC_km),
      WLTP: formatValue(specs.elektrikli_menzil_WLTP_km),
      ortEnerji: formatValue(specs.ortalama_enerji_tuketimi_kWh_per_100km),
      ortEnerjiWLTP: formatValue(
        specs.ortalama_enerji_tuketimi_WLTP_kWh_per_100km
      ),
    },
    safety: {
      ABS: hasFeature(guvenlikDonanim, "abs"),
      GeriGorusAynasi: hasFeature(guvenlikDonanim, "gerigorusaynas"),
      LastikBasinci: hasFeature(guvenlikDonanim, "lastikbasnc"),
      YukusDestegi: hasFeature(guvenlikDonanim, "yokustakalks"),
      CarpismaUyarisi: hasFeature(guvenlikDonanim, "carpsmauyar"),
      DortluFlasor: hasFeature(guvenlikDonanim, "otomatikdortluflasor", "dortluflasor"),
      SurucuHavaYastigi: hasFeature(guvenlikDonanim, "surucuhavayastg"),
      EBD: hasFeature(guvenlikDonanim, "ebd"),
      FrenYardim: hasFeature(guvenlikDonanim, "frenyardmsistemi"),
      Isofix: hasFeature(guvenlikDonanim, "isofix"),
      YolcuHavaYastigi: hasFeature(guvenlikDonanim, "yolcuhavayastg"),
      MerkeziKilit: hasFeature(guvenlikDonanim, "merkezikilit"),
    },
  };
};

const CompareBox = ({
  title,
  index,
  brandOptions,
  modelsByBrand,
  carEntries,
}: {
  title: string;
  index: number;
  brandOptions: BrandName[];
  modelsByBrand: BrandModelYearMap;
  carEntries: CarEntry[];
}) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");  const [selectedYear, setSelectedYear] = useState("");  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const [carDetails, setCarDetails] = useState<CarDetailsPanelProps | null>(
    null
  );

  const modelsForBrand =
    selectedBrand && modelsByBrand[selectedBrand]
      ? modelsByBrand[selectedBrand]
      : [];

  const selectedModelData = modelsForBrand.find(
    (item) => item.label === selectedModel
  );

  const yearsForModel = selectedModelData ? selectedModelData.years : [];

  // Find selected car for photo
  const selectedCar = selectedBrand && selectedModel && selectedYear
    ? carEntries.find((car) => {
        if (
          !car.brand ||
          !car.model ||
          typeof car.year !== "number"
        ) {
          return false;
        }

        return (
          car.brand.trim().toLowerCase() ===
            selectedBrand.trim().toLowerCase() &&
          car.model.trim().toLowerCase() ===
            selectedModel.trim().toLowerCase() &&
          car.year === Number(selectedYear)
        );
      })
    : null;

  // carDetails eklendiğinde de fotoğrafı güncelle
  // Fotoğraf yollarını düzelt
  const normalizePhotoPath = (path?: string) => {
    if (!path) return "/images/cars/car-no-image.webp";
    if (path.startsWith('/images/')) return path;
    return `/images/cars${path}`;
  };

  const carImageSrc = carDetails?.general?.photo 
    || normalizePhotoPath(selectedCar?.photo) 
    || "/images/cars/car-no-image.webp";

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
    <div className="relative w-full h-12">
      <select
        className="w-full h-12 appearance-none bg-white border border-gray-200 text-gray-800 text-base px-4 pr-10 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200 cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed min-w-0 box-border absolute inset-0"
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        style={{ fontSize: '16px' }}
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
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 z-10">
        <ChevronDown className="w-4 h-4" strokeWidth={2} />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full max-w-sm lg:max-w-md xl:max-w-lg bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-500/10 p-8 lg:p-10 flex flex-col items-center gap-6"
    >
      <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">{title}</h3>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        viewport={{ once: true }}
        className="w-full h-56 lg:h-64 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden"
      >
        <ImageWithFallback
          src={carImageSrc}
          alt="Arac gorseli"
          className="w-full h-full object-contain p-2"
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
            setCarDetails(null);
          }}
        />
        <SelectInput
          options={modelsForBrand.map((item) => item.label)}
          placeholder="Model Secin"
          value={selectedModel}
          onChange={(value) => {
            setSelectedModel(value);
            setSelectedYear("");
            setCarDetails(null);
          }}
          disabled={!selectedBrand}
        />
        <SelectInput
          options={yearsForModel.map(String)}
          placeholder="Yil Secin"
          value={selectedYear}
          onChange={(value) => {
            setSelectedYear(value);
            setCarDetails(null);
          }}
          disabled={!selectedModel}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => {
          if (!selectedBrand || !selectedModel || !selectedYear) {
            setCarDetails(null);
            return;
          }

          const yearNumber = Number(selectedYear);
          const matched = carEntries.find((item) => {
            if (
              !item.brand ||
              !item.model ||
              typeof item.year !== "number"
            ) {
              return false;
            }

            return (
              item.brand.trim().toLowerCase() ===
                selectedBrand.trim().toLowerCase() &&
              item.model.trim().toLowerCase() ===
                selectedModel.trim().toLowerCase() &&
              item.year === yearNumber
            );
          });

          setCarDetails(matched ? buildCarDetails(matched) : null);
        }}
      >
        <Plus className="w-5 h-5" />
        <span>Ekle</span>
      </motion.button>

      {carDetails && (
        <CarDetailsPanel general={carDetails.general} safety={carDetails.safety ?? {}} />
      )}

    </motion.div>
  );
};

export function CompareSection() {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const carEntries = carsData as CarEntry[];

  const { brandOptions, modelsByBrand } = useMemo(() => {
    const brandMap = new Map<string, Map<string, number[]>>();

    // Build a lookup of brand -> model -> years using the JSON source.
    carEntries.forEach((car) => {
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
  }, [carEntries]);

  return (
    <>
      <section
        id="compare"
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
              src="/images/brands/carlytix-concept-a-logo.svg"
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
            { name: "Main Menu", href: "/" },
            { name: "Compare", href: "/compare" },
            { name: "CarLytix Assistant", href: "/assistant" },
            { name: "About Us", href: "/aboutus" },
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

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-12">
          <CompareBox
            title="1. Araci Ekle"
            index={1}
            brandOptions={brandOptions}
            modelsByBrand={modelsByBrand}
            carEntries={carEntries}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="hidden lg:block p-4 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-lg mt-8"
          >
            <p className="text-2xl font-bold text-blue-500">VS</p>
          </motion.div>
          <CompareBox
            title="2. Araci Ekle"
            index={2}
            brandOptions={brandOptions}
            modelsByBrand={modelsByBrand}
            carEntries={carEntries}
          />
          
        </div>
      </section>
      <Footer />
    </>
  );
}