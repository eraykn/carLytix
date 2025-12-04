"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, Menu, Bot, Car } from "lucide-react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { CarDetailsPanel } from "@/components/car/CarDetailsPanel";
import { Footer } from "@/components/common/Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";

// --- TİP TANIMLAMALARI ---
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

// DÜZELTME 1: Prisma'dan null gelebilir, burayı güncelledik
interface CarSpecificationMap {
  [key: string]: number | string | null | undefined; 
}

interface CarEquipmentItem {
  isim?: string;
  mevcut?: boolean;
}

interface CarEquipment {
  guvenlik?: CarEquipmentItem[];
}

// DÜZELTME 2: Bu interface'i export ediyoruz ki page.tsx de kullansın
export interface CarEntry {
  id?: string;
  brand?: string;
  model?: string;
  year?: number;
  photo?: string | null;
  details?: CarSpecificationMap;
  donanim?: CarEquipment;
}

// DÜZELTME 3: Props tanımı (initialData'yı burada tanıtıyoruz)
interface CompareSectionProps {
  initialData: CarEntry[];
}

// --- YARDIMCI FONKSİYONLAR ---
const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

// ... (formatValue ve buildCarDetails fonksiyonları aynı kalacak) ...
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
    // ... buradaki kodların aynı kalsın ...
    // buildCarDetails içeriğini önceki cevaptaki gibi koru
    const specs = car.details ?? {};
    const guvenlikDonanim = car.donanim?.guvenlik ?? [];
  
    const hasFeature = (
      donanimList: CarEquipmentItem[],
      ...keywords: string[]
    ) =>
      donanimList.some((item) => {
        if (!item?.mevcut || !item.isim) return false;
        const normalized = normalizeKey(item.isim);
        return keywords.some((key) => normalized.includes(key));
      });
  
    let photoPath = "/images/cars/car-no-image.webp";
    if (car.photo) {
      const path = car.photo;
      if (path.startsWith("http")) {
          photoPath = path;
      } else if (path.startsWith("/images/")) {
          photoPath = path;
      } else if (path.startsWith("/")) {
          // /bmw-128i.webp -> /images/cars/bmw-128i.webp
          photoPath = `/images/cars${path}`;
      } else {
          photoPath = `/images/cars/${path}`;
      }
    }
  
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
        ortEnerjiWLTP: formatValue(specs.ortalama_enerji_tuketimi_WLTP_kWh_per_100km),
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

// Selection state type
interface CarSelection {
  brand: string;
  model: string;
  year: string;
}

