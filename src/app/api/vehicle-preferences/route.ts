import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Token'dan kullanıcı ID'si al
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
    console.error("Failed to get user from token:", error);
    return null;
  }
}

// GET - Kullanıcının araç tercihlerini getir
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const vehiclePrefs = await prisma.userVehiclePreferences.findUnique({
      where: { userId },
    });

    if (!vehiclePrefs) {
      // Varsayılan boş tercihler döndür
      return NextResponse.json({
        usage: [],
        bodyType: [],
        fuelType: [],
        priorities: [],
        brands: [],
      });
    }

    return NextResponse.json({
      usage: vehiclePrefs.usage,
      bodyType: vehiclePrefs.bodyType,
      fuelType: vehiclePrefs.fuelType,
      priorities: vehiclePrefs.priorities,
      brands: vehiclePrefs.brands,
    });
  } catch (error) {
    console.error("Failed to get vehicle preferences:", error);
    return NextResponse.json(
      { error: "Failed to get vehicle preferences" },
      { status: 500 }
    );
  }
}

// POST - Kullanıcının araç tercihlerini kaydet/güncelle
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { usage, bodyType, fuelType, priorities, brands } = body;

    // Validate arrays
    if (!Array.isArray(usage) || !Array.isArray(bodyType) || 
        !Array.isArray(fuelType) || !Array.isArray(priorities) || 
        !Array.isArray(brands)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Upsert - varsa güncelle, yoksa oluştur
    const vehiclePrefs = await prisma.userVehiclePreferences.upsert({
      where: { userId },
      update: {
        usage,
        bodyType,
        fuelType,
        priorities,
        brands,
        updatedAt: new Date(),
      },
      create: {
        userId,
        usage,
        bodyType,
        fuelType,
        priorities,
        brands,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        usage: vehiclePrefs.usage,
        bodyType: vehiclePrefs.bodyType,
        fuelType: vehiclePrefs.fuelType,
        priorities: vehiclePrefs.priorities,
        brands: vehiclePrefs.brands,
      },
    });
  } catch (error) {
    console.error("Failed to save vehicle preferences:", error);
    return NextResponse.json(
      { error: "Failed to save vehicle preferences" },
      { status: 500 }
    );
  }
}
