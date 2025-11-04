/**
 * Tag Mapping Test Script
 * JSON'daki tag'lerin nasıl map edildiğini test eder
 */

import { normalizeCarTags, mapTag, suggestTagsFromCarData } from './tagMapping';
import assistantData from '@/json/assistant.json';

console.log('🏷️  TAG MAPPING TEST\n');

// Test 1: Tek tag mapping
console.log('📝 Test 1: Tek Tag Mapping');
const testTags = [
  'Bagaj',
  'Bagaj/pratiklik',
  'Fren',
  'Şehir içi',
  'Ekonomik',
  'ADAS',
  'Lüks',
  'Güvenlik'
];

testTags.forEach(tag => {
  const mapped = mapTag(tag);
  console.log(`  "${tag}" → ${mapped.length > 0 ? `[${mapped.join(', ')}]` : '❌ Kaldırıldı'}`);
});

// Test 2: Araç tag'lerini normalize et
console.log('\n📝 Test 2: İlk 5 Aracın Tag Dönüşümü');
const cars = assistantData.slice(0, 5);

cars.forEach((car: any, index: number) => {
  console.log(`\n${index + 1}. ${car.brand} ${car.model}`);
  console.log(`   Orijinal: [${car.tags?.join(', ') || 'YOK'}]`);
  
  const normalized = normalizeCarTags(car.tags || []);
  console.log(`   Normalize: [${normalized.join(', ')}]`);
  
  const suggested = suggestTagsFromCarData(car);
  console.log(`   Önerilen: [${suggested.join(', ')}]`);
});

// Test 3: İstatistikler
console.log('\n📊 Genel İstatistikler');
const allOriginalTags = new Set<string>();
const allNormalizedTags = new Set<string>();

assistantData.forEach((car: any) => {
  car.tags?.forEach((tag: string) => allOriginalTags.add(tag));
  const normalized = normalizeCarTags(car.tags || []);
  normalized.forEach(tag => allNormalizedTags.add(tag));
});

console.log(`   Toplam Orijinal Tag: ${allOriginalTags.size}`);
console.log(`   Toplam Normalize Tag: ${allNormalizedTags.size}`);
console.log(`   Azaltma: %${(((allOriginalTags.size - allNormalizedTags.size) / allOriginalTags.size) * 100).toFixed(1)}`);

console.log('\n✅ Test tamamlandı!\n');
