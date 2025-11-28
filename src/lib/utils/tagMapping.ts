// lib/utils/tagMapping.ts

/**
 * Standart Tag Kategorileri
 * (Frontend'de filtre butonlarını oluşturmak için kullanacağız)
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
 * Akıllı tag önerisi - araç özelliklerine göre otomatik tag ekler
 * (İleride yeni araç eklerken yardımcı olabilir)
 */
export function suggestTagsFromCarData(car: any): string[] {
  const suggestedTags: string[] = [];
  
  if (!car) return suggestedTags;
  
  // Yakıt tipine göre
  if (car.fuel?.toLowerCase().includes('elektrik')) {
    suggestedTags.push('Düşük tüketim');
  }
  
  // Güce göre (Eğer specs verisi varsa)
  const hp = car.specs?.performans?.guc_hp || car.specs?.horsepower; // Hem eski hem yeni yapıya uyumlu
  if (hp) {
    if (hp > 200) suggestedTags.push('Performans', 'Sport');
    if (hp < 120) suggestedTags.push('Düşük tüketim');
  }
  
  // Gövde tipine göre
  const body = car.body?.toLowerCase();
  if (body === 'suv') {
    suggestedTags.push('Aile odaklı', 'Kış şartları');
  }
  if (body === 'sedan') {
    suggestedTags.push('Konfor', 'Şehir içi');
  }
  if (body === 'hatchback') {
    suggestedTags.push('Şehir içi', 'Karma');
  }
  
  // 4x4 varsa
  const drivetrain = car.specs?.guc_aktarma?.cekis?.toLowerCase() || car.drivetrain?.toLowerCase();
  if (drivetrain?.includes('awd') || drivetrain?.includes('4wd')) {
    suggestedTags.push('Kış şartları');
  }
  
  return [...new Set(suggestedTags)];
}