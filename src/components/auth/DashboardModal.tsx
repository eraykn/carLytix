"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Search, Heart, Car, Settings, Sliders } from "lucide-react";

interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
}

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

// Large Gradient Avatar for Dashboard
const LargeGradientAvatar = ({ name, email }: { name?: string; email: string }) => {
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
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient(email)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
      {initials}
    </div>
  );
};

// Glass Tile Card Component
const GlassTile = ({ 
  icon: Icon, 
  title, 
  subtitle,
  onClick 
}: { 
  icon: React.ElementType; 
  title: string; 
  subtitle?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 text-left group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6]/20 to-[#06b6d4]/20 flex items-center justify-center border border-white/[0.08]">
          <Icon className="w-5 h-5 text-[#3b82f6]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white group-hover:text-[#3b82f6] transition-colors">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export function DashboardModal({ isOpen, onClose, user }: DashboardModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl">
              {/* Decorative glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6]/10 via-[#06b6d4]/10 to-[#3b82f6]/10 rounded-3xl blur-2xl opacity-40" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close"
                title="Close"
                className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all z-10 group"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {/* Modal Content */}
              <div className="relative bg-[#0a0a0f]/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
                {/* Header with user info */}
                <div className="p-6 border-b border-white/[0.06]">
                  <div className="flex items-center gap-4">
                    <LargeGradientAvatar name={user.name} email={user.email} />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-white truncate">
                        {user.name || "User"}
                      </h2>
                      <p className="text-sm text-slate-400 truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 text-xs font-medium text-[#3b82f6] bg-[#3b82f6]/10 rounded-full border border-[#3b82f6]/20">
                          Free Plan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <GlassTile 
                      icon={Sparkles} 
                      title="AI Assistant Settings" 
                      subtitle="Customize your AI experience"
                    />
                    <GlassTile 
                      icon={Sliders} 
                      title="Vehicle Preferences" 
                      subtitle="Set your ideal car specs"
                    />
                    <GlassTile 
                      icon={Heart} 
                      title="Saved Cars" 
                      subtitle="0 vehicles saved"
                    />
                    <GlassTile 
                      icon={Search} 
                      title="Search History" 
                      subtitle="View past searches"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
                  <p className="text-xs text-slate-500 text-center">
                    CarLytix Dashboard • Manage your preferences
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
