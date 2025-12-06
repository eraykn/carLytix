"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, Bot, Menu, Columns2, Plus, MessageSquare, Settings, PenSquare, Search, Fuel, Zap, Car, Shield, Users, TrendingUp, Sun, Moon, Monitor, ChevronRight, ChevronDown, Palette, Brain, Wallet, Target, Trash2, User } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserProfileMenu } from "@/components/auth/UserProfileMenu";

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

const placeholderTexts = [
  "Aylık yakıt masrafımı azaltmak istiyorum",
  "Şehir içi kullanım için en mantıklı elektrikli araç hangisi?",
  "Uzun yolda konforlu bir araç öner",
  "1.5 milyon TL bütçeye en iyi SUV nedir?",
  "Performans öncelikli bir sedan bulmama yardım et",
  "Aile kullanımına uygun geniş bagajlı araba istiyorum",
  "Güvenliği yüksek araç önerisi istiyorum",
];

const toolCards = [
  { icon: Fuel, label: "Yakıt Tasarrufu", description: "En ekonomik araçları bul" },
  { icon: Zap, label: "Elektrikli Araçlar", description: "EV modelleri keşfet" },
  { icon: Car, label: "Araç Karşılaştır", description: "Modelleri yan yana incele" },
  { icon: Shield, label: "Güvenlik Analizi", description: "En güvenli araçlar" },
  { icon: Users, label: "Aile Araçları", description: "Geniş ve konforlu seçenekler" },
  { icon: TrendingUp, label: "Performans", description: "Güç ve hız odaklı modeller" },
];

