"use client";

import { useEffect, useState, useRef } from "react"; // useRef eklendi
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Zap, Shield, Cpu, Gauge, Settings, Star, Sparkles, Check, X, Car, TurkishLira, Armchair, Heart, Loader2, CheckCircle2 } from "lucide-react";
import { usePageCurtain } from "@/hooks/usePageCurtain";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Veri Tipi Tanımlaması
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
  specs?: any;
  score?: {
    toplam: number;
    kriterler: {
      ekonomi: number;
      konfor: number;
      guvenlik: number;
      performans: number;
      teknoloji: number;
    };
  };
  why?: string;
}

export default function RecommendedCarPage() {
  const searchParams = useSearchParams();
  const { navigateWithCurtain, isTransitioning } = usePageCurtain();
  const [carData, setCarData] = useState<CarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleBackClick = () => {
    if (isTransitioning) return;
    navigateWithCurtain("/assistant");
  };

  // Bu arabayı hesabıma kaydet
  const handleSaveToAccount = async () => {
    if (!carData || isSaving || isSaved) return;

    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      toast.error("Bu özelliği kullanmak için giriş yapmalısınız", {
        position: "bottom-center",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/user/matched-cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          carId: carData.id,
          brand: carData.brand,
          model: carData.model,
          trim: carData.trim,
          year: carData.year,
          body: carData.body,
          fuel: carData.fuel,
          price: carData.priceTRY,
          imageMain: carData.media?.image_main,
          brandLogo: carData.media?.brand_logo,
          matchScore: carData.score?.toplam,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSaved(true);
        if (data.isExisting) {
          toast.info("Bu araç zaten listenizde!", {
            position: "bottom-center",
          });
        } else {
          toast.success("Araç Match Cars listenize eklendi! 🎉", {
            position: "bottom-center",
          });
        }
      } else {
        toast.error(data.error || "Bir hata oluştu", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu", {
        position: "bottom-center",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const carId = searchParams.get("id");
    
    if (carId) {
      setIsLoading(true);
      // DÜZELTME: Artık JSON dosyasından değil, API'den çekiyoruz
      fetch(`/api/assistant/car?id=${carId}`)
        .then((res) => {
            if (!res.ok) throw new Error("Araç bulunamadı");
            return res.json();
        })
        .then((data) => {
          setCarData(data);
          setIsLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setIsLoading(false);
        });
    } else {
        setIsLoading(false);
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
          <p className="text-gray-600 font-semibold">Araç verileri yükleniyor...</p>
        </motion.div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Araç bulunamadı veya bir hata oluştu.</p>
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
      {/* Hero Section */}
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
          className="absolute top-4 left-8 z-20 flex items-center gap-3"
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

          {/* Save to Match Cars Button */}
          <motion.button
            onClick={handleSaveToAccount}
            disabled={isSaving || isSaved}
            whileHover={{ scale: isSaved ? 1 : 1.05 }}
            whileTap={{ scale: isSaved ? 1 : 0.95 }}
            className={`flex items-center gap-2 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg transition-all border group ${
              isSaved 
                ? "bg-emerald-100/90 border-emerald-300/50 cursor-default" 
                : "bg-gray-100/90 border-gray-200/50 hover:shadow-xl"
            } disabled:opacity-70`}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
            ) : isSaved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-[#2db7f5] transition-colors" />
            )}
            <span className={`font-semibold transition-colors ${
              isSaved 
                ? "text-emerald-700" 
                : "text-gray-700 group-hover:text-[#2db7f5]"
            }`}>
              {isSaving ? "Kaydediliyor..." : isSaved ? "Kaydedildi!" : "Bu Arabayı Seç"}
            </span>
          </motion.button>
        </motion.div>

        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute top-4 right-8 z-20"
        >
          <div className="relative bg-gray-100/90 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-gray-200/50">
             {/* Logo varsa göster, yoksa boş div */}
             {carData.media.brand_logo ? (
                <Image
                src={carData.media.brand_logo}
                alt={carData.brand}
                width={80}
                height={80}
                className="object-contain"
                />
             ) : <div className="w-20 h-20 bg-gray-200 rounded-full" />}
          </div>
        </motion.div>

        {/* Car Name & Info */}
        <div className="relative z-10 pt-24 pb-2 px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-[#2db7f5]" />
              <span className="text-sm font-bold text-[#2db7f5] tracking-wide uppercase">
                Carlytix Önerisi
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-2 leading-tight">
              {carData.brand} {carData.model}
            </h1>
            
            <div className="flex items-center gap-3 text-base mb-4">
              <span className="text-gray-600 font-semibold">{carData.year}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-[#2db7f5] font-bold">{carData.trim || ""}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-gray-600 font-semibold">{carData.body}</span>
            </div>
          </motion.div>

          {/* Car Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="relative w-full max-w-6xl mx-auto"
          >
            {carData.media.image_main ? (
                <Image
                src={carData.media.image_main}
                alt={`${carData.brand} ${carData.model}`}
                width={1400}
                height={700}
                className="object-contain w-full h-auto"
                priority
                />
            ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400">Görsel Yok</div>
            )}
            
            {/* Price Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-4 right-4 md:bottom-8 md:right-8"
            >
              <div className="bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] px-5 py-3 rounded-2xl shadow-xl">
                <p className="text-white/80 text-xs font-semibold mb-0.5">Fiyat</p>
                <p className="text-lg md:text-xl font-black text-white whitespace-nowrap">
                  {carData.priceTRY ? carData.priceTRY.toLocaleString('tr-TR') : 0} ₺
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Specs Section */}
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

          {/* Cards */}
          <SpecCard icon={<Gauge className="w-8 h-8" />} title="Performans" data={carData.specs?.performans || {}} color="from-purple-500 to-pink-500" delay={0.1} />
          <SpecCard icon={<Settings className="w-8 h-8" />} title="Güç Aktarma" data={carData.specs?.guc_aktarma || {}} color="from-blue-500 to-cyan-500" delay={0.2} />
          <SpecCard icon={<Shield className="w-8 h-8" />} title="Güvenlik" data={carData.specs?.güvenlik || {}} color="from-green-500 to-emerald-500" delay={0.3} />
          <SpecCard icon={<Cpu className="w-8 h-8" />} title="Teknoloji" data={carData.specs?.teknoloji || {}} color="from-orange-500 to-red-500" delay={0.4} />
        </div>
      </section>

      {/* Score Section */}
      {carData.score && (
        <section className="relative py-12 px-8 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <Sparkles className="w-5 h-5 text-[#2db7f5]" />
              <h3 className="text-2xl font-bold text-white">CarLytix Puanlaması</h3>
            </motion.div>

            {/* Total Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="group relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-xl p-6 border border-[#2db7f5]/20 hover:border-[#2db7f5]/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2db7f5]/0 to-[#0ea5d8]/0 group-hover:from-[#2db7f5]/5 group-hover:to-[#0ea5d8]/5 transition-all duration-300" />
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  <p className="text-sm text-white/50 font-medium">Toplam Puan</p>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#2db7f5] to-[#0ea5d8] text-white">
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <AnimatedCounter value={carData.score.toplam} className="text-5xl font-black text-white" />
                      <span className="text-xl text-white/40 font-bold">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sub Scores */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl">
                <CompactScoreCard icon={<TurkishLira className="w-5 h-5" />} title="Ekonomi" score={carData.score.kriterler.ekonomi} delay={0.2} />
                <CompactScoreCard icon={<Armchair className="w-5 h-5" />} title="Konfor" score={carData.score.kriterler.konfor} delay={0.3} />
                <CompactScoreCard icon={<Shield className="w-5 h-5" />} title="Güvenlik" score={carData.score.kriterler.guvenlik} delay={0.4} />
                <CompactScoreCard icon={<Gauge className="w-5 h-5" />} title="Performans" score={carData.score.kriterler.performans} delay={0.5} />
                <CompactScoreCard icon={<Cpu className="w-5 h-5" />} title="Teknoloji" score={carData.score.kriterler.teknoloji} delay={0.6} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Section */}
      <section className="relative py-16 px-8 bg-[#0f172a]">
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-[24px] border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/20">
              <div className="bg-gradient-to-r from-[#2db7f5]/10 to-[#0ea5d8]/10 px-8 py-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-4">
                  {carData.media.brand_logo && (
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg ring-1 ring-black/5">
                      <Image
                        src={carData.media.brand_logo}
                        alt={carData.brand}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-satoshi text-base font-semibold text-white/80 tracking-wide">
                    Neden Bu Araç?
                  </h3>
                </div>
              </div>

              <div className="px-8 py-10">
                <p className="font-satoshi text-lg leading-relaxed text-white/85 font-normal">
                  {carData.why || "Bu araç, kriterlerinize en uygun seçenek olarak önerilmektedir."}
                </p>
              </div>
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

// Reusable Components
function SpecCard({ icon, title, data, color, delay }: { icon: React.ReactNode; title: string; data: any; color: string; delay: number; }) {
  
  // Güvenlik bölümü için özel render
  const renderSecurityData = (obj: any): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    if (!obj) return elements;

    // Sıralı güvenlik alanları: NCAP Yıldız, Seviye, Airbag Sayısı, ISOFIX
    const securityOrder = ['ncap_yildiz', 'adas', 'airbag_sayisi', 'isofix'];
    const securityLabels: Record<string, string> = {
      'ncap_yildiz': 'NCAP Yıldız',
      'adas': 'ADAS Seviyesi',
      'airbag_sayisi': 'Airbag Sayısı',
      'isofix': 'ISOFIX'
    };
    const tooltips: Record<string, string> = {
      'ncap_yildiz': 'Euro NCAP güvenlik testi sonucu. 5 yıldız en yüksek güvenlik seviyesini temsil eder.',
      'isofix': 'Çocuk koltuğu bağlantı sistemi. Güvenli ve kolay montaj sağlar.'
    };

    // Önce ADAS içindeki seviye bilgisini çıkar
    let adasSeviye = null;
    if (obj.adas && typeof obj.adas === 'object' && obj.adas.seviye) {
      adasSeviye = obj.adas.seviye;
    }

    securityOrder.forEach((key) => {
      let value = obj[key];
      
      // ADAS için seviye bilgisini kullan
      if (key === 'adas') {
        value = adasSeviye;
        if (!value) return;
      }
      
      if (value === undefined || value === null) return;

      const label = securityLabels[key] || key;
      const tooltip = tooltips[key];

      elements.push(
        <div key={key} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
            {label}
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-0.5 text-blue-400 cursor-help text-[10px] font-bold leading-none">*</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-800 border border-white/10 text-white max-w-xs text-sm">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </p>
          {typeof value === 'boolean' ? (
            <div className="flex items-center gap-2">
              {value ? <Check className="w-6 h-6 text-green-400" /> : <X className="w-6 h-6 text-red-400" />}
            </div>
          ) : (
            <p className="text-lg font-black text-white">{value?.toString() || '-'}</p>
          )}
        </div>
      );
    });

    return elements;
  };

  // Teknoloji bölümü için özel render
  const renderTechnologyData = (obj: any): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    if (!obj) return elements;

    // Ana bilgiler (ilk satır)
    const mainFields = ['ekran_inch', 'dijital_gosterge_inch', 'gosterge_paneli', 'multimedia'];
    const mainLabels: Record<string, string> = {
      'ekran_inch': 'Ekran Inch',
      'dijital_gosterge_inch': 'Dijital Gösterge Inch',
      'gosterge_paneli': 'Gösterge Paneli',
      'multimedia': 'Multimedia'
    };

    // Kamera & Sensör grubu
    const cameraFields = ['kamera_sistemi', 'park_asistani'];
    const cameraLabels: Record<string, string> = {
      'kamera_sistemi': 'Kamera Sistemi',
      'park_asistani': 'Park Asistanı'
    };

    // Isıtma grubu (isitma objesi içinden)
    const heatingFields = ['klima', 'koltuk_isitma_on', 'koltuk_isitma_arka', 'direksiyon_isitma'];
    const heatingLabels: Record<string, string> = {
      'klima': 'Klima',
      'koltuk_isitma_on': 'Koltuk Isıtma Ön',
      'koltuk_isitma_arka': 'Koltuk Isıtma Arka',
      'direksiyon_isitma': 'Direksiyon Isıtma'
    };

    // Ana bilgiler satırı
    const mainElements: React.ReactElement[] = [];
    mainFields.forEach((key) => {
      const value = obj[key];
      if (value === undefined || value === null) return;
      mainElements.push(
        <div key={key} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">{mainLabels[key]}</p>
          <p className="text-lg font-black text-white">{value?.toString() || '-'}</p>
        </div>
      );
    });

    if (mainElements.length > 0) {
      elements.push(
        <div key="main-row" className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {mainElements}
        </div>
      );
    }

    // Kamera & Sensör grubu
    const cameraElements: React.ReactElement[] = [];
    cameraFields.forEach((key) => {
      const value = obj[key];
      if (value === undefined || value === null) return;
      cameraElements.push(
        <div key={key} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">{cameraLabels[key]}</p>
          <p className="text-lg font-black text-white">{value?.toString() || '-'}</p>
        </div>
      );
    });

    if (cameraElements.length > 0) {
      elements.push(
        <div key="camera-section" className="col-span-full mb-6">
          <p className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">Kamera & Sensör</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameraElements}
          </div>
        </div>
      );
    }

    // Isıtma grubu
    const heatingData = obj.isitma || {};
    const heatingElements: React.ReactElement[] = [];
    heatingFields.forEach((key) => {
      const value = heatingData[key];
      if (value === undefined || value === null) return;
      heatingElements.push(
        <div key={key} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">{heatingLabels[key]}</p>
          {typeof value === 'boolean' ? (
            <div className="flex items-center gap-2">
              {value ? <Check className="w-6 h-6 text-green-400" /> : <X className="w-6 h-6 text-red-400" />}
            </div>
          ) : (
            <p className="text-lg font-black text-white">{value?.toString() || '-'}</p>
          )}
        </div>
      );
    });

    if (heatingElements.length > 0) {
      elements.push(
        <div key="heating-section" className="col-span-full">
          <p className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">Isıtma</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {heatingElements}
          </div>
        </div>
      );
    }

    return elements;
  };

  // Genel render fonksiyonu (diğer bölümler için)
  const renderNestedData = (obj: any, parentKey: string = ''): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];
    if (!obj) return elements;

    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      const fullKey = parentKey ? `${parentKey}_${key}` : key;
      if (Array.isArray(value)) return;
      if (typeof value === 'object' && value !== null) {
        elements.push(...renderNestedData(value, fullKey));
        return;
      }
      
      const formattedKey = key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      elements.push(
        <div key={fullKey} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/5">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">{formattedKey}</p>
          {typeof value === 'boolean' ? (
            <div className="flex items-center gap-2">
              {value ? <Check className="w-6 h-6 text-green-400" /> : <X className="w-6 h-6 text-red-400" />}
            </div>
          ) : (
            <p className="text-lg font-black text-white">{value?.toString() || '-'}</p>
          )}
        </div>
      );
    });
    return elements;
  };

  // Bölüme göre doğru render fonksiyonunu seç
  const renderContent = () => {
    if (title === 'Güvenlik') {
      return renderSecurityData(data);
    } else if (title === 'Teknoloji') {
      return renderTechnologyData(data);
    } else {
      return renderNestedData(data);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }} className="mb-8 last:mb-0">
      <div className="group relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/10 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>{icon}</div>
          <h4 className="text-3xl font-black text-white">{title}</h4>
        </div>
        <div className={`relative z-10 ${title === 'Teknoloji' ? '' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'} mb-6`}>
          {renderContent()}
        </div>
        {/* Decorative elements */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-full`} />
        <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${color} opacity-5 rounded-tr-full`} />
      </div>
    </motion.div>
  );
}

// DÜZELTME: Ref kullanımını React kuralına uygun hale getirdik (useRef)
function AnimatedCounter({ value, className = "" }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null); // DÜZELTME BURADA

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const duration = 2000;
            const startTime = Date.now();
            const startValue = 0;
            const updateCounter = () => {
              const currentTime = Date.now();
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const current = Math.round(startValue + (value - startValue) * easeOutQuart);
              setDisplayValue(current);
              if (progress < 1) requestAnimationFrame(updateCounter);
            };
            requestAnimationFrame(updateCounter);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = spanRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [value, hasAnimated]);

  return <span ref={spanRef} className={className}>{displayValue}</span>;
}

function CompactScoreCard({ icon, title, score, delay, className = "" }: { icon: React.ReactNode; title: string; score: number; delay: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }} className={className}>
      <div className="group relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-xl p-5 border border-[#2db7f5]/20 hover:border-[#2db7f5]/40 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2db7f5]/0 to-[#0ea5d8]/0 group-hover:from-[#2db7f5]/5 group-hover:to-[#0ea5d8]/5 transition-all duration-300" />
        <div className="relative z-10 flex flex-col items-center text-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#2db7f5] to-[#0ea5d8] text-white">{icon}</div>
          <p className="text-sm font-semibold text-white/60">{title}</p>
          <div className="flex items-baseline gap-1">
            <AnimatedCounter value={score} className="text-3xl font-black text-white" />
            <span className="text-sm text-white/40 font-bold">/ 100</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}