import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

// GET - Fetch chat history (for logged-in users only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    
    // Check if user is logged in
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);
    
    // If not logged in, return empty (frontend will use localStorage)
    if (!userId) {
      return NextResponse.json({
        sessions: [],
        success: true,
        isGuest: true,
      });
    }

    // Get user's chat sessions with their first user message
    const sessions = await prisma.chatSession.findMany({
      where: {
        userId: userId,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: {
          take: 2, // Get first user message and first assistant response
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // Format sessions for frontend
    const formattedSessions = sessions
      .filter(session => session.messages.length > 0) // Only sessions with messages
      .map(session => {
        const firstUserMessage = session.messages.find(m => m.role === "user");
        const title = firstUserMessage 
          ? firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "..." : "")
          : "Yeni Sohbet";

        // Format date
        const now = new Date();
        const createdAt = new Date(session.createdAt);
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let dateStr = "Az önce";
        if (diffMins < 1) {
          dateStr = "Az önce";
        } else if (diffMins < 60) {
          dateStr = `${diffMins} dakika önce`;
        } else if (diffHours < 24) {
          dateStr = `${diffHours} saat önce`;
        } else if (diffDays < 7) {
          dateStr = `${diffDays} gün önce`;
        } else {
          dateStr = createdAt.toLocaleDateString("tr-TR");
        }

        return {
          id: session.id,
          title,
          date: dateStr,
          messageCount: session.messages.length,
          createdAt: session.createdAt,
        };
      });

    return NextResponse.json({
      sessions: formattedSessions,
      success: true,
    });
  } catch (error) {
    console.error("Chat history fetch error:", error);
    return NextResponse.json(
      { error: "Sohbet geçmişi yüklenemedi", success: false },
      { status: 500 }
    );
  }
}

// GET single session with all messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID gerekli", success: false },
        { status: 400 }
      );
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Sohbet bulunamadı", success: false },
        { status: 404 }
      );
    }

    // Format messages for frontend
    const messages = session.messages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    return NextResponse.json({
      session: {
        id: session.id,
        messages,
        persona: session.persona,
        budgetFlex: session.budgetFlex,
        priorityWeight: session.priorityWeight,
      },
      success: true,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json(
      { error: "Sohbet yüklenemedi", success: false },
      { status: 500 }
    );
  }
}
