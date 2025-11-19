import assistantData from '@/lib/data/assistant.json';
import { normalizeCarData, normalizeCarTags, suggestTagsFromCarData } from '@/lib/utils/tagMapping';

// Bütçe tanımları (TRY)
export const BUDGET_RANGES = {
  A: { min: 500000, max: 1000000 },
  B: { min: 1000000, max: 1250000 },
  C: { min: 1250000, max: 1500000 },
  D: { min: 1500000, max: 2000000 },
  E: { min: 2000000, max: 5000000 },
} as const;

export type BudgetCategory = keyof typeof BUDGET_RANGES;

/**
 * Kullanıcının girdiği bütçeyi en yakın bütçe kategorisine yuvarlar
 * @param userBudget - Kullanıcının girdiği bütçe (TRY)
 * @returns Bütçe aralığı {min, max}
 */
export function roundBudgetToRange(userBudget: number): { min: number; max: number } {
  // Bütçe kategorilerini kontrol et
  for (const [category, range] of Object.entries(BUDGET_RANGES)) {
    if (userBudget <= range.max) {
      return range;
    }
  }
  
  // Eğer E kategorisinin üstündeyse, E kategorisini döndür
  return BUDGET_RANGES.E;
}

export interface CarFilterCriteria {
  budget?: number;           // Kullanıcının bütçesi (TRY)
  body?: string;            // Gövde tipi (örn: "SUV", "Sedan")
  fuel?: string;            // Yakıt/enerji tipi (örn: "Elektrik", "Hibrit")
  usage?: string[];         // Arazi/kullanım (örn: ["Şehir içi", "Uzun yol"])
  priorities?: string[];    // Öncelikler (örn: ["Güvenlik", "Düşük tüketim"])
}

export interface FilteredCar {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  body: string;
  fuel: string;
  priceTRY: number;
  tags: string[];
  matchScore?: number;      // Eşleşme skoru (opsiyonel)
}

/**
 * Verilen kriterlere göre araçları filtreler
 * @param criteria - Filtreleme kriterleri
 * @returns Filtrelenmiş araç listesi
 */
