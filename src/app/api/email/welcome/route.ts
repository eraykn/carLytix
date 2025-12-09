import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { WelcomeEmail } from "@/lib/email/templates/welcome-email";
import React from "react";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email adresi gerekli" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Carlytix'e Hoş Geldin! 🚗",
      react: React.createElement(WelcomeEmail, { name: name || "Değerli Kullanıcımız" }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "E-posta gönderilemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hoş geldin e-postası gönderildi",
      messageId: data?.id,
    });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json(
      { error: "E-posta gönderimi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
