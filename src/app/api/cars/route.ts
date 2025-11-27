// app/api/cars/route.ts
import { prisma } from "@/lib/prisma"; // lib/prisma.ts dosyanın olduğundan emin ol
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      include: {
        brand: true,
        specs: true,
        features: true,
      },
    });

    // Veritabanı verisini (Prisma), Frontend'in beklediği JSON formatına çeviriyoruz
    const formattedCars = cars.map((car) => ({
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

    return NextResponse.json(formattedCars);
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Veriler çekilemedi" }, { status: 500 });
  }
}