import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Frontend -> Veritabanı değer eşleştirmesi
const fuelTypeMapping: Record<string, string> = {
  "Elektrikli": "Elektrik",
  "Benzin": "Benzin",
  "Dizel": "Dizel",
  "Hibrit": "Hibrit",
};

export async function POST(request: Request) {
  try {
    // 1. Frontend'den gelen seçimleri al
    const body = await request.json();
    const { 
      budget,      // Örn: 2000000
      bodyType,    // Örn: "SUV" (veya "Hepsi")
      fuelType,    // Örn: "Elektrikli" (veya "Hepsi")
      usageTags,   // Örn: ["Şehir içi", "Aile Odaklı"]
      priorityTags // Örn: ["Güvenlik", "Düşük tüketim"]
    } = body;

    // Fuel type'ı veritabanı değerine dönüştür
    const dbFuelType = fuelType && fuelType !== "Hepsi" 
      ? fuelTypeMapping[fuelType] || fuelType 
      : null;

    // Tüm etiketleri tek havuzda topla
    const allSearchTags = [...(usageTags || []), ...(priorityTags || [])];

    // 2. Veritabanı Sorgusu (Hard Filters)
    // Önce kesin kriterlere uyan adayları havuza alıyoruz
    const candidates = await prisma.assistantCar.findMany({
      where: {
        price: {
          lte: budget || 99000000 // Bütçe yoksa çok yüksek bir sayı al
        },
        // Body type için "contains" kullan (veritabanında "Hatchback (3/5 kapı)" gibi değerler olabilir)
        ...(bodyType && bodyType !== "Hepsi" ? { 
          body: { 
            contains: bodyType,
            mode: 'insensitive' as const
          } 
        } : {}),
        // Fuel type için "contains" kullan (veritabanında "Benzin (MHEV eTSI)" gibi değerler olabilir)
        ...(dbFuelType ? { 
          fuel: { 
            startsWith: dbFuelType,
            mode: 'insensitive' as const
          } 
        } : {}),
      }
    });

    // 3. Akıllı Sıralama Algoritması (In-Memory Ranking)
    // Adayları etiket eşleşmesine göre puanlayıp sıralayacağız.
    const rankedCars = candidates.map(car => {
      let matchScore = 0;

      // A. Etiket Uyumu Puanı
      // Arabanın etiketleri içinde, kullanıcının aradığı etiketlerden kaç tane var?
      const carTags = car.tags || [];
      allSearchTags.forEach(searchTag => {
        if (carTags.includes(searchTag)) {
          matchScore += 10; // Her eşleşen etiket için 10 puan
        }
      });

      // B. Genel Araç Puanı Desteği (Tie-Breaker)
      // Etiket puanları eşitse, genel puanı (scoreTotal) yüksek olan öne geçsin.
      // Etkisi az olsun diye 0.1 ile çarpıyoruz.
      matchScore += (car.scoreTotal || 0) * 0.1;

      return { ...car, matchScore };
    });

    // 4. En yüksek puanlıdan en düşüğe sırala
    rankedCars.sort((a, b) => b.matchScore - a.matchScore);

    // 5. İlk 3 öneriyi (veya hepsini) döndür
    return NextResponse.json(rankedCars);

  } catch (error) {
    console.error("Assistant API Error:", error);
    return NextResponse.json({ error: "Öneri motoru çalışırken hata oluştu." }, { status: 500 });
  }
}