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
}

// Vercel-style gradient avatar
const GradientAvatar = ({ name, email }: { name?: string; email: string }) => {
  // Generate consistent gradient based on email
  const getGradient = (str: string) => {
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

  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : email[0].toUpperCase();

  return (
    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getGradient(email)} flex items-center justify-center text-white text-[10px] font-semibold shadow-md`}>
      {initials}
    </div>
  );
};

export function UserProfileMenu({ onOpenAuthModal, className = "" }: UserProfileMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
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

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
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
    return (
      <button
        onClick={onOpenAuthModal}
        aria-label="Giriş Yap"
        title="Giriş Yap"
        className={`flex items-center p-2 rounded-lg bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12] hover:border-[#3b82f6]/50 transition-all duration-300 group cursor-pointer ${className}`}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </button>
    );
  }

  // Logged in - show profile menu
  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profil Menüsü"
        title="Profil Menüsü"
        className="flex items-center p-2 rounded-lg bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12] hover:border-[#3b82f6]/50 transition-all duration-300 group cursor-pointer"
      >
        <GradientAvatar name={user.name} email={user.email} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="px-4 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <GradientAvatar name={user.name} email={user.email} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name || user.email}
                  </p>
                  {user.name && (
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => { setIsOpen(false); setIsDashboardOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => { setIsOpen(false); /* Navigate to account */ }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <UserCog className="w-4 h-4" />
                Account
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Theme Toggle */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Theme</span>
                <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-white/5 border border-white/10">
                  <button
                    onClick={() => setTheme("system")}
                    className={`p-1 rounded transition-all ${
                      (theme === "system" || !theme)
                        ? "bg-white/10 text-white" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="System"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-1 rounded transition-all ${
                      theme === "light" 
                        ? "bg-white/10 text-white" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="Light"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-1 rounded transition-all ${
                      theme === "dark" 
                        ? "bg-white/10 text-white" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                    title="Dark"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Logout */}
            <div className="py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
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
        />
      )}
    </div>
  );
}
