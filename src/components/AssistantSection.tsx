"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Route,
  Building2,
  MountainSnow,
  Car,
  CarFront,
  Package,
  Battery,
  Fuel,
  PlugZap,
  Wallet,
  Coins,
  MessageCircle,
  Target,
  DollarSign
} from "lucide-react";
import { Footer } from "./Footer";

// Minimal toast types
type Toast = {
  id: string;
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
};

export function AssistantSection() {
  const [currentPath, setCurrentPath] = useState("");
  const [selectedStep, setSelectedStep] = useState<Record<string, string[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (t: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    setToasts(prev => [...prev, { id, ...t }]);
    return id;
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const formatBudget = (value: string) => {
    const num = parseInt(value.replace(/\./g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('tr-TR');
  };

  const categories = [
    {
      id: "usage",
      label: "Arazi/Kullanım",
      options: ["Şehir içi", "Uzun yol", "Karma", "Off-road/hafif arazi", "Kış şartları", "Aile odaklı" , "Sport"],
      minSelect: 1,
      maxSelect: 2
    },
    {
      id: "body",
      label: "Gövde Tipi",
      options: ["SUV", "Sedan", "Hatchback", "Crossover", "Station"],
      minSelect: 1,
      maxSelect: 1
    },
    {
      id: "fuel",
      label: "Yakıt/Enerji",
      options: ["Elektrikli", "Benzin", "Dizel", "Hibrit"],
      minSelect: 1,
      maxSelect: 2
    },
    {
      id: "priorities",
      label: "Öncelikler",
      options: ["Güvenlik", "Düşük tüketim", "Performans", "Konfor", "Teknoloji/ADASC", "Uygun bakım"],
      minSelect: 1,
      maxSelect: 5
    }
  ];

  // Mesaj sözlüğü - kategori ve seçenek bazlı
  const messageDictionary: Record<string, Record<string, { added: string; removed: string }>> = {
    usage: {
      "Şehir içi": {
        added: "Tamam. Şehir içi önceliklendirildi; ekonomi,yakıt tüketimi ve park kolaylığını öne çıkarıyorum.",
        removed: "Şehir içi kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Uzun yol": {
        added: "Tamam. Uzun yol eklendi; menzil ve konforu öne çıkarıyorum.",
        removed: "Uzun yol kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Karma": {
        added: "Anladım. Karma kullanım seçildi; denge ve esnekliği öne çıkarıyorum.",
        removed: "Karma kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Off-road/hafif arazi": {
        added: "Not aldım. Hafif arazi eklendi; yerden yükseklik ve çekişi öne çıkarıyorum.",
        removed: "Off-road/hafif arazi kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Kış şartları": {
        added: "Tamam. Kış şartları işaretlendi; güvenlik ve çekişi öne çıkarıyorum.",
        removed: "Kış şartları kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Aile odaklı": {
        added: "Harika. Aile odaklı eklendi; iç hacim ve güvenliği öne çıkarıyorum.",
        removed: "Aile odaklı kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Sport": {
        added: "Harika. Performans, Hız ve Duruşu ön plana çıkarıyorum.",
        removed: "Sport kaldırıldı; ilgili ağırlıkları geri çektim."
      }
    },
    body: {
      "SUV": {
        added: "SUV seçildi; ferahlık ve yüksek sürüşü öne çıkarıyorum.",
        removed: "SUV kaldırıldı; kalan ile devam ediyorum."
      },
      "Sedan": {
        added: "Sedan seçildi; sessizlik ve yol tutuşu öne çıkarıyorum.",
        removed: "Sedan kaldırıldı; kalan ile devam ediyorum."
      },
      "Hatchback": {
        added: "Hatchback seçildi; manevra ve park kolaylığını öne çıkarıyorum.",
        removed: "Hatchback kaldırıldı; kalan ile devam ediyorum."
      },
      "Crossover": {
        added: "Crossover seçildi; çok yönlülüğü öne çıkarıyorum.",
        removed: "Crossover kaldırıldı; kalan ile devam ediyorum."
      },
      "Station": {
        added: "Station seçildi; bagaj hacmini öne çıkarıyorum.",
        removed: "Station kaldırıldı; kalan ile devam ediyorum."
      }
    },
    fuel: {
      "Elektrikli": {
        added: "Elektrikli önceliklendirildi; menzil ve şarj altyapısını dikkate alıyorum.",
        removed: "Elektrikli kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Benzin": {
        added: "Benzin seçildi; rafinelik ve sessizliği öne çıkarıyorum.",
        removed: "Benzin kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Dizel": {
        added: "Dizel seçildi; uzun yol verimliliğini öne çıkarıyorum.",
        removed: "Dizel kaldırıldı; ilgili ağırlıkları geri çektim."
      },
      "Hibrit": {
        added: "Hibrit seçildi; şehir içi tüketimi düşürmeye odaklanıyorum.",
        removed: "Hibrit kaldırıldı; ilgili ağırlıkları geri çektim."
      }
    },
    priorities: {
      "Güvenlik": {
        added: "Güvenlik eklendi; NCAP/ADAS puanlarını daha baskın değerlendiriyorum.",
        removed: "Güvenlik kaldırıldı; ilgili etkiyi düşürdüm."
      },
      "Düşük tüketim": {
        added: "Düşük tüketim eklendi; ekonomi ve verimliliği öne çıkarıyorum.",
        removed: "Düşük tüketim kaldırıldı; ilgili etkiyi düşürdüm."
      },
      "Performans": {
        added: "Performans eklendi; hızlanma ve güç değerlerini öne çıkarıyorum.",
        removed: "Performans kaldırıldı; ilgili etkiyi düşürdüm."
      },
      "Konfor": {
        added: "Konfor eklendi; süspansiyon, teknoloji ve kabin sessizliğini öne çıkarıyorum.",
        removed: "Konfor kaldırıldı; ilgili etkiyi düşürdüm."
      },
      "Teknoloji/ADASC": {
        added: "Teknoloji/ADAS eklendi; sürüş desteklerini daha çok tartıyorum.",
        removed: "Teknoloji/ADAS kaldırıldı; ilgili etkiyi düşürdüm."
      },
      "Uygun bakım": {
        added: "Uygun bakım eklendi; işletim/muayene maliyetlerine ağırlık veriyorum.",
        removed: "Uygun bakım kaldırıldı; ilgili etkiyi düşürdüm."
      }
    }
  };

  const handleStepClick = (categoryId: string, option: string) => {
    const previousSelections = selectedStep[categoryId] || [];
    const wasPreviouslySelected = previousSelections.includes(option);
    
    setSelectedStep(prev => {
      const currentSelections = prev[categoryId] || [];
      const isSelected = currentSelections.includes(option);
      
      let newSelections;
      if (isSelected) {
        // Seçili ise kaldır
        newSelections = currentSelections.filter(item => item !== option);
      } else {
        // Seçili değilse, max limit kontrolü
        const category = categories.find(cat => cat.id === categoryId);
        if (category && currentSelections.length >= category.maxSelect) {
          // Max limite ulaştı, en eski seçimi kaldır ve yeni ekle
          newSelections = [...currentSelections.slice(1), option];
        } else {
          // Normal ekleme
          newSelections = [...currentSelections, option];
        }
      }
      
      return {
        ...prev,
        [categoryId]: newSelections
      };
    });

    // Chat mesajını güncelle
    setIsTyping(true);
    setTypedMessage("");

    setTimeout(() => {
      setSelectedStep(curr => {
        const currentSelections = curr[categoryId] || [];
        const isNowSelected = currentSelections.includes(option);
        const category = categories.find(cat => cat.id === categoryId);
        
        let message = "";
        
        if (categoryId === "usage" && messageDictionary.usage[option]) {
          // Özel mesaj sözlüğü kullan
          message = isNowSelected ? messageDictionary.usage[option].added : messageDictionary.usage[option].removed;
        } else if (categoryId === "body" && messageDictionary.body[option]) {
          // Body için özel mesajlar
          if (isNowSelected) {
            if (previousSelections.length > 0 && previousSelections[0] !== option) {
              // Değişim
              message = `Tercih güncellendi: ${previousSelections[0]} → ${option}. ${messageDictionary.body[option].added.split(';')[1]}`;
            } else {
              // İlk seçim
              message = messageDictionary.body[option].added;
            }
          } else {
            // Kaldırma
            message = messageDictionary.body[option].removed.replace('{kalan}', currentSelections.join(' ve ') || 'hiçbiri');
          }
        } else if (categoryId === "fuel" && messageDictionary.fuel[option]) {
          // Fuel için özel mesajlar
          if (isNowSelected) {
            if (currentSelections.length > 1) {
              // Çoklu seçim
              message = `Yakıt: ${currentSelections.join(' + ')}. Alternatifleri buna göre genişletiyorum.`;
            } else {
              // Tek seçim
              message = messageDictionary.fuel[option].added;
            }
          } else {
            // Kaldırma
            message = messageDictionary.fuel[option].removed;
          }
        } else if (categoryId === "priorities" && messageDictionary.priorities[option]) {
          // Priorities için özel mesajlar
          message = isNowSelected ? messageDictionary.priorities[option].added : messageDictionary.priorities[option].removed;
        } else {
          // Genel mesajlar
          if (isNowSelected) {
            message = `${option} seçildi.`;
          } else {
            message = `${option} seçimi kaldırıldı.`;
          }
        }
        
        // Limit uyarısı ekleme (usage, fuel ve priorities için)
        if ((categoryId === "usage" || categoryId === "fuel" || categoryId === "priorities") && isNowSelected && category && currentSelections.length >= category.maxSelect) {
          const maxText = categoryId === "usage" ? "2" : categoryId === "fuel" ? "2" : "5";
          const typeText = categoryId === "usage" ? "kullanım" : categoryId === "fuel" ? "yakıt türü" : "öncelik";
          message += ` En fazla ${maxText} ${typeText} seçebilirsin; fazlası öneriyi seyreltiyor.`;
        }

        // Yazma efektini başlat
        // let index = 0;
        // const typeWriter = () => {
        //   if (index < message.length) {
        //     setTypedMessage(message.slice(0, index + 1));
        //     index++;
        //     setTimeout(typeWriter, 50);
        //   } else {
        //     setIsTyping(false);
        //   }
        // };
        // typeWriter();

        // Hızlı mesaj gösterimi
        setTypedMessage("...");
        setTimeout(() => {
          setTypedMessage(message);
          setIsTyping(false);
        }, 300);
        
        return curr;
      });
    }, 800);
  };

  return (
    <>
      <section
        id="assistant"
        className="relative w-full min-h-screen bg-gradient-to-b from-[#0E1726] to-[#0B1320] flex flex-col items-center justify-center py-32 px-10 overflow-hidden"
      >
        {/* Arka Plan Efektleri */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.02]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3CC6F0]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5BE7D1]/5 rounded-full blur-3xl" />
        </div>

        {/* Top Center Logo - Glassmorphism (küçültülmüş) */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <img
              src="/carlytix-concept-a-logo.svg"
              alt="CarLytix Logo"
              className="h-[36px] w-auto drop-shadow-[0_0_10px_rgba(60,198,240,0.4)] ml-2"
            />
          </div>
        </motion.div>

        {/* Top Right Navigation - Glassmorphism */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-8 right-10 z-20 hidden md:flex items-center gap-8 px-6 py-3 rounded-xl bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12]"
        >{[
            { name: "Anasayfa", href: "/" },
            { name: "Karşılaştır", href: "/compare" },
            { name: "Asistan", href: "/assistant" },
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`text-sm transition-colors duration-300 relative group ${
                currentPath === item.href
                  ? "text-[#3CC6F0]"
                  : "text-[#d1d5db] hover:text-[#3CC6F0]"
              }`}
            >
              {item.name}
              <span className={`absolute bottom-[-8px] left-0 h-0.5 bg-[#3CC6F0] transition-all duration-300 ${
                currentPath === item.href
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`} />
            </motion.a>
          ))}
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            href="#"
            className="text-xs text-[#94a3b8] hover:text-[#3CC6F0] transition-colors duration-300"
          >
            Geri Bildirim
          </motion.a>
        </motion.nav>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 right-10 z-20 md:hidden p-2 rounded-lg bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] hover:bg-white/[0.18] transition-colors"
        >
          <Menu className="w-6 h-6 text-[#e2e8f0]" />
        </motion.button>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-12 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.05] tracking-[-0.01em]">
              Seçimlerini tıkla, nokta atışı öneri al.
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-[1.5] font-normal">
              Yazmadan seçim yap; kullanım, gövde, yakıt ve bütçeye göre akıllı öneriler.
            </p>
          </motion.div>

          {/* Kategoriler ve Seçenekler */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full max-w-4xl space-y-8"
          >
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + categoryIndex * 0.1 }}
                className="space-y-4"
              >
                {/* Kategori Başlığı */}
                <h3 className="text-xl font-semibold text-white/90 text-center flex items-center justify-center gap-2">
                  {category.id === "usage" && <Route className="w-5 h-5 text-[#3CC6F0]" />}
                  {category.id === "body" && <Car className="w-5 h-5 text-[#3CC6F0]" />}
                  {category.id === "fuel" && <Fuel className="w-5 h-5 text-[#3CC6F0]" />}
                  {category.id === "priorities" && <Target className="w-5 h-5 text-[#3CC6F0]" />}
                  {category.label}
                </h3>

                {/* Alt Seçenekler */}
                <div className="flex flex-wrap justify-center gap-3">
                  {category.options.map((option, optionIndex) => (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + categoryIndex * 0.1 + optionIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStepClick(category.id, option)}
                      className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm ${
                        selectedStep[category.id]?.includes(option)
                          ? "bg-[#3CC6F0]/20 border-[#3CC6F0]/50 text-[#3CC6F0] shadow-lg shadow-[#3CC6F0]/20"
                          : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bütçe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + categories.length * 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white/90 text-center flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5 text-[#3CC6F0]" />
              Bütçe
            </h3>
            <div className="flex justify-center">
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(formatBudget(e.target.value))}
                placeholder="Bütçenizi girin"
                className="px-4 py-2 rounded-full border border-white/20 text-white/80 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:border-white/30 transition-all duration-300 text-sm text-center"
              />
            </div>
          </motion.div>

          {/* Kalıcı Sohbet Kutusu */}
          <AnimatePresence>
            {Object.keys(selectedStep).length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full max-w-md"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg p-4 min-h-[120px] flex flex-col">
                  {/* Sohbet Başlığı */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#3CC6F0]/20 flex items-center justify-center">
                      <MessageCircle className="w-3 h-3 text-[#3CC6F0]" />
                    </div>
                    <span className="text-xs text-white/70 font-medium">CarLytix Asistan</span>
                  </div>

                  {/* Mesaj Alanı */}
                  <div className="flex-1 flex items-end">
                    {selectedStep ? (
                      <AnimatePresence mode="wait">
                        {isTyping ? (
                          <motion.div
                            key="typing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-1"
                          >
                            <motion.div
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="w-2 h-2 bg-[#3CC6F0] rounded-full"
                            />
                            <motion.div
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-[#3CC6F0] rounded-full"
                            />
                            <motion.div
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-[#3CC6F0] rounded-full"
                            />
                          </motion.div>
                        ) : (
                          <motion.p
                            key="message"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-white/90 text-sm leading-relaxed"
                          >
                            {typedMessage}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    ) : (
                      <p className="text-white/50 text-sm italic">
                        Seçimlerinizi yaparak öneri alın...
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Araçımı bul butonu - chat ile birlikte görünür */}
          <AnimatePresence>
            {Object.keys(selectedStep).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="w-full max-w-md flex justify-center mt-4"
              >
                <motion.button
                  onClick={() => {
                    // Validation: ensure each required category has at least 1 selection
                    const missing: string[] = [];
                    ['usage','body','fuel','priorities'].forEach(catId => {
                      if (!(selectedStep[catId] && selectedStep[catId].length > 0)) missing.push(catId);
                    });
                    if (missing.length > 0) {
                      // show toast for each missing category
                      const title = 'Lütfen seçimlerinizi eksiksiz yapın';
                      const msg = missing.map(m => {
                        if (m === 'usage') return 'Arazi/Kullanım';
                        if (m === 'body') return 'Gövde Tipi';
                        if (m === 'fuel') return 'Yakıt/Enerji';
                        if (m === 'priorities') return 'Öncelikler';
                        return m;
                      }).join(', ') + ' kategorisinde seçim yapmadınız.';
                      pushToast({ title, message: msg, type: 'warning', duration: 3000 });
                      return;
                    }

                    // budget check
                    const numericBudget = parseInt(budget.replace(/\./g, '')) || 0;
                    if (numericBudget > 0 && numericBudget < 500000) {
                      pushToast({ title: 'Bütçe uyarısı', message: 'Bütçeniz 500.000 TL altında. Lütfen gözden geçirin.', type: 'warning', duration: 3000 });
                      return;
                    }

                    // If all good
                    pushToast({ title: 'Başarılı', message: 'Seçimlere göre araç önerisi hazırlanıyor.', type: 'success', duration: 3000 });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
                >
                  Araçımı bul
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Güven Göstergeleri */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="relative z-10 mt-1 flex flex-wrap justify-center gap-8 text-white/70"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#3CC6F0]" />
              <span className="text-sm">Güncel veriler (Ekim 2025)</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#3CC6F0]" />
              <span className="text-sm">Açıklanabilir öneri</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#3CC6F0]" />
              <span className="text-sm">Hızlı (≤ 30 sn)</span>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Toast container - sol-alt */}
      <div className="fixed left-4 bottom-6 z-50 flex flex-col-reverse gap-2 items-start">
        {toasts.map((t, idx) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
      <Footer />
    </>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { id, title, message, type = 'info', duration = 3000 } = toast;
  const [progress, setProgress] = useState(100);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let start = Date.now();
    let raf: number | null = null;
    const tick = () => {
      if (hover) { raf = requestAnimationFrame(tick); return; }
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct <= 0) {
        onClose();
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [duration, hover]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-[320px] max-w-[360px] min-w-[280px] bg-white/6 backdrop-blur rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)] overflow-hidden"
      style={{ padding: 12 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white">{title}</div>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-white/80 hover:opacity-100">
              ×
            </button>
          </div>
          {message && <div className="text-xs text-white/80 mt-1 line-clamp-2">{message}</div>}
        </div>
      </div>
      <div className="w-full h-1 bg-white/12 mt-3 relative" style={{ height: 3 }}>
        <div className="absolute left-0 top-0 h-full bg-[#3CC6F0]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}