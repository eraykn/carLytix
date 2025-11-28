// app/api/assistant/car/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
  }

  try {
    const car = await prisma.assistantCar.findUnique({
      where: { originalId: id },
    });

    if (!car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    // Veritabanı yapısını Frontend'in beklediği yapıya uyduralım
    const formattedCar = {
        id: car.originalId,
        brand: car.brand,
        model: car.model,
        trim: car.trim,
        year: car.year,
        body: car.body,
        fuel: car.fuel,
        priceTRY: car.price,
        media: {
            image_main: car.imageMain,
            brand_logo: car.brandLogo
        },
        specs: car.specs, // JSON olarak saklamıştık, direkt gelir
        score: {
            toplam: car.scoreTotal,
            kriterler: {
                ekonomi: car.scoreEconomy,
                konfor: car.scoreComfort,
                guvenlik: car.scoreSafety,
                performans: car.scorePerformance,
                teknoloji: car.scoreTechnology
            }
        },
        why: car.whyText
    };

    return NextResponse.json(formattedCar);

  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}