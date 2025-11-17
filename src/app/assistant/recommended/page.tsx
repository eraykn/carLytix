"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Zap, Shield, Cpu, Gauge, Settings, Star, Sparkles, Check, X } from "lucide-react";
import { usePageCurtain } from "@/hooks/usePageCurtain";

interface CarData {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  body: string;
  fuel: string;
  priceTRY: number;
  media: {
    image_main: string;
    brand_logo: string;
  };
  specs?: {
    performans?: any;
    ekonomi?: any;
    boyutlar?: any;
    guc_aktarma?: any;
    güvenlik?: any;
    teknoloji?: any;
    konfor?: any;
  };
  why?: string;
}

export default function RecommendedCarPage() {
  const searchParams = useSearchParams();
  const { navigateWithCurtain, isTransitioning } = usePageCurtain();
  const [carData, setCarData] = useState<CarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleBackClick = () => {
    if (isTransitioning) return;
    navigateWithCurtain("/assistant");
  };

  useEffect(() => {
    const carId = searchParams.get("id");
    if (carId) {
      // Load car data from assistant.json
      import("@/json/assistant.json").then((data) => {
        const car = data.default.find((c: any) => c.id === carId);
        if (car) {
          setCarData(car);
        }
        setIsLoading(false);
      });
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#2db7f5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Araç yükleniyor...</p>
        </motion.div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Araç bulunamadı</p>
          <button 
            onClick={handleBackClick}
            className="text-[#2db7f5] hover:underline cursor-pointer"
          >
            Asistana geri dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero Section with Car Image - Clean White Background */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white pb-0 overflow-visible"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 left-8 z-20"
        >
          <motion.button
            onClick={handleBackClick}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gray-100/90 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200/50 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-[#2db7f5] transition-colors" />
            <span className="font-semibold text-gray-700 group-hover:text-[#2db7f5] transition-colors cursor-pointer">
              Geri Dön
            </span>
          </motion.button>
        </motion.div>

        {/* Brand Logo - Top Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute top-8 right-8 z-20"
        >
          <div className="relative bg-gray-100/90 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-gray-200/50">
            <Image
              src={carData.media.brand_logo}
              alt={carData.brand}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* Car Name & Info - Compact */}
        <div className="relative z-10 pt-32 pb-8 px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-[#2db7f5]" />
              <span className="text-sm font-bold text-[#2db7f5] tracking-wide uppercase">
                Carlytix Önerisi
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-2 leading-tight">
              {carData.brand} {carData.model}
            </h1>
            
            <div className="flex items-center gap-3 text-base mb-8">
              <span className="text-gray-600 font-semibold">{carData.year}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-[#2db7f5] font-bold">{carData.trim}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-gray-600 font-semibold">{carData.body}</span>
            </div>
          </motion.div>

          {/* Car Main Image - Full Visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="relative w-full max-w-6xl mx-auto"
          >
            <Image
              src={carData.media.image_main}
              alt={`${carData.brand} ${carData.model}`}
              width={1400}
              height={700}
              className="object-contain w-full h-auto"
              priority
            />
            
            {/* Price Tag - Small, Bottom Right Corner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-4 right-4 md:bottom-8 md:right-8"
            >
              <div className="bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] px-5 py-3 rounded-2xl shadow-xl">
                <p className="text-white/80 text-xs font-semibold mb-0.5">Fiyat</p>
                <p className="text-lg md:text-xl font-black text-white whitespace-nowrap">
                  {carData.priceTRY.toLocaleString('tr-TR')} ₺
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Specs Section - Same as Main Page Background */}
      <section className="relative py-20 px-8 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-5xl font-black text-white mb-4">Teknik Özellikler</h3>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] mx-auto rounded-full" />
          </motion.div>

          {/* Performans Card */}
          <SpecCard
            icon={<Gauge className="w-8 h-8" />}
            title="Performans"
            data={carData.specs?.performans || {}}
            color="from-purple-500 to-pink-500"
            delay={0.1}
          />

          {/* Güç Aktarma Card */}
          <SpecCard
            icon={<Settings className="w-8 h-8" />}
            title="Güç Aktarma"
            data={carData.specs?.guc_aktarma || {}}
            color="from-blue-500 to-cyan-500"
            delay={0.2}
          />

          {/* Güvenlik Card */}
          <SpecCard
            icon={<Shield className="w-8 h-8" />}
            title="Güvenlik"
            data={carData.specs?.güvenlik || {}}
            color="from-green-500 to-emerald-500"
            delay={0.3}
          />

          {/* Teknoloji Card */}
          <SpecCard
            icon={<Cpu className="w-8 h-8" />}
            title="Teknoloji"
            data={carData.specs?.teknoloji || {}}
            color="from-orange-500 to-red-500"
            delay={0.4}
          />
        </div>
      </section>

      {/* Why Section - Premium Design */}
      <section className="relative py-24 px-8 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#2db7f5]/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-[#0ea5d8]/20 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-full border border-white/20 mb-8">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-black text-white tracking-wide">
                NEDEN BU ARAÇ?
              </span>
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2db7f5]/20 via-[#0ea5d8]/20 to-[#2db7f5]/20 blur-3xl" />
            
            {/* Content Card */}
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <Zap className="w-16 h-16 text-[#2db7f5] mb-6 mx-auto" />
              
              <p className="text-2xl leading-relaxed text-white/95 text-center font-medium">
                {carData.why || "Bu araç, kriterlerinize en uygun seçenek olarak önerilmektedir."}
              </p>

              {/* Decorative elements */}
              <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#2db7f5]/50 rounded-tl-2xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#2db7f5]/50 rounded-br-2xl" />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={handleBackClick}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-white text-gray-900 font-bold py-5 px-12 rounded-full shadow-2xl hover:shadow-white/20 transition-all text-lg cursor-pointer"
            >
              <span className="relative z-10">Yeni Arama Yap</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold z-20">
                Yeni Arama Yap
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Reusable Spec Card Component
function SpecCard({ 
  icon, 
  title, 
  data, 
  color, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  data: any; 
  color: string;
  delay: number;
}) {
  // Special rendering for Teknoloji section
  if (title === "Teknoloji") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="mb-8 last:mb-0"
      >
        <div className="group relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/10 overflow-hidden">
          {/* Animated gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          
          {/* Header */}
          <div className="relative z-10 flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
              {icon}
            </div>
            <h4 className="text-3xl font-black text-white">{title}</h4>
          </div>

          {/* Main Tech Specs Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {data.ekran_inch && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Ekran Inch</p>
                <p className="text-lg font-black text-white">{data.ekran_inch}</p>
              </div>
            )}
            {data.dijital_gosterge_inch && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Dijital Gösterge Inch</p>
                <p className="text-lg font-black text-white">{data.dijital_gosterge_inch}</p>
              </div>
            )}
            {data.gosterge_paneli && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Gösterge Paneli</p>
                <p className="text-lg font-black text-white">{data.gosterge_paneli}</p>
              </div>
            )}
            {data.multimedia && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Multimedia</p>
                <p className="text-lg font-black text-white">{data.multimedia}</p>
              </div>
            )}
          </div>

          {/* Kamera & Sensör Box */}
          {(data.kamera_sistemi || data.park_asistani) && (
            <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-6">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Kamera & Sensör</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.kamera_sistemi && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/5">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Kamera Sistemi</p>
                    <p className="text-base font-black text-white">{data.kamera_sistemi}</p>
                  </div>
                )}
                {data.park_asistani && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/5">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Park Asistanı</p>
                    <p className="text-base font-black text-white">{data.park_asistani}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Isıtma Box */}
          {data.isitma && (
            <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Isıtma</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.isitma.klima && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/5">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Klima</p>
                    <p className="text-base font-black text-white">{data.isitma.klima}</p>
                  </div>
                )}
                {data.isitma.koltuk_isitma_on !== undefined && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/5">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Koltuk Isıtma Ön</p>
                    <div className="flex items-center gap-2">
                      {data.isitma.koltuk_isitma_on ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <X className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  </div>
                )}
                {data.isitma.koltuk_isitma_arka !== undefined && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/5">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Koltuk Isıtma Arka</p>
                    <div className="flex items-center gap-2">
                      {data.isitma.koltuk_isitma_arka ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <X className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  </div>
                )}
                {data.isitma.direksiyon_isitma !== undefined && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/5">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Direksiyon Isıtma</p>
                    <div className="flex items-center gap-2">
                      {data.isitma.direksiyon_isitma ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <X className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decorative corner accents */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-full`} />
          <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${color} opacity-5 rounded-tr-full`} />
        </div>
      </motion.div>
    );
  }

  // Function to render nested data for other sections
  const renderNestedData = (obj: any, parentKey: string = ''): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      const fullKey = parentKey ? `${parentKey}_${key}` : key;
      
      // Skip arrays and nested objects for main grid
      if (Array.isArray(value)) return;
      if (typeof value === 'object' && value !== null) {
        // Recursively handle nested objects
        const nestedElements = renderNestedData(value, fullKey);
        elements.push(...nestedElements);
        return;
      }
      
      // Format key for display
      const formattedKey = key
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      elements.push(
        <div key={fullKey} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
            {formattedKey}
          </p>
          {typeof value === 'boolean' ? (
            <div className="flex items-center gap-2">
              {value ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <X className="w-6 h-6 text-red-400" />
              )}
            </div>
          ) : (
            <p className="text-lg font-black text-white">
              {value?.toString() || '-'}
            </p>
          )}
        </div>
      );
    });
    
    return elements;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="mb-8 last:mb-0"
    >
      <div className="group relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/10 overflow-hidden">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Header */}
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
            {icon}
          </div>
          <h4 className="text-3xl font-black text-white">{title}</h4>
        </div>

        {/* Data Grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderNestedData(data)}

          {/* Handle nested ADAS features */}
          {data.adas?.ozellikler && Array.isArray(data.adas.ozellikler) && (
            <div className="col-span-2 md:col-span-3 lg:col-span-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                ADAS Özellikleri
              </p>
              <div className="flex flex-wrap gap-2">
                {data.adas.ozellikler.map((feature: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-full shadow-md border border-white/5 transition-colors"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Handle teknoloji baglanti */}
          {data.baglanti && Array.isArray(data.baglanti) && (
            <div className="col-span-2 md:col-span-3 lg:col-span-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                Bağlantı Seçenekleri
              </p>
              <div className="flex flex-wrap gap-2">
                {data.baglanti.map((conn: string, index: number) => (
                  <span
                    key={index}
                    className={`px-4 py-2 bg-gradient-to-r ${color} text-white text-sm font-semibold rounded-full shadow-md`}
                  >
                    {conn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Decorative corner accents */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-full`} />
        <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${color} opacity-5 rounded-tr-full`} />
      </div>
    </motion.div>
  );
}
