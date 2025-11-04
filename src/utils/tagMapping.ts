/**
 * Standart Tag Kategorileri
 */
export const STANDARD_TAGS = {
  // Arazi/Kullanım kategorisi
  usage: [
    "Şehir içi",
    "Uzun yol",
    "Karma",
    "Kış şartları",
    "Aile odaklı",
    "Sport"
  ],
  // Öncelikler kategorisi
  priorities: [
    "Güvenlik",
    "Düşük tüketim",
    "Performans",
    "Konfor",
    "Teknoloji/ADAS",
    "Uygun bakım"
  ]
} as const;

/**
 * Eski tag'leri yeni standart tag'lere map eden sözlük
 * Key: JSON'daki eski tag (lowercase)
 * Value: Standart tag
 */
export const TAG_MAPPING: Record<string, string[]> = {
  // Kullanım tipleri
  "şehir içi": ["Şehir içi"],
  "şehir": ["Şehir içi"],
  "urban": ["Şehir içi"],
  "city": ["Şehir içi"],
  
  "uzun yol": ["Uzun yol"],
  "highway": ["Uzun yol"],
  "otoyol": ["Uzun yol"],
  "yol": ["Uzun yol"],
  
  "karma": ["Karma"],
  "mixed": ["Karma"],
  "kombine": ["Karma"],
  
  "kış şartları": ["Kış şartları"],
  "kış": ["Kış şartları"],
  "winter": ["Kış şartları"],
  "kar": ["Kış şartları"],
  
  "aile odaklı": ["Aile odaklı"],
  "aile": ["Aile odaklı"],
  "family": ["Aile odaklı"],
  "çocuklu": ["Aile odaklı"],
  
  "sport": ["Sport"],
  "sportif": ["Sport"],
  "sporty": ["Sport"],
  "dinamik": ["Sport", "Performans"],
  
  // Öncelikler
  "güvenlik": ["Güvenlik"],
  "safety": ["Güvenlik"],
  "adas": ["Güvenlik", "Teknoloji/ADAS"],
  "airbag": ["Güvenlik"],
  "ncap": ["Güvenlik"],
  
  "düşük tüketim": ["Düşük tüketim"],
  "ekonomik": ["Düşük tüketim"],
  "verimli": ["Düşük tüketim"],
  "economy": ["Düşük tüketim"],
  "yakıt tasarrufu": ["Düşük tüketim"],
  "elektrik": ["Düşük tüketim"],
  
  "performans": ["Performans"],
  "performance": ["Performans"],
  "hız": ["Performans"],
  "güçlü": ["Performans"],
  "hp": ["Performans"],
  "power": ["Performans"],
  
  "konfor": ["Konfor"],
  "comfort": ["Konfor"],
  "rahat": ["Konfor"],
  "lüks": ["Konfor"],
  "luxury": ["Konfor"],
  "sessiz": ["Konfor"],
  "yumuşak": ["Konfor"],
  
  "teknoloji/adas": ["Teknoloji/ADAS"],
  "teknoloji": ["Teknoloji/ADAS"],
  "technology": ["Teknoloji/ADAS"],
  "ekran": ["Teknoloji/ADAS"],
  "infotainment": ["Teknoloji/ADAS"],
  "dijital": ["Teknoloji/ADAS"],
  
  "uygun bakım": ["Uygun bakım"],
  "bakım": ["Uygun bakım"],
  "maintenance": ["Uygun bakım"],
  "servis": ["Uygun bakım"],
  "dayanıklı": ["Uygun bakım"],
  
  // Kaldırılacak veya map edilmeyecek tag'ler (boş array döner)
  "bagaj": [],
  "bagaj/pratiklik": [],
  "pratiklik": ["Konfor"],
  "fren": ["Güvenlik"],
  "disk fren": ["Güvenlik"],
  "abs": ["Güvenlik"],
  "esp": ["Güvenlik"],
  "park sensörü": ["Teknoloji/ADAS"],
  "kamera": ["Teknoloji/ADAS"],
  "geri görüş": ["Teknoloji/ADAS"],
};

/**
 * Bir tag'i standart tag'lere dönüştürür
 * @param tag - Orijinal tag
 * @returns Standart tag array'i
 */
export function mapTag(tag: string): string[] {
  const normalizedTag = tag.toLowerCase().trim();
  
  // Direkt mapping varsa onu kullan
  if (TAG_MAPPING[normalizedTag]) {
    return TAG_MAPPING[normalizedTag];
  }
  
  // Partial matching - tag içinde anahtar kelime var mı?
  for (const [key, value] of Object.entries(TAG_MAPPING)) {
    if (normalizedTag.includes(key) || key.includes(normalizedTag)) {
      return value;
    }
  }
  
  // Hiçbir mapping bulunamazsa orijinal tag'i döndür (boş array değil)
  // Ama eğer tag gereksizse (bagaj, fren vb) boş array döner
  const uselessKeywords = ['bagaj', 'fren', 'disk', 'abs', 'esp', 'sensor'];
  if (uselessKeywords.some(kw => normalizedTag.includes(kw))) {
    return [];
  }
  
  return [tag]; // Orijinal tag'i koru
}

/**
 * Bir araç için tüm tag'leri standart tag'lere dönüştürür
 * @param tags - Orijinal tag array'i
 * @returns Standart, unique tag array'i
 */
export function normalizeCarTags(tags: string[]): string[] {
  if (!tags || !Array.isArray(tags)) return [];
  
  const mappedTags = tags.flatMap(tag => mapTag(tag));
  
  // Unique yap
  return [...new Set(mappedTags)].filter(tag => tag.length > 0);
}

/**
 * Araç verisinin tag'lerini otomatik olarak normalize eder
 * @param car - Araç objesi
 * @returns Tag'leri normalize edilmiş araç objesi
 */
export function normalizeCarData(car: any) {
  if (!car) return car;
  
  return {
    ...car,
    tags: normalizeCarTags(car.tags || [])
  };
}

/**
 * Akıllı tag önerisi - araç özelliklerine göre otomatik tag ekler
 */
export function suggestTagsFromCarData(car: any): string[] {
  const suggestedTags: string[] = [];
  
  if (!car?.specs) return suggestedTags;
  
  // Yakıt tipine göre
  if (car.fuel?.toLowerCase().includes('elektrik')) {
    suggestedTags.push('Düşük tüketim');
  }
  
  // Güce göre
  const hp = car.specs?.performans?.guc_hp;
  if (hp) {
    if (hp > 200) suggestedTags.push('Performans', 'Sport');
    if (hp < 120) suggestedTags.push('Düşük tüketim');
  }
  
  // Gövde tipine göre
  if (car.body?.toLowerCase() === 'suv') {
    suggestedTags.push('Aile odaklı', 'Kış şartları');
  }
  if (car.body?.toLowerCase() === 'sedan') {
    suggestedTags.push('Konfor', 'Şehir içi');
  }
  if (car.body?.toLowerCase() === 'hatchback') {
    suggestedTags.push('Şehir içi', 'Karma');
  }
  
  // ADAS varsa
  if (car.specs?.güvenlik?.adas) {
    suggestedTags.push('Güvenlik', 'Teknoloji/ADAS');
  }
  
  // 4x4 varsa
  const drivetrain = car.specs?.guc_aktarma?.cekis?.toLowerCase();
  if (drivetrain?.includes('awd') || drivetrain?.includes('4wd')) {
    suggestedTags.push('Kış şartları');
  }
  
  return [...new Set(suggestedTags)];
}
