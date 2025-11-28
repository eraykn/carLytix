import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("id");

    if (!carId) {
      return NextResponse.json(
        { error: "Araç ID'si gerekli." },
        { status: 400 }
      );
    }

    // Veritabanından aracı getir
    const car = await prisma.assistantCar.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return NextResponse.json(
        { error: "Araç bulunamadı." },
        { status: 404 }
      );
    }

    // Frontend'in beklediği formata dönüştür
    const formattedCar = {
      id: car.id,
      brand: car.brand,
      model: car.model,
      trim: car.trim || '',
      year: car.year,
      body: car.body,
      fuel: car.fuel,
      drivetrain: car.drivetrain,
      priceTRY: car.price,
      tags: car.tags || [],
      media: {
        image_main: car.imageMain || '/images/cars/placeholder.jpg',
        image_interior: car.imageInterior,
        brand_logo: car.brandLogo || '/images/brands/default-logo.svg'
      },
      specs: car.specs || {},
      score: {
        toplam: car.scoreTotal || 0,
        kriterler: {
          ekonomi: car.scoreEconomy || 0,
          konfor: car.scoreComfort || 0,
          guvenlik: car.scoreSafety || 0,
          performans: car.scorePerformance || 0,
          teknoloji: car.scoreTechnology || 0
        }
      },
      why: car.whyText || '',
      whyBullets: car.whyBullets || []
    };

    return NextResponse.json(formattedCar);

  } catch (error) {
    console.error("Car API Error:", error);
    return NextResponse.json(
      { error: "Araç bilgisi alınırken hata oluştu." },
      { status: 500 }
    );
  }
}
