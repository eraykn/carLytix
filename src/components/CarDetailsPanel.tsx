"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface CarDetailsPanelProps {
  general: Record<string, string>;
  safety: Record<string, boolean>;
}

export function CarDetailsPanel({ general, safety }: CarDetailsPanelProps) {
  const generalItems = [
    { label: "Motor Hacmi (litre)", value: general.motorHacmi },
    { label: "Motor Gücü (hp)", value: general.motorGucu },
    { label: "Tork (Nm)", value: general.tork },
    { label: "Hızlanma 0-100 km/h", value: general.hizlanma },
    { label: "Maksimum Hız (km/h)", value: general.maxHiz },
    { label: "Yakıt Tüketimi (avg)", value: general.yakit },
    { label: "Çekiş", value: general.cekis },
    { label: "Ağırlık (kg)", value: general.agirlik },
    { label: "Uzunluk (mm)", value: general.uzunluk },
    { label: "Genişlik (mm)", value: general.genislik },
    { label: "Bagaj Kapasitesi (litre)", value: general.bagaj },
    { label: "Pil Türü", value: general.pil },
    { label: "NEDC Km", value: general.NEDC },
    { label: "WLTP Km", value: general.WLTP },
    {
      label: "Ortalama Enerji Tüketimi (kWh/100km)",
      value: general.ortEnerji,
    },
    {
      label: "Ortalama Enerji Tüketimi WLTP (kWh/100km)",
      value: general.ortEnerjiWLTP,
    },
  ];

  const safetyItems = [
    { label: "ABS", value: safety.ABS },
    { label: "Geri Görüş Aynası", value: safety.GeriGorusAynasi },
    { label: "Lastik Basıncı Kontrolü", value: safety.LastikBasinci },
    { label: "Yokuş Desteği", value: safety.YukusDestegi },
    { label: "Çarpışma Uyarısı", value: safety.CarpismaUyarisi },
    { label: "Otomatik Dörtlü Flaşör", value: safety.DortluFlasor },
    { label: "Sürücü Hava Yastığı", value: safety.SurucuHavaYastigi },
    { label: "EBD", value: safety.EBD },
    { label: "Fren Yardım Sistemi", value: safety.FrenYardim },
    { label: "Isofix", value: safety.Isofix },
    { label: "Yolcu Hava Yastığı", value: safety.YolcuHavaYastigi },
    { label: "Merkezi Kilit", value: safety.MerkeziKilit },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full mt-8"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Genel Bakış</h2>
          <p className="text-sm text-gray-500 mt-1">
            Teknik özet ve performans bilgileri.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          {generalItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <span className="text-sm font-semibold text-gray-800">
                {item.label}
              </span>
              <span className="text-sm text-gray-600">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Güvenlik</h2>
          <p className="text-sm text-gray-500 mt-1">
            Standart güvenlik donanımlarının durumunu inceleyin.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {safetyItems.map((item) => {
            const Icon = item.value ? Check : X;
            return (
              <div
                key={item.label}
                className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors duration-200 hover:border-blue-400/50 hover:bg-blue-50"
              >
                <span className="text-sm font-medium text-gray-800">
                  {item.label}
                </span>
                <Icon
                  className={`h-5 w-5 ${
                    item.value ? "text-emerald-500" : "text-red-500"
                  } group-hover:scale-105 transition-transform`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}