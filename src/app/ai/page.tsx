"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Send, Bot, User, Menu, Columns2, Plus, MessageSquare, Settings, PenSquare, Search, Fuel, Zap, Car, Shield, Users, TrendingUp, Sun, Moon, Monitor, ChevronRight, Palette, Brain, Wallet, Target } from "lucide-react";
import Image from "next/image";

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

  // Check if light mode is active
  const isLightMode = theme === "light";

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
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulated AI response - Replace with actual API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Merhaba! Ben CarLytix AI asistanıyım. Araçlar hakkında sorularınızı yanıtlamak için buradayım. Size nasıl yardımcı olabilirim?",
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleNewChat = () => {
    // Mevcut sohbeti kaydet (eğer mesaj varsa)
    if (messages.length > 0) {
      const firstUserMessage = messages.find(m => m.role === "user");
      const chatTitle = firstUserMessage 
        ? firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "..." : "")
        : "Yeni Sohbet";
      
      const newChatHistory: ChatHistory = {
        id: Date.now().toString(),
        title: chatTitle,
        date: "Az önce",
        messages: [...messages],
      };
      
      setChatHistory((prev) => [newChatHistory, ...prev]);
    }
    
    // Yeni sohbet başlat
    setMessages([]);
    setActiveChatId(null);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistory.find(c => c.id === chatId);
    if (selectedChat) {
      // Mevcut sohbeti kaydet (eğer mesaj varsa ve farklı bir sohbet seçiliyorsa)
      if (messages.length > 0 && activeChatId !== chatId) {
        const firstUserMessage = messages.find(m => m.role === "user");
        const chatTitle = firstUserMessage 
          ? firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? "..." : "")
          : "Yeni Sohbet";
        
        if (activeChatId) {
          // Mevcut aktif sohbeti güncelle
          setChatHistory((prev) => prev.map(c => 
            c.id === activeChatId 
              ? { ...c, messages: [...messages], title: chatTitle }
              : c
          ));
        } else {
          // Yeni sohbet olarak kaydet
          const newChatHistory: ChatHistory = {
            id: Date.now().toString(),
            title: chatTitle,
            date: "Az önce",
            messages: [...messages],
          };
          setChatHistory((prev) => [newChatHistory, ...prev]);
        }
      }
      
      setMessages(selectedChat.messages);
      setActiveChatId(chatId);
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
              
              <div className="space-y-1">
                {chatHistory
                  .filter((chat) => 
                    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chat.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((chat) => (
                  <motion.button
                    key={chat.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                      activeChatId === chat.id
                        ? themeColors.activeBg
                        : themeColors.hoverBg
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 ${themeColors.textAccent} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${themeColors.textPrimary} truncate`}>{chat.title}</p>
                      <p className={`text-xs ${themeColors.textMuted}`}>{chat.date}</p>
                    </div>
                  </motion.button>
                ))}
                {chatHistory.length === 0 && (
                  <p className={`text-sm ${themeColors.textMuted} text-center py-4`}>Henüz sohbet yok</p>
                )}
                {chatHistory.length > 0 && searchQuery && chatHistory.filter((chat) => 
                    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chat.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).length === 0 && (
                  <p className={`text-sm ${themeColors.textMuted} text-center py-4`}>Sonuç bulunamadı</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom - Settings */}
        <div className={`mt-auto border-t ${themeColors.borderColor} ${sidebarOpen ? 'p-3' : 'py-4 flex justify-center'}`}>
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
                            onClick={() => setAiPersona(persona)}
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
                            onClick={() => setBudgetFlex(flex)}
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

        {/* Top Right Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`absolute top-8 right-10 z-20 hidden md:flex items-center gap-8 px-6 py-3 rounded-xl ${themeColors.navBg} backdrop-blur-[16px] border transition-colors duration-300`}
        >
          {[
            { name: "Main Menu", href: "/" },
            { name: "Compare", href: "/compare" },
            { name: "CarLytix Match", href: "/assistant" },
            { name: "CarLytix AI", href: "/ai" },
            { name: "About Us", href: "/aboutus" },
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`text-sm transition-colors duration-300 relative group ${
                item.href === "/ai"
                  ? "text-[#0ea5d8]"
                  : `${themeColors.textSecondary} hover:text-[#3b82f6]`
              }`}
            >
              {item.name}
              <span
                className={`absolute bottom-[-8px] left-0 h-0.5 bg-[#3b82f6] transition-all duration-300 ${
                  item.href === "/ai" ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </motion.a>
          ))}
        </motion.nav>

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
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4">
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
                <div className={`flex items-center gap-3 p-3 rounded-2xl ${themeColors.inputBg} backdrop-blur-xl border transition-colors`}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    title="Sorunuzu yazın"
                    aria-label="Chat mesajı"
                    className={`flex-1 bg-transparent px-3 py-2 ${themeColors.textPrimary} focus:outline-none text-base`}
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
                        className={`absolute left-6 top-1/2 -translate-y-1/2 ${themeColors.textMuted} pointer-events-none text-base`}
                      >
                        {placeholderTexts[currentPlaceholder]}
                      </motion.span>
                    </AnimatePresence>
                  )}
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
            <div className="w-full h-full flex flex-col pt-28 pb-6">
              {/* Messages Area */}
              <div className={`flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin ${isLightMode ? 'scrollbar-thumb-gray-400' : 'scrollbar-thumb-slate-700'} scrollbar-track-transparent`}>
                {messages.map((message, index) => (
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
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isLightMode ? 'bg-gray-300' : 'bg-slate-700'} flex items-center justify-center`}>
                        <User className={`w-5 h-5 ${isLightMode ? 'text-gray-600' : 'text-white'}`} />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                )}
              </div>

              {/* Input Area for Active Chat */}
              <div className="w-full max-w-2xl mx-auto">
                <div className={`flex items-center gap-3 p-3 rounded-2xl ${themeColors.inputBg} backdrop-blur-xl border transition-colors`}>
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
