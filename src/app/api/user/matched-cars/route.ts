import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Token'dan kullanıcı ID'sini al
async function getUserIdFromToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const session = await prisma.authSession.findUnique({
      where: { token },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            isActive: true,
          }
        }
      }
    });

    if (!session || new Date() > session.expiresAt || !session.user.isActive) {
      return null;
    }

    return session.user.id;
  } catch (error) {
    console.error("Failed to get user ID:", error);
    return null;
  }
}

// GET - Kullanıcının eşleşen araçlarını getir
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const matchedCars = await prisma.userMatchedCar.findMany({
      where: { userId },
      orderBy: { matchDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      cars: matchedCars,
      count: matchedCars.length,
    });
  } catch (error) {
    console.error("Failed to get matched cars:", error);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Yeni bir araç eşleştirmesi kaydet
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { carId, brand, model, trim, year, body: bodyType, fuel, price, imageMain, brandLogo, matchScore } = body;

    // Gerekli alanları kontrol et
    if (!carId || !brand || !model) {
      return NextResponse.json(
        { success: false, error: "Araç bilgileri eksik" },
        { status: 400 }
      );
    }

    // Zaten eşleşme var mı kontrol et
    const existingMatch = await prisma.userMatchedCar.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        }
      }
    });

    if (existingMatch) {
      return NextResponse.json({
        success: true,
        message: "Bu araç zaten listenizde",
        car: existingMatch,
        isExisting: true,
      });
    }

    // Yeni eşleşme oluştur
    const matchedCar = await prisma.userMatchedCar.create({
      data: {
        userId,
        carId,
        brand,
        model,
        trim: trim || null,
        year: typeof year === 'number' ? year : (parseInt(String(year)) || new Date().getFullYear()),
        body: bodyType || "Sedan",
        fuel: fuel || "Benzin",
        price: typeof price === 'number' ? price : (parseInt(String(price)) || 0),
        imageMain: imageMain || null,
        brandLogo: brandLogo || null,
        matchScore: typeof matchScore === 'number' ? matchScore : (matchScore ? parseInt(String(matchScore)) : null),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Araç listenize eklendi!",
      car: matchedCar,
    });
  } catch (error: any) {
    console.error("Failed to save matched car:", error);
    console.error("Error details:", error?.message, error?.code);
    return NextResponse.json(
      { success: false, error: `Bir hata oluştu: ${error?.message || 'Bilinmeyen hata'}` },
      { status: 500 }
    );
  }
}

// DELETE - Eşleşme sil
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");

    if (!carId) {
      return NextResponse.json(
        { success: false, error: "Araç ID gerekli" },
        { status: 400 }
      );
    }

    await prisma.userMatchedCar.delete({
      where: {
        userId_carId: {
          userId,
          carId,
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Araç listeden kaldırıldı",
    });
  } catch (error) {
    console.error("Failed to delete matched car:", error);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

// PATCH - Eşleşme güncelle (favori, not ekle vb.)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { carId, isFavorite, notes } = body;

    if (!carId) {
      return NextResponse.json(
        { success: false, error: "Araç ID gerekli" },
        { status: 400 }
      );
    }

    const updatedCar = await prisma.userMatchedCar.update({
      where: {
        userId_carId: {
          userId,
          carId,
        }
      },
      data: {
        ...(isFavorite !== undefined && { isFavorite }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({
      success: true,
      car: updatedCar,
    });
  } catch (error) {
    console.error("Failed to update matched car:", error);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
