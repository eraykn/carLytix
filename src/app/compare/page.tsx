import { CompareSection } from "@/components/sections/Compare/CompareSection";
import { prisma } from "@/lib/prisma";
import type { CarEntry } from "@/components/sections/Compare/CompareSection";

// Bu sayfanın her istekte yeniden render edilmesini sağla
export const dynamic = "force-dynamic";

async function getCars(): Promise<CarEntry[]> {
  try {
    const cars = await prisma.car.findMany({
      include: {
        brand: true,
        specs: true,
        features: true,
      },
    });

    return cars.map((car) => ({
      id: car.originalId || car.id,
      brand: car.brand.name,
      model: car.modelName,
      year: car.year,
      photo: car.imageUrl,
      details: car.specs
        ? {
            motor_hacmi_l: car.specs.engineVolume,
            guc_hp: car.specs.horsepower,
            tork_Nm: car.specs.torque,
            "0_100_kmh_s": car.specs.acceleration,
            maksimum_hiz_kmh: car.specs.topSpeed,
            yakit_tuketimi_avg_l_per_100km: car.specs.fuelConsumption,
            cekis: car.specs.driveTrain,
            agirlik_kg: car.specs.weight,
            uzunluk_mm: car.specs.length,
            genislik_mm: car.specs.width,
            bagaj_kapasitesi_l: car.specs.luggageCapacity,
            pil_turu: car.specs.batteryType,
            elektrik_araligi_NEDC_km: car.specs.electricRange,
            elektrikli_menzil_WLTP_km: car.specs.electricRange,
            ortalama_enerji_tuketimi_kWh_per_100km: "-",
            ortalama_enerji_tuketimi_WLTP_kWh_per_100km: "-",
          }
        : {},
      donanim: {
        guvenlik: car.features.map((f) => ({
          isim: f.name,
          mevcut: f.isAvailable,
        })),
      },
    }));
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export default async function ComparePage() {
  const cars = await getCars();
  return <CompareSection initialData={cars} />;
}
