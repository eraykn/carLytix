import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// --- YENİ YARDIMCI FONKSİYONLAR (Type-Safe) ---

// Sadece Tam Sayı (Int) döndürür veya null
const asInt = (val: any): number | null => {
  if (val === undefined || val === null || val === '-' || val === '') return null;
  const num = parseInt(val);
  return isNaN(num) ? null : num;
}

// Sadece Ondalıklı Sayı (Float) döndürür veya null
const asFloat = (val: any): number | null => {
  if (val === undefined || val === null || val === '-' || val === '') return null;
  // Virgül varsa noktaya çevir (bazı JSON'larda 5,4 gelebilir)
  const cleanVal = String(val).replace(',', '.');
  const num = parseFloat(cleanVal);
  return isNaN(num) ? null : num;
}

// Sadece Yazı (String) döndürür veya null
const asString = (val: any): string | null => {
  if (val === undefined || val === null || val === '-' || val === '') return null;
  return String(val);
}

async function main() {
  console.log('🚀 Veri aktarımı başlıyor...')

  const jsonPath = path.join(process.cwd(), 'cars.json'); 
  
  try {
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const carsData = JSON.parse(rawData);

    console.log(`📦 Toplam ${carsData.length} araç bulundu. Veritabanına işleniyor...`);

    for (const item of carsData) {
      const details = item.details || {};
      const donanim = item.donanim?.guvenlik || [];

      await prisma.car.create({
        data: {
          originalId: item.id,
          modelName: item.model,
          year: item.year,
          imageUrl: item.photo,
          
          brand: {
            connectOrCreate: {
              where: { name: item.brand },
              create: { name: item.brand }
            }
          },

          specs: {
            create: {
              // Artık her alan için özel fonksiyon kullanıyoruz:
              engineVolume: asFloat(details.motor_hacmi_l),
              horsepower: asInt(details.guc_hp),
              torque: asInt(details.tork_Nm),
              acceleration: asFloat(details['0_100_kmh_s']),
              topSpeed: asInt(details.maksimum_hiz_kmh),
              fuelConsumption: asFloat(details.yakit_tuketimi_avg_l_per_100km),
              driveTrain: asString(details.cekis),
              
              weight: asInt(details.agirlik_kg),
              length: asInt(details.uzunluk_mm),
              width: asInt(details.genislik_mm),
              luggageCapacity: asInt(details.bagaj_kapasitesi_l),
              
              batteryType: asString(details.pil_turu),
              electricRange: asInt(details.elektrikli_menzil_WLTP_km) || asInt(details.elektrik_araligi_NEDC_km),
              chargingTime: asString(details.sarj_suresi_h)
            }
          },

          features: {
            create: donanim.map((feature: any) => ({
              name: feature.isim,
              isAvailable: feature.mevcut
            }))
          }
        }
      })
    }
    console.log(`✅ Tüm işlemler hatasız tamamlandı!`);
  
  } catch (error) {
    console.error("❌ Bir hata oluştu:", error);
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })