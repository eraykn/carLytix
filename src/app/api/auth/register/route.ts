import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { WelcomeEmail } from "@/lib/email/templates/welcome-email";
import React from "react";

// Zod validasyon şeması
const registerSchema = z.object({
  email: z.string().email("Geçersiz e-posta formatı"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Zod validasyonu
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Mevcut kullanıcı kontrolü (sadece id çek, tüm veriyi değil)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Oturum token'ı oluştur
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün

    // IP ve User Agent bilgilerini al
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Nested write: Kullanıcı + Session tek sorguda oluştur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
        sessions: {
          create: {
            token,
            expiresAt,
            ipAddress,
            userAgent,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        sessions: {
          select: {
            token: true,
            expiresAt: true,
          },
          take: 1,
        },
      },
    });

    // Send welcome email (non-blocking)
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Carlytix'e Hoş Geldin! 🚗",
        react: React.createElement(WelcomeEmail, { 
          name: user.name || "Değerli Kullanıcımız" 
        }),
      });
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Kayıt başarılı",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token: user.sessions[0].token,
      expiresAt: user.sessions[0].expiresAt,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
