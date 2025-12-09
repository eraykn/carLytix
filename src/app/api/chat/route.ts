import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Gemini API client initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// User AI Settings Interface
interface UserAISettings {
  customizationEnabled: boolean;
  customInstructions: string | null;
  responseStyle: string;
  tone: string;
  suggestionSensitivity: string;
  budgetFlexibility: string;
  brandPreference: string;
  typingAnimation: boolean;
  useHistory: boolean;
}

// Vehicle Preferences Interface
interface UserVehiclePreferences {
  usage: string[];
  bodyType: string[];
  fuelType: string[];
  priorities: string[];
  brands: string[];
}

// Token'dan kullanıcı AI ayarlarını al
async function getUserAISettings(authHeader: string | null): Promise<UserAISettings | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const session = await prisma.authSession.findUnique({
      where: { token },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            isActive: true,
            aiSettings: true
          }
        }
      }
    });

    if (!session || new Date() > session.expiresAt || !session.user.isActive) {
      return null;
    }

    // Ayarlar yoksa varsayılan döndür
    if (!session.user.aiSettings) {
      return {
        customizationEnabled: true,
        customInstructions: null,
        responseStyle: "Dengeli",
        tone: "Samimi",
        suggestionSensitivity: "Orta",
        budgetFlexibility: "+10%",
        brandPreference: "Dengeli",
        typingAnimation: true,
        useHistory: true,
      };
    }

    return session.user.aiSettings;
  } catch (error) {
    console.error("Failed to get user AI settings:", error);
    return null;
  }
}

// Token'dan kullanıcı araç tercihlerini al
async function getUserVehiclePreferences(authHeader: string | null): Promise<UserVehiclePreferences | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const session = await prisma.authSession.findUnique({
      where: { token },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            isActive: true,
            vehiclePrefs: true
          }
        }
      }
    });

    if (!session || new Date() > session.expiresAt || !session.user.isActive) {
      return null;
    }

    // Tercihler yoksa null döndür
    if (!session.user.vehiclePrefs) {
      return null;
    }

    return session.user.vehiclePrefs;
  } catch (error) {
    console.error("Failed to get user vehicle preferences:", error);
    return null;
  }
}

