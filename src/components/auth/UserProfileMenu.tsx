"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, UserCog, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { DashboardModal } from "./DashboardModal";

interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
}

interface UserProfileMenuProps {
  onOpenAuthModal: () => void;
  className?: string;
  expanded?: boolean;
  isLightMode?: boolean;
  onCollapsedClick?: () => void;
}

// Generate consistent gradient based on email - shared utility
const getGradientForEmail = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const gradients = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-green-400 via-cyan-500 to-blue-500",
    "from-purple-500 via-pink-500 to-red-500",
    "from-yellow-400 via-orange-500 to-red-500",
    "from-blue-400 via-purple-500 to-pink-500",
    "from-teal-400 via-cyan-500 to-blue-500",
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-rose-400 via-fuchsia-500 to-indigo-500",
  ];
  
  return gradients[Math.abs(hash) % gradients.length];
};

// Vercel-style gradient avatar
const GradientAvatar = ({ name, email }: { name?: string; email: string }) => {
  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : email[0].toUpperCase();

  return (
    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getGradientForEmail(email)} flex items-center justify-center text-white text-[10px] font-semibold shadow-md`}>
      {initials}
    </div>
  );
};

export function UserProfileMenu({ onOpenAuthModal, className = "", expanded = false, isLightMode = false, onCollapsedClick }: UserProfileMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardInitialPanel, setDashboardInitialPanel] = useState<'main' | 'account'>('main');
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Check for logged in user
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    checkUser();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      checkUser();
    };

    // Listen for custom login event (same tab)
    const handleUserLoggedIn = () => {
      checkUser();
    };

    // Listen for user profile updates (avatar, name changes)
    const handleUserUpdated = () => {
      checkUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    window.addEventListener("userUpdated", handleUserUpdated);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    window.location.reload();
  };

  if (!mounted) return null;

  // Not logged in - show login button
  if (!user) {
    if (expanded) {
      return (
        <button
          onClick={onOpenAuthModal}
          aria-label="Giriş Yap"
          title="Giriş Yap"
          className={`w-full flex items-center gap-3 p-3 rounded-xl ${isLightMode ? 'bg-gray-100 border-gray-200 hover:border-gray-300' : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'} border transition-all duration-300 cursor-pointer ${className}`}
        >
          <div className={`w-9 h-9 rounded-lg ${isLightMode ? 'bg-gray-200' : 'bg-white/[0.08]'} flex items-center justify-center flex-shrink-0`}>
            <svg className={`w-4 h-4 ${isLightMode ? 'text-gray-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className={`text-sm font-medium ${isLightMode ? 'text-gray-900' : 'text-white'}`}>Misafir</p>
            <p className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors">Giriş Yap</p>
          </div>
        </button>
      );
    }
    return (
      <button
        onClick={onOpenAuthModal}
        aria-label="Giriş Yap"
        title="Giriş Yap"
        className={`flex items-center p-2 rounded-lg ${isLightMode ? 'bg-gray-100 border-gray-200 hover:border-gray-400' : 'bg-white/[0.06] backdrop-blur-[16px] border-white/[0.12] hover:border-[#3b82f6]/50'} border transition-all duration-300 group cursor-pointer ${className}`}
      >
        <div className={`w-7 h-7 rounded-full ${isLightMode ? 'bg-gray-200' : 'bg-gradient-to-br from-slate-600 to-slate-700'} flex items-center justify-center`}>
          <svg className={`w-3.5 h-3.5 ${isLightMode ? 'text-gray-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </button>
    );
  }

  // Logged in - show profile menu
  const handleButtonClick = () => {
    // Sidebar kapalıyken ve onCollapsedClick varsa, sidebar'ı aç
    if (!expanded && onCollapsedClick) {
      onCollapsedClick();
      // Sidebar açıldıktan sonra menüyü aç
      setTimeout(() => setIsOpen(true), 150);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={menuRef} className={`relative ${expanded ? 'w-full' : ''} ${className}`}>
      <button
        onClick={handleButtonClick}
        aria-label="Profil Menüsü"
        title="Profil Menüsü"
        className={expanded 
          ? `w-full flex items-center gap-3 p-3 rounded-xl ${isLightMode ? 'bg-gray-100 border-gray-200 hover:border-gray-300' : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'} border transition-all duration-300 cursor-pointer`
          : `flex items-center p-2 rounded-lg ${isLightMode ? 'bg-gray-100 border-gray-200 hover:border-gray-400' : 'bg-white/[0.06] backdrop-blur-[16px] border-white/[0.12] hover:border-[#3b82f6]/50'} border transition-all duration-300 group cursor-pointer`
        }
      >
        {expanded ? (
          <>
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getGradientForEmail(user.email)} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
              {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className={`text-sm font-medium truncate ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                {user.name || user.email}
              </p>
              {user.name && (
                <p className={`text-xs truncate ${isLightMode ? 'text-gray-500' : 'text-[#3b82f6]'}`}>
                  {user.email}
                </p>
              )}
            </div>
          </>
        ) : (
          <GradientAvatar name={user.name} email={user.email} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: expanded ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: expanded ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${expanded ? 'bottom-full mb-2 left-0 right-0' : 'top-full mt-2 right-0'} min-w-[240px] rounded-2xl ${isLightMode ? 'bg-white border-gray-200' : 'bg-black/95 backdrop-blur-xl border-white/10'} border shadow-2xl overflow-hidden z-[9999]`}
          >
            {/* User Info */}
            <div className={`px-4 py-4 border-b ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <GradientAvatar name={user.name} email={user.email} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isLightMode ? 'text-gray-900' : 'text-white'}`}>
                    {user.name || user.email}
                  </p>
                  {user.name && (
                    <p className={`text-xs truncate ${isLightMode ? 'text-gray-500' : 'text-slate-400'}`}>{user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => { setIsOpen(false); setDashboardInitialPanel('main'); setIsDashboardOpen(true); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${isLightMode ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => { setIsOpen(false); setDashboardInitialPanel('account'); setIsDashboardOpen(true); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${isLightMode ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <UserCog className="w-4 h-4" />
                Account
              </button>
            </div>

            {/* Divider */}
            <div className={`border-t ${isLightMode ? 'border-gray-200' : 'border-white/10'}`} />

            {/* Theme Toggle */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-slate-300'}`}>Theme</span>
                <div className={`flex items-center gap-0.5 p-0.5 rounded-md ${isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-white/5 border-white/10'} border`}>
                  <button
                    onClick={() => setTheme("system")}
                    className={`p-1 rounded transition-all ${
                      (theme === "system" || !theme)
                        ? isLightMode ? "bg-white text-gray-900 shadow-sm" : "bg-white/10 text-white"
                        : isLightMode ? "text-gray-500 hover:text-gray-700" : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="System"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-1 rounded transition-all ${
                      theme === "light" 
                        ? isLightMode ? "bg-white text-gray-900 shadow-sm" : "bg-white/10 text-white"
                        : isLightMode ? "text-gray-500 hover:text-gray-700" : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="Light"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-1 rounded transition-all ${
                      theme === "dark" 
                        ? isLightMode ? "bg-white text-gray-900 shadow-sm" : "bg-white/10 text-white"
                        : isLightMode ? "text-gray-500 hover:text-gray-700" : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="Dark"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={`border-t ${isLightMode ? 'border-gray-200' : 'border-white/10'}`} />

            {/* Logout */}
            <div className="py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
              >
                <span className="flex-1 text-left">Log out</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Modal */}
      {user && (
        <DashboardModal 
          isOpen={isDashboardOpen} 
          onClose={() => setIsDashboardOpen(false)} 
          user={user}
          initialPanel={dashboardInitialPanel}
        />
      )}
    </div>
  );
}