export function filterCars(criteria: CarFilterCriteria): FilteredCar[] {
  // Önce tüm araçların tag'lerini normalize et
  let allCars = (assistantData as any[]).map(car => {
    const normalizedCar = normalizeCarData(car);
    // Eğer tag yoksa, araç özelliklerinden otomatik tag öner
    if (!normalizedCar.tags || normalizedCar.tags.length === 0) {
      normalizedCar.tags = suggestTagsFromCarData(car);
    }
    return normalizedCar;
  });

  // Her araç için eşleşme skoru hesapla
  const carsWithScores = allCars.map(car => {
    let score = 0;
    let matchDetails = {
      budget: false,
      body: false,
      fuel: false,
      tags: 0
    };

    // 1. Bütçe kontrolü (Öncelik: Yüksek)
    if (criteria.budget !== undefined) {
      const budgetRange = roundBudgetToRange(criteria.budget);
      const inRange = car.priceTRY >= budgetRange.min && car.priceTRY <= budgetRange.max;
      
      if (inRange) {
        score += 100; // Tam eşleşme
        matchDetails.budget = true;
      } else {
        // Bütçe dışı ama yakınsa kısmi puan ver
        const maxDeviation = budgetRange.max * 0.2; // %20 tolerans
        const deviation = Math.abs(car.priceTRY - budgetRange.max);
        
        if (deviation <= maxDeviation) {
          score += 50; // Yakın eşleşme
          matchDetails.budget = true;
        }
      }
    }

    // 2. Gövde tipi kontrolü (Öncelik: Orta)
    if (criteria.body) {
      if (car.body?.toLowerCase() === criteria.body?.toLowerCase()) {
        score += 80; // Tam eşleşme
        matchDetails.body = true;
      } else {
        // Benzer gövde tipleri için kısmi puan
        const similarBodies: Record<string, string[]> = {
          'suv': ['crossover'],
          'crossover': ['suv'],
          'sedan': ['hatchback', 'station'],
          'hatchback': ['sedan'],
          'station': ['sedan']
        };
        
        const similar = similarBodies[criteria.body.toLowerCase()] || [];
        if (similar.includes(car.body?.toLowerCase())) {
          score += 40;
          matchDetails.body = true;
        }
      }
    }

    // 3. Yakıt tipi kontrolü (Öncelik: Orta)
    if (criteria.fuel) {
      const userFuel = criteria.fuel?.toLowerCase();
      const carFuel = car.fuel?.toLowerCase();
      
      const normalizedUserFuel = userFuel === 'elektrikli' ? 'elektrik' : userFuel;
      const normalizedCarFuel = carFuel === 'elektrikli' ? 'elektrik' : carFuel;
      
      if (normalizedCarFuel === normalizedUserFuel) {
        score += 80; // Tam eşleşme
        matchDetails.fuel = true;
      } else if (
        (normalizedUserFuel === 'elektrik' && normalizedCarFuel === 'hibrit') ||
        (normalizedUserFuel === 'hibrit' && normalizedCarFuel === 'elektrik')
      ) {
        score += 40; // Benzer yakıt tipleri
        matchDetails.fuel = true;
      }
    }

    // 4. Tag eşleşmeleri (Öncelik: Değişken)
    const allTags = [...(criteria.usage || []), ...(criteria.priorities || [])];
    
    if (allTags.length > 0 && car.tags && Array.isArray(car.tags)) {
      const normalizedCarTags = car.tags.map((t: string) => t.toLowerCase());
      
      // Her eşleşen tag için puan
      allTags.forEach(tag => {
        if (normalizedCarTags.includes(tag.toLowerCase())) {
          score += 20; // Her eşleşen tag için
          matchDetails.tags++;
        }
      });
    }

    return {
      ...car,
      matchScore: score,
      matchDetails
    };
  });

  // Minimum skor eşiği - en azından bir kriter eşleşmeli
  const minScore = 20; // En az bir tag veya kısmi eşleşme
  
  let filteredCars = carsWithScores.filter(car => car.matchScore >= minScore);

  // Eğer hala sonuç yoksa, sadece bütçeye bak
  if (filteredCars.length === 0 && criteria.budget) {
    const budgetRange = roundBudgetToRange(criteria.budget);
    filteredCars = carsWithScores.filter(car => 
      car.priceTRY >= budgetRange.min * 0.8 && car.priceTRY <= budgetRange.max * 1.3
    );
  }

  // Eğer hala sonuç yoksa, en yüksek skorlu 5 aracı döndür
  if (filteredCars.length === 0) {
    filteredCars = carsWithScores
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  // Skora göre sırala
  filteredCars.sort((a, b) => b.matchScore - a.matchScore);

  return filteredCars;
}

/**
 * Filtreleme sonuçlarının özetini döndürür
 * @param criteria - Filtreleme kriterleri
 * @param results - Filtreleme sonuçları
 * @returns Özet bilgisi
 */
export function getFilterSummary(
  criteria: CarFilterCriteria,
  results: FilteredCar[]
): string {
  const parts: string[] = [];

  if (criteria.budget !== undefined) {
    const range = roundBudgetToRange(criteria.budget);
    parts.push(
      `Bütçe: ${(range.min / 1000000).toFixed(1)}M - ${(range.max / 1000000).toFixed(2)}M TL`
    );
  }

  if (criteria.body) {
    parts.push(`Gövde: ${criteria.body}`);
  }

  if (criteria.fuel) {
    parts.push(`Yakıt: ${criteria.fuel}`);
  }

  if (criteria.usage && criteria.usage.length > 0) {
    parts.push(`Kullanım: ${criteria.usage.join(', ')}`);
  }

  if (criteria.priorities && criteria.priorities.length > 0) {
    parts.push(`Öncelikler: ${criteria.priorities.join(', ')}`);
  }

  const summary = parts.join(' | ');
  return `${results.length} araç bulundu. Filtreler: ${summary}`;
}

/**
 * Örnek kullanım için yardımcı fonksiyon
 */
export function findCarsExample() {
  // Örnek: Kullanıcı 1.1M TL bütçe, SUV, Elektrikli, Şehir içi, Güvenlik önceliği seçti
  const criteria: CarFilterCriteria = {
    budget: 1100000,           // 1.1M TL -> B kategorisine (1M-1.25M) yuvarlanacak
    body: 'SUV',
    fuel: 'Elektrik',
    usage: ['Şehir içi'],
    priorities: ['Güvenlik']
  };

  const results = filterCars(criteria);
  const summary = getFilterSummary(criteria, results);

  console.log(summary);
  console.log('Bulunan araçlar:', results);

  return results;
}
