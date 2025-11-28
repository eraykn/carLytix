import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Yeni oturum oluştur veya mevcut oturumu getir
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Eğer sessionId varsa, mevcut oturumu getir
    if (sessionId) {
      const existingSession = await prisma.userSession.findUnique({
        where: { id: sessionId }
      });
      
      if (existingSession) {
        return NextResponse.json({ 
          success: true, 
          session: existingSession,
          isNew: false 
        });
      }
    }

    // Yeni oturum oluştur
    const newSession = await prisma.userSession.create({
      data: {
        usageTags: [],
        priorityTags: [],
        recommendedCarIds: [],
        userAgent,
        ipAddress,
        selectionHistory: { steps: [] }
      }
    });

    return NextResponse.json({ 
      success: true, 
      session: newSession,
      isNew: true 
    });

  } catch (error) {
    console.error("Session API Error:", error);
    return NextResponse.json(
      { error: "Oturum oluşturulurken hata oluştu." }, 
      { status: 500 }
    );
  }
}

// Oturum bilgilerini güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      sessionId, 
      usageTags, 
      bodyType, 
      fuelType, 
      priorityTags, 
      budget,
      step, // Hangi adımda olduğu
      action, // "select" veya "deselect"
      recommendedCarIds, // Önerilen araç ID'leri
      selectedCarId // Kullanıcının seçtiği araç
    } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID gerekli." }, 
        { status: 400 }
      );
    }

    // Mevcut oturumu getir
    const existingSession = await prisma.userSession.findUnique({
      where: { id: sessionId }
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Oturum bulunamadı." }, 
        { status: 404 }
      );
    }

    // Seçim geçmişini güncelle
    const currentHistory = (existingSession.selectionHistory as { steps: any[] }) || { steps: [] };
    const newStep = {
      timestamp: new Date().toISOString(),
      step,
      action,
      data: { usageTags, bodyType, fuelType, priorityTags, budget, recommendedCarIds, selectedCarId }
    };
    currentHistory.steps.push(newStep);

    // Oturumu güncelle
    const updatedSession = await prisma.userSession.update({
      where: { id: sessionId },
      data: {
        usageTags: usageTags || existingSession.usageTags,
        bodyType: bodyType !== undefined ? bodyType : existingSession.bodyType,
        fuelType: fuelType !== undefined ? fuelType : existingSession.fuelType,
        priorityTags: priorityTags || existingSession.priorityTags,
        budget: budget !== undefined ? budget : existingSession.budget,
        recommendedCarIds: recommendedCarIds || existingSession.recommendedCarIds,
        selectedCarId: selectedCarId || existingSession.selectedCarId,
        completedAt: action === 'complete' ? new Date() : existingSession.completedAt,
        selectionHistory: currentHistory
      }
    });

    return NextResponse.json({ 
      success: true, 
      session: updatedSession 
    });

  } catch (error) {
    console.error("Session Update Error:", error);
    return NextResponse.json(
      { error: "Oturum güncellenirken hata oluştu." }, 
      { status: 500 }
    );
  }
}

// Oturum bilgilerini getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID gerekli." }, 
        { status: 400 }
      );
    }

    const session = await prisma.userSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json(
        { error: "Oturum bulunamadı." }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      session 
    });

  } catch (error) {
    console.error("Session Get Error:", error);
    return NextResponse.json(
      { error: "Oturum getirilirken hata oluştu." }, 
      { status: 500 }
    );
  }
}
