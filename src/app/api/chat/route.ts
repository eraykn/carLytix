import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Gemini API client initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// System prompt for CarLytix AI assistant
const SYSTEM_PROMPT = `
Sen CarLytix platformunun yapay zeka asistanısın. Türkiye otomobil pazarında uzmanlaşmış, veri odaklı bir danışmansın.

KİMLİK VE TON:
- İsmin: CarLytix AI.
- Ton: Profesyonel, objektif, yardımsever ve analitik.
- Asla spekülatif konuşma, verilere dayan.

TEMEL GÖREVLERİN:
1. Araç Önerisi: Kullanıcının bütçesine (TL), yaşam tarzına (aile, genç, şehir içi, off-road) uygun araçlar öner.
2. Karşılaştırma: İki veya daha fazla araç sorulduğunda, bunları mutlaka teknik özelliklerine göre kıyasla.
3. Piyasa Analizi: Türkiye'deki güncel piyasa koşullarını, vergi dilimlerini (ÖTV) ve yakıt maliyetlerini göz önünde bulundur.

YANIT KURALLARI (KESİN UYGULA):
- **Tablo Kullan:** Eğer kullanıcı araç karşılaştırması isterse, verileri mutlaka Markdown tablosu olarak sun.
- **Finansal Uyarı:** Fiyat verirken "Tahmini piyasa fiyatıdır, değişkenlik gösterebilir" uyarısını ekle.
- **Detaylara İn:** Sadece motor gücünü değil; bagaj hacmi, yakıt tüketimi, NCAP güvenlik puanı ve kronik sorunları (varsa) belirt.
- **İkinci El:** İkinci el değeri (piyasası hızlı mı yavaş mı) hakkında bilgi ver.
- **Türkçe:** Her zaman akıcı bir Türkçe kullan.

KISITLAMALAR:
- Araçlar, trafik, bakım veya sigorta dışındaki konulara girme. Konu dışı sorularda: "Ben sadece CarLytix araç analizi konusunda yardımcı olabilirim," diyerek kibarca reddet.
- Yasal veya tıbbi tavsiye verme.

ÖRNEK DAVRANIŞ:
Kullanıcı: "Egea mı Clio mu?"
Sen: (Önce kullanıcıya bütçe ve kullanım amacını sor veya genel bir karşılaştırma tablosu sunarak avantaj/dezavantajlarını listele.)
`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { messages, persona, budgetFlex, priorityWeight, theme, sessionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Geçersiz mesaj formatı" },
        { status: 400 }
      );
    }

    // Get request metadata for logging
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create or get chat session
    let chatSession;
    if (sessionId) {
      // Update existing session
      chatSession = await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          persona,
          budgetFlex,
          priorityWeight,
          theme,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new session
      chatSession = await prisma.chatSession.create({
        data: {
          ipAddress,
          userAgent,
          persona,
          budgetFlex,
          priorityWeight,
          theme,
        },
      });
    }

    // Build context with settings
    let contextPrompt = SYSTEM_PROMPT;
    
    if (persona) {
      const personaDescriptions: Record<string, string> = {
        "Profesyonel Danışman": "Profesyonel ve resmi bir dil kullan, detaylı analizler sun.",
        "Teknik Uzman": "Teknik detaylara odaklan, motor özellikleri, tork, beygir gücü gibi verileri ön plana çıkar.",
        "Basit Anlatıcı": "Basit ve anlaşılır bir dil kullan, teknik terimleri açıkla.",
        "Sportif & Araç Tutkunu": "Heyecanlı ve tutkulu bir dil kullan, performans ve sürüş keyfi üzerine odaklan.",
      };
      contextPrompt += `\n\nKonuşma tarzı: ${personaDescriptions[persona] || persona}`;
    }

    if (budgetFlex) {
      contextPrompt += `\n\nBütçe esnekliği: Kullanıcının belirttiği bütçenin ${budgetFlex} üzerine kadar araç önerebilirsin.`;
    }

    if (priorityWeight) {
      const priorityDescriptions: Record<string, string> = {
        "Güvenlik": "Güvenlik özelliklerini (airbag sayısı, ABS, ESP, NCAP puanı) ön planda tut.",
        "Performans": "Motor gücü, hızlanma, yakıt verimliliği gibi performans özelliklerini vurgula.",
        "Teknoloji": "Araç içi teknoloji, infotainment, sürücü destek sistemleri gibi özellikleri ön plana çıkar.",
        "Uygun Bakım": "Bakım maliyetleri, yedek parça bulunabilirliği ve servis ağı gibi konulara öncelik ver.",
      };
      contextPrompt += `\n\nÖncelik: ${priorityDescriptions[priorityWeight] || priorityWeight}`;
    }

    // Get the model with system instruction - using gemini-1.5-flash-latest for stability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: contextPrompt
    });

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Get the last user message
    const lastMessage = messages[messages.length - 1];

    // Start chat with history (no need to add system prompt here anymore)
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send message with streaming enabled
          const result = await chat.sendMessageStream(lastMessage.content);

          // Stream each chunk to the client
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            
            // Send chunk to client
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ chunk: chunkText, sessionId: chatSession.id })}\n\n`)
            );
          }

          const responseTime = Date.now() - startTime;

          // Log both messages to database in parallel after streaming completes
          await Promise.all([
            prisma.chatMessage.create({
              data: {
                sessionId: chatSession.id,
                role: "user",
                content: lastMessage.content,
              },
            }),
            prisma.chatMessage.create({
              data: {
                sessionId: chatSession.id,
                role: "assistant",
                content: fullText,
                responseTime,
              },
            }),
          ]);

          // Send final event with complete message
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, fullText, sessionId: chatSession.id })}\n\n`)
          );

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "API anahtarı geçersiz veya eksik" },
          { status: 401 }
        );
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "API kotası aşıldı, lütfen daha sonra tekrar deneyin" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Bir hata oluştu, lütfen tekrar deneyin" },
      { status: 500 }
    );
  }
}
