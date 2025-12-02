import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js cache'i devre dışı bırak (her zaman güncel veri)
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Token'ı header'dan al
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Yetkilendirme token'ı gerekli" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Session'ı bul (sadece gerekli alanları çek)
    const session = await prisma.authSession.findUnique({
      where: { token },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            isVerified: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş oturum" },
        { status: 401 }
      );
    }

    // Oturum süresi kontrolü
    if (new Date() > session.expiresAt) {
      // Fire-and-forget: Süresi dolmuş session'ı arka planda sil (await yok)
      prisma.authSession.delete({ where: { token } }).catch(() => {});

      return NextResponse.json(
        { error: "Oturum süresi dolmuş, lütfen tekrar giriş yapın" },
        { status: 401 }
      );
    }

    // Kullanıcı aktif mi kontrol et
    if (!session.user.isActive) {
      return NextResponse.json(
        { error: "Hesabınız devre dışı bırakılmış" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.avatar,
        isVerified: session.user.isVerified,
        createdAt: session.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      { error: "Kullanıcı bilgisi alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
