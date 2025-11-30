import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE - Belirli bir sohbeti sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Session ID gerekli" },
        { status: 400 }
      );
    }

    // Önce mesajları sil (foreign key constraint)
    await prisma.chatMessage.deleteMany({
      where: { sessionId: id },
    });

    // Sonra session'ı sil
    await prisma.chatSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sohbet silinirken hata:", error);
    return NextResponse.json(
      { success: false, error: "Sohbet silinemedi" },
      { status: 500 }
    );
  }
}
