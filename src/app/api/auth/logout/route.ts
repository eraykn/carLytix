import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // Token'ı header'dan al
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Token yoksa bile başarılı dön (zaten logout durumu)
    return NextResponse.json({
      success: true,
      message: "Çıkış başarılı",
    });
  }

  const token = authHeader.substring(7);

  // Idempotent silme: Token varsa sil, yoksa sessizce devam et
  // deleteMany hata fırlatmaz, sadece count: 0 döner
  prisma.authSession.deleteMany({
    where: { token },
  }).catch(() => {
    // Fail-safe: DB hatası olsa bile kullanıcıya başarılı dön
    // Kullanıcı deneyimi açısından önemli
  });

  return NextResponse.json({
    success: true,
    message: "Çıkış başarılı",
  });
}
