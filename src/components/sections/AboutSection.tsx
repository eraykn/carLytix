"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Bolt, Globe, BarChart3, ArrowRight, Bot } from "lucide-react";

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function AboutSection() {
  const router = useRouter();
  
  const ref1 = useRef(null);
  const isInView1 = useInView(ref1, { once: true, margin: "-200px" });

  const ref2 = useRef(null);
  const isInView2 = useInView(ref2, { once: true, margin: "-200px" });

  const ref3 = useRef(null);
  const isInView3 = useInView(ref3, { once: true, margin: "-200px" });
  
  const [displayedText1, setDisplayedText1] = useState("");
  const fullText1 = "CarLytix, karmaşık araç verisini anlaşılır içgörülere dönüştüren akıllı bir analiz platformudur. Kullanım alışkanlıkları, performans verileri ve pazar dinamiklerini bir araya getirerek en doğru araç eşleşmesini sunar. Modern arayüzü, güçlü veri modeli ve yapay zeka destekli öneri motoru sayesinde karar alma sürecini hızlandırır; hem bireysel kullanıcılar hem de filolar için güvenilir ve şeffaf bir seçim deneyimi sağlar.";

  const [displayedText2, setDisplayedText2] = useState("");
  const fullText2 = "CarLytix, otomotiv verilerini analiz eden, karşılaştıran ve yapay zekâ ile anlamlandıran yeni nesil bir karar destek platformudur. Araç seçim sürecini sezgilere değil; doğrulanabilir verilere, objektif karşılaştırmalara ve akıllı algoritmalara dayandırır.";

  useEffect(() => {
    if (isInView1 && displayedText1.length < fullText1.length) {
      const timeout = setTimeout(() => {
        setDisplayedText1(fullText1.slice(0, displayedText1.length + 1));
      }, 8); // Her 8ms'de bir karakter ekle (daha hızlı)

      return () => clearTimeout(timeout);
    }
  }, [isInView1, displayedText1, fullText1]);

  useEffect(() => {
    if (isInView2 && displayedText2.length < fullText2.length) {
      const timeout = setTimeout(() => {
        setDisplayedText2(fullText2.slice(0, displayedText2.length + 1));
      }, 12);

      return () => clearTimeout(timeout);
    }
  }, [isInView2, displayedText2, fullText2]);

  const features = [
    {
      icon: <Bolt className="w-5 h-5 text-[#3b82f6]" />,
      title: "Anında Karşılaştırma",
      description: "Modelleri yan yana getir, hızdan torka, yakıttan dayanıklılığa kadar tüm detayları gör."
    },
    {
      icon: <Globe className="w-5 h-5 text-[#06b6d4]" />,
      title: "Her Zeminde Doğru Tercih",
      description: "Şehir trafiği, dağ yolları ya da otoban… Hangi aracın gerçekten fark yarattığını öğren."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#8b5cf6]" />,
      title: "Veri Odaklı Güç",
      description: "Tahmin değil, analiz. Sezgiler değil, istatistikler. CarLytix ile otomobil seçmek artık bir şans oyunu değil."
    },
    {
      icon: <Bot className="w-5 h-5 text-[#22c55e]" />,
      title: "CarLytix AI Asistanı",
      description: "AI asistan, verileri sizin için analiz eder ve en doğru aracı saniyeler içinde öne çıkarır."
    }
  ];

  const FeatureItem = ({ icon, title, children }: FeatureItemProps) => (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">{icon}</div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-[#94a3b8] mt-1">{children}</p>
      </div>
    </div>
  );

  return (
    <section 
      id="about"
      className="relative w-full min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex items-center justify-center py-20 px-10"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      <div className="max-w-7xl w-full flex flex-col gap-48 relative z-10">
        {/* Bölüm 1: Neden CarLytix? */}
        <div ref={ref1} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Sol - Typewriter Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold"
            >
              <span className="bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">
                Neden{" "}
              </span>
              <span className="bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent font-bold">
                CarLytix
              </span>
              <span className="bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">
                ?
              </span>
            </motion.h2>
            
            <div className="relative min-h-[240px]">
              <p className="text-lg text-[#cbd5e1] leading-relaxed font-light">
                {displayedText1}
                {displayedText1.length < fullText1.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-6 bg-[#3b82f6] ml-1"
                  />
                )}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView1 && displayedText1.length === fullText1.length ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex gap-4 pt-6"
            >
              <button 
                onClick={() => {
                  window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer"
              >
                Keşfet
              </button>
              <button 
                onClick={() => router.push('/aboutus')}
                className="px-8 py-3 rounded-xl border-2 border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300 cursor-pointer"
              >
                Daha Fazla
              </button>
            </motion.div>
          </motion.div>

          {/* Sağ - Araba Görseli */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1080&auto=format&fit=crop"
                alt="Porsche 911 GT3 RS"
                className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b82f6]/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Bölüm 2: Size ne sunuyoruz? */}
        <div ref={ref2} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Sol - Araba Görseli */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:sticky lg:top-32"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 p-6 lg:p-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1080&auto=format&fit=crop"
                alt="BMW M4 Comp"
                className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b82f6]/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Sağ - Özellikler */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent"
            >
              Size ne sunuyoruz?
            </motion.h2>
            
            <div className="relative min-h-[100px]">
              <p className="text-base lg:text-lg text-[#cbd5e1] leading-relaxed font-light">
                {displayedText2}
                {displayedText2.length < fullText2.length && (
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-0.5 h-5 bg-[#06b6d4] ml-1" />
                )}
              </p>
            </div>
            
            <motion.div 
              className="space-y-4 pt-2"
              initial={{ opacity: 0 }}
              animate={displayedText2.length === fullText2.length ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={displayedText2.length === fullText2.length ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                >
                  <FeatureItem icon={feature.icon} title={feature.title}>
                    {feature.description}
                  </FeatureItem>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 pt-6" 
              initial={{ opacity: 0 }} 
              animate={displayedText2.length === fullText2.length ? { opacity: 1 } : {}} 
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              <div className="flex items-center gap-2 text-[#64748b] font-medium">
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm">Kararı siz verirsiniz; biz verileri sunarız.</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bölüm 3: Call to Action */}
        <motion.div
          ref={ref3}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden bg-black/20 backdrop-blur-2xl border border-white/10 p-16 text-center flex flex-col items-center gap-8"
        >
          {/* Arka plan parlama efekti */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-24 w-[calc(100%+12rem)] h-[calc(100%+12rem)] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.3),transparent_60%)] pointer-events-none"
          />

          {/* Logo */}
          <motion.img
            src="/images/brands/carlytix-concept-a-logo.svg"
            alt="CarLytix Logo"
            className="w-64 h-auto drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView3 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* Metin */}
          <motion.p
            className="max-w-xl text-xl text-slate-300 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Veriyle konuş, doğru seçimi yap. CarLytix ile otomobil dünyasının geleceğini keşfet.
          </motion.p>

          {/* Buton */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView3 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => {
              window.location.href = '/ai';
            }}
          >
            Hemen Deneyin
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
