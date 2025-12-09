import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL, CONTACT_EMAIL } from "@/lib/email/resend";
import { ContactEmail } from "@/lib/email/templates/contact-email";
import { z } from "zod";
import React from "react";

// Validation schema
const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "Ad gerekli")
    .max(15, "Ad en fazla 15 karakter olabilir"),
  lastName: z
    .string()
    .min(1, "Soyad gerekli")
    .max(15, "Soyad en fazla 15 karakter olabilir"),
  email: z.string().email("Geçersiz e-posta adresi"),
  message: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmalıdır")
    .max(240, "Mesaj en fazla 240 karakter olabilir"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    const { firstName, lastName, email, message } = validation.data;

    // Check if first name and last name are the same (troll prevention)
    if (firstName.trim().toLowerCase() === lastName.trim().toLowerCase()) {
      return NextResponse.json(
        { error: "Ad ve Soyad aynı olamaz" },
        { status: 400 }
      );
    }

    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Yeni İletişim Talebi: ${firstName} ${lastName}`,
      react: React.createElement(ContactEmail, {
        firstName,
        lastName,
        email,
        message,
      }),
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
      message: "İletişim talebiniz başarıyla gönderildi",
      messageId: data?.id,
    });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "E-posta gönderimi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
