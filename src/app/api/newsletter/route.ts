import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "E-posta adresi gerekli" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir e-posta adresi girin" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { success: false, error: "Bu e-posta adresi zaten kayıtlı" },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email: email.toLowerCase() },
          data: { isActive: true, subscribedAt: new Date() },
        });
        return NextResponse.json({
          success: true,
          message: "Bülten aboneliğiniz yeniden aktifleştirildi!",
        });
      }
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bültenimize başarıyla abone oldunuz!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}

// GET - Get subscriber count (optional, for admin)
export async function GET() {
  try {
    const count = await prisma.newsletterSubscriber.count({
      where: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Newsletter count error:", error);
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
