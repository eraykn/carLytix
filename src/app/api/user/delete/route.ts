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

// Hesabı sil
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }

    // Tüm ilişkili verileri ve kullanıcıyı sil
    // Prisma cascade ile otomatik olarak ilişkili kayıtları siler
    await prisma.$transaction(async (tx) => {
      // Auth session'ları sil
      await tx.authSession.deleteMany({
        where: { userId }
      });

      // AI ayarlarını sil
      await tx.userAISettings.deleteMany({
        where: { userId }
      });

      // Araç tercihlerini sil
      await tx.userVehiclePreferences.deleteMany({
        where: { userId }
      });

      // Match araçları sil
      await tx.userMatchedCar.deleteMany({
        where: { userId }
      });

      // Chat session'ları sil (mesajlar cascade ile silinir)
      await tx.chatSession.deleteMany({
        where: { userId }
      });

      // Kullanıcıyı sil
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({
      success: true,
      message: "Hesap başarıyla silindi"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Hesap silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