// Token'dan kullanıcı ID'sini al
async function getUserIdFromToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const session = await prisma.authSession.findUnique({
      where: { token },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            isActive: true,
          }
        }
      }
    });

    if (!session || new Date() > session.expiresAt || !session.user.isActive) {
      return null;
    }

    return session.user.id;
  } catch (error) {
    console.error("Failed to get user ID:", error);
    return null;
  }
}

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

    // Get user AI settings if logged in
    const authHeader = request.headers.get("authorization");
    const userSettings = await getUserAISettings(authHeader);
    const vehiclePrefs = await getUserVehiclePreferences(authHeader);
    const userId = await getUserIdFromToken(authHeader);

    // Get request metadata for logging
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create or get chat session
    let chatSession;
    if (sessionId) {
      // Try to update existing session, create new if not found
      try {
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
      } catch {
        // Session not found, create new one
        chatSession = await prisma.chatSession.create({
          data: {
            userId,
            ipAddress,
            userAgent,
            persona,
            budgetFlex,
            priorityWeight,
            theme,
          },
        });
      }
    } else {
      // Create new session
      chatSession = await prisma.chatSession.create({
        data: {
          userId,
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

    // Apply user's personalized AI settings if available
    if (userSettings && userSettings.customizationEnabled) {
      // Response Style
      const responseStyleDescriptions: Record<string, string> = {
        "Kısa": "Yanıtlarını kısa ve öz tut. Gereksiz detaylara girme, sadece en önemli bilgileri ver.",
        "Dengeli": "Orta uzunlukta, dengeli yanıtlar ver. Yeterli detay sun ama gereksiz uzatma.",
        "Detaylı": "Kapsamlı ve detaylı yanıtlar ver. Tüm ilgili bilgileri, alternatifleri ve açıklamaları dahil et.",
      };
      if (userSettings.responseStyle && responseStyleDescriptions[userSettings.responseStyle]) {
        contextPrompt += `\n\nYANIT UZUNLUĞU: ${responseStyleDescriptions[userSettings.responseStyle]}`;
      }

      // Tone
      const toneDescriptions: Record<string, string> = {
        "Teknik": "Teknik ve profesyonel bir dil kullan. Terminolojiye hakim biri gibi konuş, detaylı spesifikasyonlar ver.",
        "Kurumsal": "Resmi ve kurumsal bir dil kullan. Profesyonel ama mesafeli ol.",
        "Samimi": "Samimi ve arkadaşça bir dil kullan. Sanki bir arkadaşınla sohbet ediyormuş gibi rahat konuş.",
      };
      if (userSettings.tone && toneDescriptions[userSettings.tone]) {
        contextPrompt += `\n\nTON: ${toneDescriptions[userSettings.tone]}`;
      }

      // Suggestion Sensitivity
      const sensitivityDescriptions: Record<string, string> = {
        "Sıkı": "Sadece kullanıcının belirttiği kriterlere tam uyan araçları öner. Tolerans gösterme.",
        "Orta": "Kullanıcının kriterlerine yakın araçları da önerebilirsin, ama çok sapma.",
        "Geniş": "Kullanıcının ilgisini çekebilecek farklı alternatifleri de sun. Yaratıcı öneriler yap.",
      };
      if (userSettings.suggestionSensitivity && sensitivityDescriptions[userSettings.suggestionSensitivity]) {
        contextPrompt += `\n\nÖNERİ YAKLAŞIMI: ${sensitivityDescriptions[userSettings.suggestionSensitivity]}`;
      }

      // Budget Flexibility (user's saved setting overrides the per-chat setting)
      if (userSettings.budgetFlexibility) {
        contextPrompt += `\n\nBÜTÇE ESNEKLİĞİ: Kullanıcının belirttiği bütçenin ${userSettings.budgetFlexibility} üzerine kadar araç önerebilirsin.`;
      }

      // Brand Preference
      if (userSettings.brandPreference === "Favori") {
        contextPrompt += `\n\nMARKA TERCİHİ: Kullanıcı belirli markaları sevebilir. Geçmiş konuşmalarda bahsettiği veya beğendiği markalara öncelik ver.`;
      }

      // Custom Instructions (most important - user's own words)
      if (userSettings.customInstructions && userSettings.customInstructions.trim()) {
        contextPrompt += `\n\nKULLANICI ÖZEL TALİMATLARI (Bu talimatlara kesinlikle uy):\n${userSettings.customInstructions}`;
      }
    }

    // Apply user's vehicle preferences if available
    if (vehiclePrefs) {
      contextPrompt += `\n\n--- KULLANICI ARAÇ TERCİHLERİ (ÖNEMLİ) ---`;
      
      // Usage preferences
      if (vehiclePrefs.usage && vehiclePrefs.usage.length > 0) {
        contextPrompt += `\nKULLANIM AMACI: Kullanıcı aracını şu amaçlarla kullanacak: ${vehiclePrefs.usage.join(", ")}. Önerilerinde bu kullanım senaryolarına uygun araçları ön plana çıkar.`;
      }
      
      // Body type preferences
      if (vehiclePrefs.bodyType && vehiclePrefs.bodyType.length > 0) {
        contextPrompt += `\nKASA TİPİ TERCİHİ: Kullanıcı şu kasa tiplerini tercih ediyor: ${vehiclePrefs.bodyType.join(", ")}. Önerilerinde bu kasa tiplerine öncelik ver.`;
      }
      
      // Fuel type preferences
      if (vehiclePrefs.fuelType && vehiclePrefs.fuelType.length > 0) {
        contextPrompt += `\nYAKIT TİPİ TERCİHİ: Kullanıcı şu yakıt tiplerini tercih ediyor: ${vehiclePrefs.fuelType.join(", ")}. Önerilerinde bu yakıt tiplerindeki araçlara öncelik ver.`;
      }
      
      // Priority preferences
      if (vehiclePrefs.priorities && vehiclePrefs.priorities.length > 0) {
        contextPrompt += `\nÖNCELİKLER: Kullanıcı için şunlar önemli: ${vehiclePrefs.priorities.join(", ")}. Araç önerirken ve karşılaştırırken bu kriterleri özellikle vurgula.`;
      }
      
      // Brand preferences (CRITICAL - 90% weight)
      if (vehiclePrefs.brands && vehiclePrefs.brands.length > 0) {
        contextPrompt += `\n\n🚨 FAVORİ MARKALAR (KRİTİK - %90 AĞIRLIK): Kullanıcının favori markaları: ${vehiclePrefs.brands.join(", ")}. 
KURAL: Araç önerirken önerilerinin EN AZ %90'ı bu markalardan olmalı. Kullanıcı spesifik bir marka sormadıysa, her zaman önce bu markalardan araç öner. 
Sadece kullanıcı açıkça farklı bir marka sorduğunda veya bu markalarda uygun araç yoksa başka markalara yönel.
Bu markalar dışından öneri yaparsan, mutlaka "Favori markalarınız dışından bir öneri:" şeklinde belirt.`;
      }
    }
    
    // Legacy persona support (for non-logged-in users or explicit selection)
    if (persona) {
      const personaDescriptions: Record<string, string> = {
        "Profesyonel Danışman": "Profesyonel ve resmi bir dil kullan, detaylı analizler sun.",
        "Teknik Uzman": "Teknik detaylara odaklan, motor özellikleri, tork, beygir gücü gibi verileri ön plana çıkar.",
        "Basit Anlatıcı": "Basit ve anlaşılır bir dil kullan, teknik terimleri açıkla.",
        "Sportif & Araç Tutkunu": "Heyecanlı ve tutkulu bir dil kullan, performans ve sürüş keyfi üzerine odaklan.",
      };
      contextPrompt += `\n\nKonuşma tarzı: ${personaDescriptions[persona] || persona}`;
    }

    // Legacy budgetFlex support (only if user settings don't have it)
    if (budgetFlex && (!userSettings || !userSettings.customizationEnabled)) {
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

    // Get the model with system instruction
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: contextPrompt
    });

    // Convert messages to Gemini format
    // Filter out welcome/system messages and ensure proper conversation structure
    const filteredMessages = messages.slice(0, -1).filter((msg: { role: string; content: string }) => {
      // Skip welcome messages (they start with "Merhaba!" from assistant)
      if (msg.role === "assistant" && msg.content.includes("Ben CarLytix AI asistanıyım")) {
        return false;
      }
      return true;
    });

    // Gemini requires the first message to be from user, not model
    // Find the first user message index and start from there
    const firstUserIndex = filteredMessages.findIndex((msg: { role: string }) => msg.role === "user");
    const validMessages = firstUserIndex >= 0 ? filteredMessages.slice(firstUserIndex) : [];

    const chatHistory = validMessages.map((msg: { role: string; content: string }) => ({
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
        maxOutputTokens: 8192,
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
          try {
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
          } catch (dbError) {
            console.error("Database save error:", dbError);
            // Continue even if database save fails - user already got the response
          }

          // Send final event with complete message
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, fullText, sessionId: chatSession.id })}\n\n`)
          );

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          
          // More detailed error messages
          let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
          
          if (error instanceof Error) {
            if (error.message.includes("SAFETY") || error.message.includes("blocked")) {
              errorMessage = "Güvenlik filtreleri nedeniyle yanıt oluşturulamadı. Lütfen farklı bir şekilde sormayı deneyin.";
            } else if (error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
              errorMessage = "API kotası aşıldı. Lütfen biraz bekleyip tekrar deneyin.";
            } else if (error.message.includes("timeout") || error.message.includes("DEADLINE_EXCEEDED")) {
              errorMessage = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
            } else if (error.message.includes("API key") || error.message.includes("INVALID_ARGUMENT")) {
              errorMessage = "API yapılandırma hatası. Lütfen yönetici ile iletişime geçin.";
            } else if (error.message.includes("network") || error.message.includes("fetch")) {
              errorMessage = "Bağlantı hatası oluştu. İnternet bağlantınızı kontrol edin.";
            }
            console.error("Error details:", error.message);
          }
          
          // If we have partial content, send it with the error
          if (fullText.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true, fullText: fullText + "\n\n_(Yanıt tamamlanamadı)_", sessionId: chatSession.id })}\n\n`)
            );
          } else {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
            );
          }
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
