import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🤖 Assistant verileri yükleniyor...')

  // 1. JSON dosyasını oku
  const jsonPath = path.join(process.cwd(), 'assistant.json'); 
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const jsonData = JSON.parse(rawData);
  
  // Dizi mi tek obje mi kontrol et
  const carsData = Array.isArray(jsonData) ? jsonData : [jsonData];

  console.log(`📦 ${carsData.length} araç işleniyor...`);

  for (const item of carsData) {
    const score = item.score || {};
    const criteria = score.kriterler || {};
    const media = item.media || {};

    // 2. AssistantCar tablosuna kaydet
    await prisma.assistantCar.upsert({
      where: { originalId: item.id },
      update: {}, // Varsa dokunma
      create: {
        originalId: item.id,
        brand: item.brand,
        model: item.model,
        trim: item.trim,
        year: item.year,
        body: item.body,
        fuel: item.fuel,
        drivetrain: item.drivetrain,
        transmission: item.transmission,
        price: item.priceTRY,
        
        // Etiketler
        tags: item.tags || [],

        // Görseller
        imageMain: media.image_main,
        imageInterior: media.image_interior,
        brandLogo: media.brand_logo,

        // Puanlar
        scoreTotal: score.toplam,
        scoreEconomy: criteria.ekonomi,
        scoreComfort: criteria.konfor,
        scoreSafety: criteria.guvenlik,
        scorePerformance: criteria.performans,
        scoreTechnology: criteria.teknoloji,

        // Neden Metinleri
        whyText: item.why,
        whyBullets: item.why_bullets || [],

        // Teknik Detaylar (JSON olarak sakla)
        specs: item.specs || {}
      }
    });
    console.log(`✅ Eklendi: ${item.brand} ${item.model}`);
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })