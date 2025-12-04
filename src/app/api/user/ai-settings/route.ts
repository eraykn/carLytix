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

// AI Settings'i getir
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }

    // Kullanıcının AI ayarlarını getir veya varsayılan değerlerle oluştur
    let settings = await prisma.userAISettings.findUnique({
      where: { userId }
    });

    // Eğer ayar yoksa varsayılan değerlerle oluştur
    if (!settings) {
      settings = await prisma.userAISettings.create({
        data: {
          userId,
          customizationEnabled: true,
          customInstructions: "",
          responseStyle: "Dengeli",
          tone: "Samimi",
          suggestionSensitivity: "Orta",
          budgetFlexibility: "+10%",
          brandPreference: "Dengeli",
          typingAnimation: true,
          useHistory: true,
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        customizationEnabled: settings.customizationEnabled,
        customInstructions: settings.customInstructions || "",
        responseStyle: settings.responseStyle,
        tone: settings.tone,
        suggestionSensitivity: settings.suggestionSensitivity,
        budgetFlexibility: settings.budgetFlexibility,
        brandPreference: settings.brandPreference,
        typingAnimation: settings.typingAnimation,
        useHistory: settings.useHistory,
      }
    });
  } catch (error) {
    console.error("Get AI settings error:", error);
    return NextResponse.json(
      { error: "Ayarlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// AI Settings'i güncelle
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

    // Validate gelen veriler
    const validResponseStyles = ["Kısa", "Dengeli", "Detaylı"];
    const validTones = ["Teknik", "Kurumsal", "Samimi"];
    const validSensitivities = ["Sıkı", "Orta", "Geniş"];
    const validFlexibilities = ["+5%", "+10%", "+20%"];
    const validBrandPrefs = ["Dengeli", "Favori"];

    const updateData: {
      customizationEnabled?: boolean;
      customInstructions?: string;
      responseStyle?: string;
      tone?: string;
      suggestionSensitivity?: string;
      budgetFlexibility?: string;
      brandPreference?: string;
      typingAnimation?: boolean;
      useHistory?: boolean;
    } = {};

    // Boolean değerler
    if (typeof body.customizationEnabled === "boolean") {
      updateData.customizationEnabled = body.customizationEnabled;
    }
    if (typeof body.typingAnimation === "boolean") {
      updateData.typingAnimation = body.typingAnimation;
    }
    if (typeof body.useHistory === "boolean") {
      updateData.useHistory = body.useHistory;
    }

    // String değerler
    if (typeof body.customInstructions === "string") {
      updateData.customInstructions = body.customInstructions.slice(0, 1000); // Max 1000 karakter
    }
    if (validResponseStyles.includes(body.responseStyle)) {
      updateData.responseStyle = body.responseStyle;
    }
    if (validTones.includes(body.tone)) {
      updateData.tone = body.tone;
    }
    if (validSensitivities.includes(body.suggestionSensitivity)) {
      updateData.suggestionSensitivity = body.suggestionSensitivity;
    }
    if (validFlexibilities.includes(body.budgetFlexibility)) {
      updateData.budgetFlexibility = body.budgetFlexibility;
    }
    if (validBrandPrefs.includes(body.brandPreference)) {
      updateData.brandPreference = body.brandPreference;
    }

    // Upsert - varsa güncelle, yoksa oluştur
    const settings = await prisma.userAISettings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        customizationEnabled: updateData.customizationEnabled ?? true,
        customInstructions: updateData.customInstructions ?? "",
        responseStyle: updateData.responseStyle ?? "Dengeli",
        tone: updateData.tone ?? "Samimi",
        suggestionSensitivity: updateData.suggestionSensitivity ?? "Orta",
        budgetFlexibility: updateData.budgetFlexibility ?? "+10%",
        brandPreference: updateData.brandPreference ?? "Dengeli",
        typingAnimation: updateData.typingAnimation ?? true,
        useHistory: updateData.useHistory ?? true,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Ayarlar başarıyla kaydedildi",
      settings: {
        customizationEnabled: settings.customizationEnabled,
        customInstructions: settings.customInstructions || "",
        responseStyle: settings.responseStyle,
        tone: settings.tone,
        suggestionSensitivity: settings.suggestionSensitivity,
        budgetFlexibility: settings.budgetFlexibility,
        brandPreference: settings.brandPreference,
        typingAnimation: settings.typingAnimation,
        useHistory: settings.useHistory,
      }
    });
  } catch (error) {
    console.error("Update AI settings error:", error);
    return NextResponse.json(
      { error: "Ayarlar kaydedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