// ... CompareBox bileşeni aynı kalsın ...
const CompareBox = ({
    title,
    index,
    brandOptions,
    modelsByBrand,
    carEntries,
    onAddCar,
    otherCarSelection,
    otherCarAdded,
    triggerAdd,
  }: {
    title: string;
    index: number;
    brandOptions: BrandName[];
    modelsByBrand: BrandModelYearMap;
    carEntries: CarEntry[];
    onAddCar: (selection: CarSelection) => void;
    otherCarSelection: CarSelection | null;
    otherCarAdded: boolean;
    triggerAdd: boolean;
  }) => { 
    // ... CompareBox içeriği önceki cevaptaki gibi kalsın ...
    // Sadece buildCarDetails hatası almamak için yukarıdaki buildCarDetails fonksiyonunun doğru tanımlandığından emin ol
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [carDetails, setCarDetails] = useState<CarDetailsPanelProps | null>(null);
    const [carImageSrc, setCarImageSrc] = useState("/images/cars/car-no-image.webp");

    // Diğer kutudan tetiklenince bu kutuyu da ekle
    // triggerAdd true olduğunda bir kez çalışır
    useEffect(() => {
      // Tetikleme yoksa hiçbir şey yapma
      if (!triggerAdd) return;
      
      // Zaten detay varsa hiçbir şey yapma (kutu zaten dolu)
      if (carDetails) return;
      
      // ÖNEMLİ: Tüm seçimler MUTLAKA yapılmış olmalı
      // Eğer herhangi biri boşsa, hiçbir işlem yapma
      const brandOk = selectedBrand && selectedBrand.trim() !== "";
      const modelOk = selectedModel && selectedModel.trim() !== "";
      const yearOk = selectedYear && selectedYear.trim() !== "";
      
      // Seçimler tamamlanmamışsa sessizce çık
      if (!brandOk || !modelOk || !yearOk) {
        return;
      }
      
      // Tüm kontroller geçti, arabayı bul ve ekle
      const matched = carEntries.find(c => 
        c.brand === selectedBrand && 
        c.model === selectedModel && 
        c.year === Number(selectedYear)
      );
      
      if (matched) {
        setCarDetails(buildCarDetails(matched));
      }
    }, [triggerAdd]); // Sadece triggerAdd değiştiğinde çalış - diğer dependency'ler kasıtlı olarak çıkarıldı

    useEffect(() => {
      // If a full car detail panel is displayed, its photo has priority
      if (carDetails?.general?.photo) {
          setCarImageSrc(carDetails.general.photo);
          return;
      }
  
      // Otherwise, try to find the car from the selections
      if (selectedBrand && selectedModel && selectedYear) {
          const car = carEntries.find(c => 
              c.brand === selectedBrand && 
              c.model === selectedModel && 
              c.year === Number(selectedYear)
          );
  
          if (car?.photo) {
              let path = car.photo;
              // http ile başlıyorsa olduğu gibi kullan
              if (path.startsWith("http")) {
                  setCarImageSrc(path);
              } 
              // /images/ ile başlıyorsa olduğu gibi kullan
              else if (path.startsWith("/images/")) {
                  setCarImageSrc(path);
              }
              // / ile başlıyorsa (ör: /bmw-128i.webp) images/cars ekle
              else if (path.startsWith("/")) {
                  setCarImageSrc(`/images/cars${path}`);
              }
              // Sadece dosya adıysa (ör: bmw-128i.webp) tam path oluştur
              else {
                  setCarImageSrc(`/images/cars/${path}`);
              }
          } else {
              setCarImageSrc("/images/cars/car-no-image.webp");
          }
      } else {
          setCarImageSrc("/images/cars/car-no-image.webp");
      }
  
    }, [selectedBrand, selectedModel, selectedYear, carDetails, carEntries]);
  
    const modelsForBrand = selectedBrand && modelsByBrand[selectedBrand] ? modelsByBrand[selectedBrand] : [];
    const selectedModelData = modelsForBrand.find((item) => item.label === selectedModel);
    const yearsForModel = selectedModelData ? selectedModelData.years : [];
  
    const SelectInput = ({ options, placeholder, value, onChange, disabled = false }: any) => (
      <div className="relative w-full h-12">
        <select
          aria-label={placeholder}
          className="w-full h-12 appearance-none bg-white border border-gray-200 text-gray-800 text-base px-4 pr-10 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200 cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed min-w-0 box-border absolute inset-0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
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
        className="w-[320px] min-h-[520px] bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-500/10 p-6 flex flex-col items-center gap-5"
      >
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
  
        <motion.div
          className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden relative"
        >
           {/* Basit img tagi kullandım, senin ImageWithFallback bileşenini de kullanabilirsin */}
          <img
            src={carImageSrc}
            alt="Arac gorseli"
            className={`w-full h-full object-contain ${carImageSrc.includes('no-image') ? 'scale-125' : 'p-2'}`}
          />
        </motion.div>
  
        <div className="w-full flex flex-col gap-4">
          <SelectInput
            options={brandOptions}
            placeholder="Marka Seçin"
            value={selectedBrand}
            onChange={(val: string) => {
              setSelectedBrand(val);
              setSelectedModel("");
              setSelectedYear("");
              setCarDetails(null);
            }}
          />
          <SelectInput
            options={modelsForBrand.map((item) => item.label)}
            placeholder="Model Seçin"
            value={selectedModel}
            onChange={(val: string) => {
              setSelectedModel(val);
              setSelectedYear("");
              setCarDetails(null);
            }}
            disabled={!selectedBrand}
          />
          <SelectInput
            options={yearsForModel.map(String)}
            placeholder="Yıl Seçin"
            value={selectedYear}
            onChange={(val: string) => {
              setSelectedYear(val);
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
              if (!selectedBrand || !selectedModel || !selectedYear) return;
              
              // Seçilen arabayı bul
              const matched = carEntries.find(c => 
                  c.brand === selectedBrand && 
                  c.model === selectedModel && 
                  c.year === Number(selectedYear)
              );
              
              if (matched) {
                  setCarDetails(buildCarDetails(matched));
                  // Parent'a bildir - ilk ekleme sırasında diğer kutuyu da tetikle
                  onAddCar({ brand: selectedBrand, model: selectedModel, year: selectedYear });
              }
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

// DÜZELTME 4: Ana bileşen artık props alıyor
export function CompareSection({ initialData }: CompareSectionProps) {
  const [currentPath, setCurrentPath] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Her iki kutunun ekleme durumunu takip et
  const [car1Added, setCar1Added] = useState(false);
  const [car2Added, setCar2Added] = useState(false);
  const [car3Added, setCar3Added] = useState(false);
  const [triggerCar1, setTriggerCar1] = useState(false);
  const [triggerCar2, setTriggerCar2] = useState(false);
  const [triggerCar3, setTriggerCar3] = useState(false);
  
  // 3. araç kutusunu göster/gizle
  const [showThirdCar, setShowThirdCar] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // İlk kutu eklendiğinde çağrılır
  const handleCar1Add = (selection: CarSelection) => {
    setCar1Added(true);
    // Eğer ikinci kutu henüz eklenmemişse, tetikle
    if (!car2Added) {
      setTriggerCar2(true);
      // Tetiklemeyi hemen sıfırla (bir sonraki render cycle'da)
      setTimeout(() => setTriggerCar2(false), 0);
    }
    // Eğer 3. kutu görünür ve eklenmemişse, tetikle
    if (showThirdCar && !car3Added) {
      setTriggerCar3(true);
      setTimeout(() => setTriggerCar3(false), 0);
    }
  };

  // İkinci kutu eklendiğinde çağrılır
  const handleCar2Add = (selection: CarSelection) => {
    setCar2Added(true);
    // Eğer birinci kutu henüz eklenmemişse, tetikle
    if (!car1Added) {
      setTriggerCar1(true);
      setTimeout(() => setTriggerCar1(false), 0);
    }
    // Eğer 3. kutu görünür ve eklenmemişse, tetikle
    if (showThirdCar && !car3Added) {
      setTriggerCar3(true);
      setTimeout(() => setTriggerCar3(false), 0);
    }
  };

  // Üçüncü kutu eklendiğinde çağrılır
  const handleCar3Add = (selection: CarSelection) => {
    setCar3Added(true);
    // Eğer birinci kutu henüz eklenmemişse, tetikle
    if (!car1Added) {
      setTriggerCar1(true);
      setTimeout(() => setTriggerCar1(false), 0);
    }
    // Eğer ikinci kutu henüz eklenmemişse, tetikle
    if (!car2Added) {
      setTriggerCar2(true);
      setTimeout(() => setTriggerCar2(false), 0);
    }
  };

  // DÜZELTME 5: Veriyi artık JSON'dan değil, prop'tan alıyoruz
  const carEntries = initialData; 

  const { brandOptions, modelsByBrand } = useMemo(() => {
     // ... (Burası aynı kalacak) ...
     const brandMap = new Map<string, Map<string, number[]>>();

    carEntries.forEach((car) => {
      const brand = car.brand?.trim();
      const model = car.model?.trim();
      const year = car.year;

      if (!brand || !model || typeof year !== "number") return;

      if (!brandMap.has(brand)) brandMap.set(brand, new Map());

      const modelMap = brandMap.get(brand)!;
      if (!modelMap.has(model)) modelMap.set(model, []);

      // Duplicate yıl önleme
      const years = modelMap.get(model)!;
      if (!years.includes(year)) years.push(year);
    });

    const sortedBrands = Array.from(brandMap.keys()).sort(); 

    const structuredModels: BrandModelYearMap = {};

    sortedBrands.forEach((brand) => {
      const models = brandMap.get(brand)!;
      const sortedModels = Array.from(models.keys()).sort();

      structuredModels[brand] = sortedModels.map((model) => ({
        label: model,
        years: models.get(model)!.slice().sort((a, b) => b - a),
      }));
    });

    return {
      brandOptions: sortedBrands,
      modelsByBrand: structuredModels,
    };
  }, [carEntries]);

  return (
    <>
      <div className="relative z-50">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <img 
              src="/images/brands/carlytix-concept-a-logo.svg" 
              alt="CarLytix Logo" 
              className="h-[40px] w-auto drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] ml-2"
            />
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute top-12 z-20 hidden md:flex items-center gap-8 px-6 py-3 rounded-xl bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12]"
          style={{ right: 'calc(2.5rem + 52px)' }}
        >
          {/* Regular nav items */}
          {[
            { name: "Main Menu", href: "/" },
            { name: "Compare", href: "/compare" },
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`text-sm transition-colors duration-300 relative group ${
                item.href === "/compare" ? "text-[#0ea5d8]" : "text-[#d1d5db] hover:text-[#3b82f6]"
              }`}
            >
              {item.name}
              <span className={`absolute bottom-[-8px] left-0 h-0.5 bg-[#3b82f6] transition-all duration-300 ${
                item.href === "/compare" ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </motion.a>
          ))}

          {/* CarLytix AI Dropdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative group"
          >
            <a
              href="/ai"
              className="text-sm text-[#d1d5db] hover:text-[#3b82f6] transition-colors duration-300 relative flex items-center gap-1"
            >
              CarLytix AI
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              <span className="absolute bottom-[-8px] left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300" />
            </a>
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-[#1e293b]/95 backdrop-blur-xl rounded-xl border border-white/[0.12] shadow-2xl overflow-hidden min-w-[160px]">
                <a
                  href="/ai"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-[#d1d5db] hover:text-[#0ea5d8] hover:bg-white/[0.06] transition-colors border-b border-white/[0.08]"
                >
                  <Bot className="w-4 h-4" />
                  CarLytix AI
                </a>
                <a
                  href="/assistant"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-[#d1d5db] hover:text-[#0ea5d8] hover:bg-white/[0.06] transition-colors"
                >
                  <Car className="w-4 h-4" />
                  CarLytix Match
                </a>
              </div>
            </div>
          </motion.div>

          {/* About Us */}
          <motion.a
            href="/aboutus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-[#d1d5db] hover:text-[#3b82f6] transition-colors duration-300 relative group"
          >
            About Us
            <span className="absolute bottom-[-8px] left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300" />
          </motion.a>
        </motion.nav>

        {/* Profile Menu - Right side of nav */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute top-12 z-20 hidden md:block"
          style={{ right: '2.5rem' }}
        >
          <UserProfileMenu onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        </motion.div>

        {/* Auth Modal */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>

      <section
        id="compare"
        className="relative w-full min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex items-center justify-center py-32 px-10 overflow-hidden"
      >
        {/* ... Arka plan ... */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.02]" />
        </div>

        {/* Logo ve Menüler (Kısalttım, senin kodundaki gibi kalsın) */}
        
        <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-center gap-8 mt-20">
          <CompareBox
            title="1. Aracı Ekle"
            index={1}
            brandOptions={brandOptions}
            modelsByBrand={modelsByBrand}
            carEntries={carEntries}
            onAddCar={handleCar1Add}
            otherCarSelection={null}
            otherCarAdded={car2Added}
            triggerAdd={triggerCar1}
          />
          
          <div className="hidden lg:flex items-center justify-center">
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-lg">
              <p className="text-2xl font-bold text-blue-500">VS</p>
            </div>
          </div>

          <CompareBox
            title="2. Aracı Ekle"
            index={2}
            brandOptions={brandOptions}
            modelsByBrand={modelsByBrand}
            carEntries={carEntries}
            onAddCar={handleCar2Add}
            otherCarSelection={null}
            otherCarAdded={car1Added}
            triggerAdd={triggerCar2}
          />

          {/* 3. Araç Ekle - Genişletilebilir Alan */}
          <AnimatePresence>
            {!showThirdCar ? (
              <motion.div
                key="add-third-trigger"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:flex items-center self-center cursor-pointer group"
                onClick={() => setShowThirdCar(true)}
              >
                <span className="text-white/30 hover:text-white/60 transition-colors duration-300 text-lg font-medium whitespace-nowrap flex items-center gap-2">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yeni Araç Ekle
                </span>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key="vs-divider-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="hidden lg:flex items-center justify-center"
                >
                  <div className="p-4 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-lg">
                    <p className="text-2xl font-bold text-blue-500">VS</p>
                  </div>
                </motion.div>

                <motion.div
                  key="third-car-box"
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <CompareBox
                    title="3. Aracı Ekle"
                    index={3}
                    brandOptions={brandOptions}
                    modelsByBrand={modelsByBrand}
                    carEntries={carEntries}
                    onAddCar={handleCar3Add}
                    otherCarSelection={null}
                    otherCarAdded={car1Added || car2Added}
                    triggerAdd={triggerCar3}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </>
  );
}