export default function AIPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [aiPersona, setAiPersona] = useState<string>("Profesyonel Danışman");
  const [budgetFlex, setBudgetFlex] = useState<string>("+10%");
  const [priorityWeight, setPriorityWeight] = useState<string>("Güvenlik");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [displayedContent, setDisplayedContent] = useState<string>("");
  const [targetContent, setTargetContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name?: string; email: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    
    // Listen for login/logout events
    const handleUserChange = () => {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };
    
    window.addEventListener("storage", handleUserChange);
    window.addEventListener("userLoggedIn", handleUserChange);
    return () => {
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("userLoggedIn", handleUserChange);
    };
  }, []);

  // Mapping fonksiyonları - Tone <-> AI Persona
  const toneToPersona = (tone: string): string => {
    switch (tone) {
      case "Teknik": return "Teknik Uzman";
      case "Kurumsal": return "Profesyonel Danışman";
      case "Samimi": return "Sportif & Araç Tutkunu";
      default: return "Profesyonel Danışman";
    }
  };

  const personaToTone = (persona: string): string => {
    switch (persona) {
      case "Teknik Uzman": return "Teknik";
      case "Profesyonel Danışman": return "Kurumsal";
      case "Sportif & Araç Tutkunu": return "Samimi";
      case "Basit Anlatıcı": return "Samimi";
      default: return "Kurumsal";
    }
  };

  // Load AI settings from API
  useEffect(() => {
    const loadAISettings = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await fetch("/api/user/ai-settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            // Budget flexibility direkt aynı
            if (data.settings.budgetFlexibility) {
              setBudgetFlex(data.settings.budgetFlexibility);
            }
            // Tone'u persona'ya çevir
            if (data.settings.tone) {
              setAiPersona(toneToPersona(data.settings.tone));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load AI settings:", err);
      }
    };

    loadAISettings();

    // Dashboard'dan settings değişince yeniden yükle
    const handleSettingsChange = () => {
      loadAISettings();
    };
    window.addEventListener("aiSettingsUpdated", handleSettingsChange);
    return () => {
      window.removeEventListener("aiSettingsUpdated", handleSettingsChange);
    };
  }, []);

  // Save settings to API when changed
  const saveSettingToAPI = async (key: string, value: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      // Önce mevcut settings'i al
      const getResponse = await fetch("/api/user/ai-settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let currentSettings = {};
      if (getResponse.ok) {
        const data = await getResponse.json();
        if (data.success && data.settings) {
          currentSettings = data.settings;
        }
      }

      // Settings'i güncelle
      const updatedSettings = { ...currentSettings, [key]: value };

      await fetch("/api/user/ai-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSettings),
      });

      // Diğer sayfalara bildir
      window.dispatchEvent(new Event("aiSettingsUpdated"));
    } catch (err) {
      console.error("Failed to save setting:", err);
    }
  };

  // Handle persona change
  const handlePersonaChange = (persona: string) => {
    setAiPersona(persona);
    // Persona'yı tone'a çevirip API'ye kaydet
    const tone = personaToTone(persona);
    saveSettingToAPI("tone", tone);
  };

  // Handle budget flex change
  const handleBudgetFlexChange = (flex: string) => {
    setBudgetFlex(flex);
    saveSettingToAPI("budgetFlexibility", flex);
  };

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedContent]);

  // Typewriter effect - karakterleri soft bir şekilde göster
  useEffect(() => {
    if (targetContent.length > displayedContent.length) {
      setIsTyping(true);
      
      // Stream aktifken daha hızlı (çok karakter birden), bitince daha yavaş
      const charsToAdd = isLoading ? 5 : 3; // Stream aktifken 5, değilse 3 karakter
      const delay = isLoading ? 8 : 12; // Stream aktifken 8ms, değilse 12ms
      
      typewriterRef.current = setTimeout(() => {
        setDisplayedContent((prev) => {
          const nextLength = Math.min(prev.length + charsToAdd, targetContent.length);
          return targetContent.slice(0, nextLength);
        });
      }, delay);
      
      return () => {
        if (typewriterRef.current) {
          clearTimeout(typewriterRef.current);
        }
      };
    } else {
      setIsTyping(false);
    }
  }, [targetContent, displayedContent, isLoading]);

  // Check if light mode is active
  const isLightMode = theme === "light";

  // Welcome message for new chats
  const welcomeMessage = {
    role: "assistant" as const,
    content: "Merhaba! 👋 Ben CarLytix AI asistanıyım. Araç seçimi, karşılaştırma ve danışmanlık konularında size yardımcı olabilirim.\n\nSize nasıl yardımcı olabilirim? Bütçenizi, kullanım amacınızı veya tercihlerinizi paylaşabilirsiniz.",
  };

  // Fetch chat history from database on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch("/api/chat/history");
        const data = await response.json();
        
        if (data.success && data.sessions) {
          setChatHistory(data.sessions.map((session: { id: string; title: string; date: string; messageCount: number }) => ({
            id: session.id,
            title: session.title,
            date: session.date,
            messages: [], // Will be loaded when selected
          })));
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  // Theme-based color classes
  const themeColors = {
    // Backgrounds
    pageBg: isLightMode 
      ? "bg-gradient-to-br from-gray-50 via-white to-gray-100" 
      : "bg-[radial-gradient(ellipse_at_center,#1a1f2e_0%,#0f1419_100%)]",
    sidebarBg: isLightMode 
      ? "bg-white/95" 
      : "bg-[#0a0d12]/95",
    cardBg: isLightMode 
      ? "bg-gray-100/80 hover:bg-gray-200/80" 
      : "bg-white/[0.04] hover:bg-white/[0.08]",
    inputBg: isLightMode 
      ? "bg-white/90 border-gray-300 hover:border-gray-400" 
      : "bg-white/[0.08] border-white/[0.15] hover:border-white/[0.25]",
    settingsBg: isLightMode 
      ? "bg-white border-gray-200" 
      : "bg-[#0d1117] border-white/[0.1]",
    // Text colors
    textPrimary: isLightMode ? "text-gray-900" : "text-white",
    textSecondary: isLightMode ? "text-gray-600" : "text-[#d1d5db]",
    textMuted: isLightMode ? "text-gray-500" : "text-[#64748b]",
    textAccent: isLightMode ? "text-gray-700" : "text-[#94a3b8]",
    // Border colors
    borderColor: isLightMode ? "border-gray-200" : "border-white/[0.08]",
    borderHover: isLightMode ? "border-gray-300" : "border-white/[0.12]",
    // Icon colors
    iconColor: isLightMode ? "text-gray-500" : "text-[#64748b]",
    iconHover: isLightMode ? "text-gray-900" : "text-white",
    // Overlay
    overlayBg: isLightMode ? "bg-black/20" : "bg-black/30",
    // Hover states
    hoverBg: isLightMode ? "hover:bg-gray-100" : "hover:bg-white/[0.06]",
    activeBg: isLightMode ? "bg-blue-50 border-blue-200" : "bg-[#2db7f5]/20 border-[#2db7f5]/30",
    // Message bubbles
    userMessageBg: "bg-gradient-to-r from-[#2db7f5] to-[#0ea5d8] text-white",
    assistantMessageBg: isLightMode 
      ? "bg-gray-100 border-gray-200 text-gray-800" 
      : "bg-white/[0.08] border-white/[0.12] text-[#e2e8f0]",
    // Nav
    navBg: isLightMode 
      ? "bg-white/80 border-gray-200" 
      : "bg-white/[0.06] border-white/[0.12]",
  };

  // Rotating placeholder effect
  useEffect(() => {
    if (input || isFocused) return;
    
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [input, isFocused]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message and empty assistant message together
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);
    
    // Reset typewriter state
    setDisplayedContent("");
    setTargetContent("");

    // Prepare messages for API (without the empty assistant message)
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];

    try {
      // Get auth token if user is logged in
      const authToken = localStorage.getItem("auth_token");
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add authorization header if logged in
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: newMessages,
          persona: aiPersona,
          budgetFlex: budgetFlex,
          priorityWeight: priorityWeight,
          theme: theme,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Sunucu hatası: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                // Display error message to user instead of throwing
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: `Hata: ${data.error}`,
                  };
                  return updated;
                });
                break; // Stop processing stream
              }

              if (data.chunk) {
                // Append chunk to accumulated text
                accumulatedText += data.chunk;
                
                // Set target content for typewriter effect
                setTargetContent(accumulatedText);
                
                // Update the last message with full content (for state persistence)
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: accumulatedText,
                  };
                  return updated;
                });
              }

              if (data.done && data.sessionId && !sessionId) {
                // Save sessionId when streaming is complete
                setSessionId(data.sessionId);
              }
            } catch (parseError) {
              console.error("Failed to parse SSE data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([welcomeMessage]);
    setActiveChatId(null);
    setSessionId(null);
  };

  const handleSelectChat = async (chatId: string) => {
    try {
      // Veritabanından sohbet mesajlarını çek
      const response = await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: chatId }),
      });
      
      const data = await response.json();
      
      if (data.success && data.session) {
        // Mesajları doğru formata dönüştür
        const loadedMessages = data.session.messages.map((msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));
        
        setMessages(loadedMessages);
        setSessionId(chatId);
        setActiveChatId(chatId);
        
        // Kaydedilen ayarları geri yükle
        if (data.session.persona) setAiPersona(data.session.persona);
        if (data.session.budgetFlex !== undefined) setBudgetFlex(data.session.budgetFlex);
        if (data.session.priorityWeight) setPriorityWeight(data.session.priorityWeight);
      }
    } catch (error) {
      console.error("Sohbet yüklenirken hata:", error);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering chat selection
    
    try {
      const response = await fetch(`/api/chat/history/${chatId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
        
        // If deleted chat was active, clear current chat
        if (activeChatId === chatId) {
          setMessages([welcomeMessage]);
          setActiveChatId(null);
          setSessionId(null);
        }
      }
    } catch (error) {
      console.error("Sohbet silinirken hata:", error);
    }
  };

  const handleToolClick = (label: string) => {
    const queries: Record<string, string> = {
      "Yakıt Tasarrufu": "En az yakıt tüketen araçları göster",
      "Elektrikli Araçlar": "Elektrikli araç modellerini karşılaştır",
      "Araç Karşılaştır": "İki aracı karşılaştırmak istiyorum",
      "Güvenlik Analizi": "En güvenli araç modellerini göster",
      "Aile Araçları": "Aile için geniş ve güvenli araç öner",
      "Performans": "En yüksek performanslı araçları listele",
    };
    setInput(queries[label] || "");
  };

  return (
    <div className={`fixed inset-0 flex overflow-hidden transition-colors duration-300 ${themeColors.pageBg}`}>
      {/* Noise texture overlay - hidden in light mode */}
      {!isLightMode && (
        <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')] pointer-events-none z-0" />
      )}

      {/* Grid pattern - adjusted for light mode */}
      <div className={`absolute inset-0 ${isLightMode ? 'opacity-[0.03]' : 'opacity-[0.02]'} bg-[linear-gradient(to_right,${isLightMode ? '#000000' : '#ffffff'}_1px,transparent_1px),linear-gradient(to_bottom,${isLightMode ? '#000000' : '#ffffff'}_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0`} />

      {/* Pulsating glow - adjusted for light mode */}
      <motion.div
        animate={{
          opacity: isLightMode ? [0.05, 0.1, 0.05] : [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${isLightMode ? 'bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)]'} blur-3xl pointer-events-none z-0`}
      />

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className={`fixed inset-0 ${themeColors.overlayBg} z-25`}
          />
        )}
      </AnimatePresence>

      {/* Combined Sidebar - Expands when open */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          width: sidebarOpen ? 280 : 56
        }}
        transition={{ 
          opacity: { delay: 0.2, duration: 0.6 },
          x: { delay: 0.2, duration: 0.6 },
          width: { type: "spring", damping: 25, stiffness: 200 }
        }}
        className={`fixed left-0 top-0 h-full ${themeColors.sidebarBg} backdrop-blur-xl border-r ${themeColors.borderColor} z-30 flex flex-col transition-colors duration-300`}
      >
        {/* Header Area */}
        <div className={`flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center'} py-4 border-b ${themeColors.borderColor}`}>
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Sidebar Aç/Kapat"
            className={`p-3 rounded-xl ${themeColors.hoverBg} transition-colors group flex-shrink-0`}
          >
            <Columns2 className={`w-5 h-5 transition-colors ${sidebarOpen ? themeColors.textPrimary : `${themeColors.iconColor} group-hover:${themeColors.iconHover}`}`} />
          </button>
          
          {/* Title - only when expanded */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-sm font-semibold ${themeColors.textPrimary}`}
              >
                Sohbetler
              </motion.span>
            )}
          </AnimatePresence>
          
          {sidebarOpen && <div className="w-11" />}
        </div>

        {/* Top Icons / New Chat */}
        <div className={`flex flex-col ${sidebarOpen ? 'px-3' : 'items-center'} py-3 gap-1`}>
          {/* New Chat */}
          {sidebarOpen ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNewChat}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border ${isLightMode ? 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-400' : 'border-white/[0.12] bg-white/[0.04] text-[#d1d5db] hover:bg-white/[0.08] hover:border-white/[0.2]'} font-medium transition-all text-sm`}
            >
              <Plus className="w-4 h-4" />
              Yeni Sohbet
            </motion.button>
          ) : (
            <button
              onClick={handleNewChat}
              aria-label="Yeni Sohbet"
              className={`p-3 rounded-xl ${themeColors.hoverBg} transition-colors group`}
            >
              <PenSquare className={`w-5 h-5 ${themeColors.iconColor} group-hover:${themeColors.iconHover} transition-colors`} />
            </button>
          )}

          {/* Search - only icon when collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => { setSidebarOpen(true); setShowSearch(true); }}
              aria-label="Ara"
              className={`p-3 rounded-xl ${themeColors.hoverBg} transition-colors group`}
            >
              <Search className={`w-5 h-5 ${themeColors.iconColor} group-hover:${themeColors.iconHover} transition-colors`} />
            </button>
          )}

          {/* Chat History Icon - only when collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => { setSidebarOpen(true); setShowSearch(false); }}
              aria-label="Sohbet Geçmişi"
              className={`p-3 rounded-xl ${themeColors.hoverBg} transition-colors group`}
            >
              <MessageSquare className={`w-5 h-5 ${themeColors.iconColor} group-hover:${themeColors.iconHover} transition-colors`} />
            </button>
          )}
        </div>

        {/* Chat History List - only when expanded */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto px-3"
            >
              <h3 className={`text-xs font-semibold ${themeColors.textMuted} uppercase tracking-wider mb-2 px-1`}>
                Son Sohbetler
              </h3>
              
              {/* Search Input */}
              <div className="relative mb-3">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${themeColors.textMuted}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sohbetlerde ara..."
                  autoFocus={showSearch}
                  className={`w-full ${isLightMode ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-400' : 'bg-white/[0.04] border-white/[0.08] text-white placeholder-[#64748b] focus:border-white/[0.2]'} border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none transition-colors`}
                />
              </div>
              
              <div className="space-y-0.5">
                {chatHistory
                  .filter((chat) => 
                    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chat.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all group cursor-pointer ${
                      activeChatId === chat.id
                        ? themeColors.activeBg
                        : `${themeColors.hoverBg} hover:${isLightMode ? 'bg-gray-100' : 'bg-white/[0.06]'}`
                    }`}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <MessageSquare className={`w-4 h-4 ${activeChatId === chat.id ? 'text-[#2db7f5]' : themeColors.textMuted} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${themeColors.textPrimary} truncate leading-tight`}>{chat.title}</p>
                      <p className={`text-[11px] ${themeColors.textMuted} leading-tight`}>{chat.date}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ${isLightMode ? 'hover:bg-red-100 text-red-500' : 'hover:bg-red-500/20 text-red-400'}`}
                      title="Sohbeti Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
                {chatHistory.length === 0 && (
                  <div className={`flex flex-col items-center justify-center py-8 ${themeColors.textMuted}`}>
                    <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm">Henüz sohbet yok</p>
                    <p className="text-xs opacity-60 mt-1">Yeni bir sohbet başlatın</p>
                  </div>
                )}
                {chatHistory.length > 0 && searchQuery && chatHistory.filter((chat) => 
                    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chat.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).length === 0 && (
                  <div className={`flex flex-col items-center justify-center py-6 ${themeColors.textMuted}`}>
                    <Search className="w-6 h-6 mb-2 opacity-40" />
                    <p className="text-sm">Sonuç bulunamadı</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom - Profile & Settings */}
        <div className={`mt-auto border-t ${themeColors.borderColor} ${sidebarOpen ? 'p-3 space-y-2' : 'py-4 flex flex-col items-center gap-2'}`}>
          {/* Profile Section */}
          <UserProfileMenu 
            onOpenAuthModal={() => setIsAuthModalOpen(true)} 
            expanded={sidebarOpen}
            isLightMode={isLightMode}
            onCollapsedClick={() => setSidebarOpen(true)}
          />
          
          {/* Settings Button */}
          {sidebarOpen ? (
            <button 
              onClick={() => {
                if (settingsOpen) {
                  setSettingsOpen(false);
                } else {
                  setSettingsOpen(true);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${themeColors.hoverBg} transition-colors ${themeColors.textSecondary}`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Ayarlar</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${settingsOpen ? 'rotate-90' : ''}`} />
            </button>
          ) : (
            <button
              onClick={() => { setSidebarOpen(true); setSettingsOpen(true); }}
              aria-label="Ayarlar"
              className={`p-3 rounded-xl ${themeColors.hoverBg} transition-colors group`}
            >
              <Settings className={`w-5 h-5 ${themeColors.iconColor} group-hover:${themeColors.iconHover} transition-colors`} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Settings Panel Backdrop - Click outside to close */}
      <AnimatePresence>
        {settingsOpen && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSettingsOpen(false); setActiveSubmenu(null); }}
            className="fixed inset-0 z-[45]"
          />
        )}
      </AnimatePresence>

      {/* Settings Panel - Rendered outside sidebar to avoid overflow issues */}
      <AnimatePresence>
        {settingsOpen && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed left-[12px] bottom-[70px] w-[256px] ${themeColors.settingsBg} rounded-xl shadow-2xl z-[50]`}
          >
            <div className="p-3 space-y-1">
              {/* Theme Setting */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveSubmenu('theme')}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${themeColors.hoverBg} transition-colors ${themeColors.textSecondary}`}>
                  <Palette className="w-4 h-4" />
                  <span className="text-sm">Theme</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                {/* Theme Submenu */}
                <AnimatePresence>
                  {activeSubmenu === 'theme' && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`absolute left-full top-0 ml-2 w-40 ${themeColors.settingsBg} rounded-xl shadow-2xl z-[100]`}
                    >
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => setTheme("light")}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            theme === "light" ? `${isLightMode ? 'bg-gray-200 text-gray-900' : 'bg-white/[0.1] text-white'}` : `${themeColors.textAccent} ${themeColors.hoverBg} hover:${themeColors.textPrimary}`
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          <span>Light</span>
                          {theme === "light" && <span className="ml-auto w-2 h-2 rounded-full bg-[#2db7f5]" />}
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            theme === "dark" ? `${isLightMode ? 'bg-gray-200 text-gray-900' : 'bg-white/[0.1] text-white'}` : `${themeColors.textAccent} ${themeColors.hoverBg} hover:${themeColors.textPrimary}`
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                          <span>Dark</span>
                          {theme === "dark" && <span className="ml-auto w-2 h-2 rounded-full bg-[#2db7f5]" />}
                        </button>
                        <button
                          onClick={() => setTheme("system")}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            theme === "system" ? `${isLightMode ? 'bg-gray-200 text-gray-900' : 'bg-white/[0.1] text-white'}` : `${themeColors.textAccent} ${themeColors.hoverBg} hover:${themeColors.textPrimary}`
                          }`}
                        >
                          <Monitor className="w-4 h-4" />
                          <span>System</span>
                          {theme === "system" && <span className="ml-auto w-2 h-2 rounded-full bg-[#2db7f5]" />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Persona Setting */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveSubmenu('persona')}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${themeColors.hoverBg} transition-colors ${themeColors.textSecondary}`}>
                  <Brain className="w-4 h-4" />
                  <span className="text-sm">AI Persona</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                {/* AI Persona Submenu */}
                <AnimatePresence>
                  {activeSubmenu === 'persona' && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`absolute left-full top-0 ml-2 w-52 ${themeColors.settingsBg} rounded-xl shadow-2xl z-[100]`}
                    >
                      <div className="p-2 space-y-1">
                        {["Profesyonel Danışman", "Teknik Uzman", "Basit Anlatıcı", "Sportif & Araç Tutkunu"].map((persona) => (
                          <button
                            key={persona}
                            onClick={() => handlePersonaChange(persona)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              aiPersona === persona ? `${isLightMode ? 'bg-gray-200 text-gray-900' : 'bg-white/[0.1] text-white'}` : `${themeColors.textAccent} ${themeColors.hoverBg} hover:${themeColors.textPrimary}`
                            }`}
                          >
                            <span>{persona}</span>
                            {aiPersona === persona && <span className="ml-auto w-2 h-2 rounded-full bg-[#2db7f5]" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Budget Flexibility Setting */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveSubmenu('budget')}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${themeColors.hoverBg} transition-colors ${themeColors.textSecondary}`}>
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">Budget Flexibility</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                {/* Budget Flexibility Submenu */}
                <AnimatePresence>
                  {activeSubmenu === 'budget' && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`absolute left-full top-0 ml-2 w-36 ${themeColors.settingsBg} rounded-xl shadow-2xl z-[100]`}
                    >
                      <div className="p-2 space-y-1">
                        {["+5%", "+10%", "+20%"].map((flex) => (
                          <button
                            key={flex}
                            onClick={() => handleBudgetFlexChange(flex)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              budgetFlex === flex ? `${isLightMode ? 'bg-gray-200 text-gray-900' : 'bg-white/[0.1] text-white'}` : `${themeColors.textAccent} ${themeColors.hoverBg} hover:${themeColors.textPrimary}`
                            }`}
                          >
                            <span>{flex}</span>
                            {budgetFlex === flex && <span className="ml-auto w-2 h-2 rounded-full bg-[#2db7f5]" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Priority Weight Setting */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveSubmenu('priority')}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${themeColors.hoverBg} transition-colors ${themeColors.textSecondary}`}>
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Priority Weight</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                {/* Priority Weight Submenu - Opens upward to fit screen */}
                <AnimatePresence>
                  {activeSubmenu === 'priority' && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`absolute left-full bottom-0 ml-2 w-44 ${themeColors.settingsBg} rounded-xl shadow-2xl z-[100]`}
                    >
                      <div className="p-2 space-y-1">
                        {["Güvenlik", "Performans", "Teknoloji", "Uygun Bakım"].map((priority) => (
                          <button
                            key={priority}
                            onClick={() => setPriorityWeight(priority)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              priorityWeight === priority ? `${isLightMode ? 'bg-gray-200 text-gray-900' : 'bg-white/[0.1] text-white'}` : `${themeColors.textAccent} ${themeColors.hoverBg} hover:${themeColors.textPrimary}`
                            }`}
                          >
                            <span>{priority}</span>
                            {priorityWeight === priority && <span className="ml-auto w-2 h-2 rounded-full bg-[#2db7f5]" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col relative z-10"
        animate={{ marginLeft: sidebarOpen ? 280 : 56 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Top Left Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-8 left-6 z-20"
        >
          <a href="/" aria-label="Ana Sayfa" className="flex items-center gap-2">
            <Image
              src="/images/brands/carlytix-concept-a-logo.svg"
              alt="CarLytix Logo"
              width={220}
              height={55}
              className="h-[55px] w-auto drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            />
          </a>
        </motion.div>

        {/* Center - CarLytix AI Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex"
        >
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${themeColors.navBg} backdrop-blur-[16px] border ${themeColors.borderColor}`}>
            <span className={`text-sm font-semibold ${themeColors.textPrimary}`}>CarLytix AI</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs text-green-400 font-medium">Live</span>
            </div>
          </div>
        </motion.div>

        {/* Top Right Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`absolute top-8 z-20 hidden md:flex items-center gap-8 px-6 py-3 rounded-xl ${themeColors.navBg} backdrop-blur-[16px] border transition-colors duration-300`}
          style={{ right: 'calc(2.5rem + 52px)' }}
        >
          {/* Regular nav items */}
          {[
            { name: "Main Menu", href: "/" },
            { name: "Compare", href: "/compare" },
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`text-sm transition-colors duration-300 relative group ${themeColors.textSecondary} hover:text-[#3b82f6]`}
            >
              {item.name}
              <span className="absolute bottom-[-8px] left-0 h-0.5 bg-[#3b82f6] transition-all duration-300 w-0 group-hover:w-full" />
            </motion.a>
          ))}

          {/* CarLytix AI Dropdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative group"
          >
            <a
              href="/ai"
              className="text-sm transition-colors duration-300 relative flex items-center gap-1 text-[#0ea5d8]"
            >
              CarLytix AI
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              <span className="absolute bottom-[-8px] left-0 h-0.5 bg-[#3b82f6] transition-all duration-300 w-full" />
            </a>
            {/* Dropdown Menu */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
              <div className={`${themeColors.settingsBg} backdrop-blur-xl rounded-xl border ${themeColors.borderColor} shadow-2xl overflow-hidden min-w-[160px]`}>
                <a
                  href="/ai"
                  className={`flex items-center gap-2 px-4 py-3 text-sm ${themeColors.textSecondary} hover:text-[#0ea5d8] ${themeColors.hoverBg} transition-colors border-b ${themeColors.borderColor}`}
                >
                  <Bot className="w-4 h-4" />
                  CarLytix AI
                </a>
                <a
                  href="/assistant"
                  className={`flex items-center gap-2 px-4 py-3 text-sm ${themeColors.textSecondary} hover:text-[#0ea5d8] ${themeColors.hoverBg} transition-colors`}
                >
                  <Car className="w-4 h-4" />
                  CarLytix Match
                </a>
              </div>
            </div>
          </motion.div>

          {/* About Us */}
          <motion.a
            href="/aboutus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-sm transition-colors duration-300 relative group ${themeColors.textSecondary} hover:text-[#3b82f6]`}
          >
            About Us
            <span className="absolute bottom-[-8px] left-0 h-0.5 bg-[#3b82f6] transition-all duration-300 w-0 group-hover:w-full" />
          </motion.a>
        </motion.nav>

        {/* Profile Menu - Right side of nav */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute top-8 z-20 hidden md:block"
          style={{ right: '2.5rem' }}
        >
          <UserProfileMenu onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        </motion.div>

        {/* Auth Modal */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`absolute top-8 right-10 z-20 md:hidden p-2 rounded-lg ${isLightMode ? 'bg-gray-100 border-gray-200 hover:bg-gray-200' : 'bg-white/[0.08] border-white/[0.15] hover:bg-white/[0.18]'} backdrop-blur-xl border transition-colors`}
        >
          <Menu className={`w-6 h-6 ${themeColors.textSecondary}`} />
        </motion.button>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4 overflow-hidden">
          {messages.length === 0 ? (
            /* Initial State - Centered Chat Interface */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* Title */}
              <h1 className={`text-3xl md:text-4xl font-semibold ${themeColors.textPrimary} mb-8`}>
                Size nasıl yardımcı olabilirim?
              </h1>

              {/* Chat Input with Animated Placeholder */}
              <div className="w-full max-w-2xl relative mb-4">
                <div className={`flex items-center gap-3 p-3 rounded-2xl backdrop-blur-xl transition-colors ${isLightMode ? 'bg-white/90 border border-gray-300 hover:border-gray-400' : 'bg-white/[0.08] border border-white/[0.15] hover:border-white/[0.25]'}`}>
                  <div className="flex-1 relative h-[40px] flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      title="Sorunuzu yazın"
                      aria-label="Chat mesajı"
                      className={`absolute inset-0 bg-transparent px-0 py-2 ${themeColors.textPrimary} focus:outline-none text-base`}
                    />
                    {/* Animated Placeholder */}
                    {!input && !isFocused && (
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentPlaceholder}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className={`${themeColors.textMuted} pointer-events-none text-base whitespace-nowrap`}
                        >
                          {placeholderTexts[currentPlaceholder]}
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    title="Mesaj Gönder"
                    className={`p-2.5 rounded-xl ${isLightMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-white/[0.15] text-white hover:bg-white/[0.25]'} transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <p className={`${themeColors.textMuted} text-xs mb-8`}>
                CarLytix AI, araç verilerine dayalı öneriler sunar. Kesin bilgi için üreticiye danışın.
              </p>

              {/* Tool Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
                {toolCards.map((tool, index) => (
                  <motion.button
                    key={tool.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => handleToolClick(tool.label)}
                    className={`flex items-center gap-3 p-4 rounded-xl ${themeColors.cardBg} border ${themeColors.borderColor} ${themeColors.borderHover} transition-all text-left group`}
                  >
                    <div className={`p-2 rounded-lg ${isLightMode ? 'bg-gray-200 group-hover:bg-blue-100' : 'bg-white/[0.06] group-hover:bg-[#2db7f5]/20'} transition-colors`}>
                      <tool.icon className={`w-5 h-5 ${themeColors.textAccent} group-hover:text-[#2db7f5] transition-colors`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${themeColors.textPrimary} truncate`}>{tool.label}</p>
                      <p className={`text-xs ${themeColors.textMuted} truncate`}>{tool.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Chat Messages View */
            <div className="w-full h-full flex flex-col pt-28 pb-6 min-h-0">
              {/* Messages Area */}
              <div className={`flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-0 ${isLightMode ? 'chat-scrollbar chat-scrollbar-light' : 'chat-scrollbar'}`}>
                {messages.map((message, index) => {
                  // Skip rendering empty assistant messages (streaming placeholder)
                  const isLastMessage = index === messages.length - 1;
                  const isEmptyAssistant = message.role === "assistant" && message.content === "";
                  
                  // Show loading indicator instead of empty assistant message
                  if (isEmptyAssistant && isLastMessage && isLoading) {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#2db7f5] to-[#0ea5d8] flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className={`${themeColors.assistantMessageBg} border px-4 py-3 rounded-2xl`}>
                          <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-[#2db7f5] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-[#2db7f5] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-[#2db7f5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                  
                  // Don't render empty messages
                  if (isEmptyAssistant) return null;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#2db7f5] to-[#0ea5d8] flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                          message.role === "user"
                            ? themeColors.userMessageBg
                            : themeColors.assistantMessageBg
                        } border`}
                      >
                        {message.role === "assistant" ? (
                          <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm, remarkBreaks]}
                              rehypePlugins={[rehypeRaw]}
                              components={{
                                // Tablo stilleri
                                table: ({children}) => (
                                  <div className="overflow-x-auto my-3 rounded-lg border border-white/10">
                                    <table className="min-w-full border-collapse text-xs">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({children}) => (
                                  <thead className="bg-[#2db7f5]/20">
                                    {children}
                                  </thead>
                                ),
                                th: ({children}) => (
                                  <th className="px-3 py-2 text-left font-semibold text-[#2db7f5] border-b border-white/10">
                                    {children}
                                  </th>
                                ),
                                td: ({children}) => (
                                  <td className="px-3 py-2 border-b border-white/5">
                                    {children}
                                  </td>
                                ),
                                tr: ({children}) => (
                                  <tr className="hover:bg-white/5 transition-colors">
                                    {children}
                                  </tr>
                                ),
                                // Kod blokları
                                code: ({className, children, ...props}) => {
                                  const isInline = !className;
                                  return isInline ? (
                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#2db7f5] text-xs font-mono" {...props}>
                                      {children}
                                    </code>
                                  ) : (
                                    <code className="block bg-black/30 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                pre: ({children}) => (
                                  <pre className="bg-black/30 rounded-lg overflow-x-auto my-2">
                                    {children}
                                  </pre>
                                ),
                                // Listeler
                                ul: ({children}) => (
                                  <ul className="list-disc list-inside space-y-1 my-2">
                                    {children}
                                  </ul>
                                ),
                                ol: ({children}) => (
                                  <ol className="list-decimal list-inside space-y-1 my-2">
                                    {children}
                                  </ol>
                                ),
                                // Başlıklar
                                h1: ({children}) => (
                                  <h1 className="text-xl font-bold mt-4 mb-2 text-[#2db7f5]">
                                    {children}
                                  </h1>
                                ),
                                h2: ({children}) => (
                                  <h2 className="text-lg font-bold mt-3 mb-2 text-[#2db7f5]">
                                    {children}
                                  </h2>
                                ),
                                h3: ({children}) => (
                                  <h3 className="text-base font-semibold mt-2 mb-1 text-[#2db7f5]">
                                    {children}
                                  </h3>
                                ),
                                // Paragraf ve diğerleri
                                p: ({children}) => (
                                  <p className="my-1.5 leading-relaxed">
                                    {children}
                                  </p>
                                ),
                                strong: ({children}) => (
                                  <strong className="font-semibold text-white">
                                    {children}
                                  </strong>
                                ),
                                em: ({children}) => (
                                  <em className="italic text-white/90">
                                    {children}
                                  </em>
                                ),
                                blockquote: ({children}) => (
                                  <blockquote className="border-l-4 border-[#2db7f5] pl-4 my-2 italic text-white/80">
                                    {children}
                                  </blockquote>
                                ),
                                a: ({href, children}) => (
                                  <a href={href} className="text-[#2db7f5] hover:underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                  </a>
                                ),
                                hr: () => (
                                  <hr className="border-white/20 my-4" />
                                ),
                              }}
                            >
                              {/* Son mesaj ve typing aktifse displayedContent göster, değilse normal content */}
                              {isLastMessage && message.role === "assistant" && (isTyping || isLoading) 
                                ? displayedContent 
                                : message.content}
                            </ReactMarkdown>
                            {/* Typing cursor - sadece son mesajda ve typing aktifken göster */}
                            {isLastMessage && message.role === "assistant" && isTyping && (
                              <span className="inline-block w-0.5 h-4 bg-[#2db7f5] ml-0.5 animate-pulse" />
                            )}
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isLightMode ? 'bg-gray-300' : 'bg-slate-700'} flex items-center justify-center`}>
                          <User className={`w-5 h-5 ${isLightMode ? 'text-gray-600' : 'text-white'}`} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area for Active Chat */}
              <div className="w-full max-w-2xl mx-auto">
                <div className={`flex items-center gap-3 p-3 rounded-2xl backdrop-blur-xl transition-colors ${isLightMode ? 'bg-white/90 border border-gray-300 hover:border-gray-400' : 'bg-white/[0.08] border border-white/[0.15] hover:border-white/[0.25]'}`}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Bir soru sorun..."
                    className={`flex-1 bg-transparent px-3 py-2 ${themeColors.textPrimary} ${isLightMode ? 'placeholder-gray-500' : 'placeholder-[#64748b]'} focus:outline-none text-base`}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    title="Mesaj Gönder"
                    className={`p-2.5 rounded-xl ${isLightMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-white/[0.15] text-white hover:bg-white/[0.25]'} transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className={`text-center ${themeColors.textMuted} text-xs mt-3`}>
                  CarLytix AI, araç verilerine dayalı öneriler sunar. Kesin bilgi için üreticiye danışın.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
