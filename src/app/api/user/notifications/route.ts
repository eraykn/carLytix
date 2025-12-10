import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Token'dan kullanıcı ID'si al
async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  const session = await prisma.authSession.findUnique({
    where: { token },
    select: {
      expiresAt: true,
      user: {
        select: { id: true, isActive: true }
      }
    }
  });

  if (!session || new Date() > session.expiresAt || !session.user.isActive) {
    return null;
  }

  return session.user.id;
}

// Bildirim ayarlarını getir
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }

    // Kullanıcının bildirim ayarlarını getir
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Bildirim ayarları şu an için varsayılan değerler döndür
    // İleride veritabanına eklenebilir
    return NextResponse.json({
      success: true,
      settings: {
        emailNotifications: true,
        newFeatures: true,
        aiReports: false
      }
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Ayarlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Bildirim ayarlarını güncelle
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Şu an için log kaydı tut, ileride veritabanına kaydedilebilir
    console.log(`User ${userId} notification settings updated:`, body);

    return NextResponse.json({
      success: true,
      message: "Bildirim ayarları güncellendi"
    });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
