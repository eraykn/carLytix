"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Check } from "lucide-react";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// GitHub Icon Component
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Giriş başarısız");
        return;
      }

      // Token'ı localStorage'a kaydet
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event("userLoggedIn"));

      setSuccess("Giriş başarılı!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kayıt başarısız");
        return;
      }

      // Token'ı localStorage'a kaydet
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event("userLoggedIn"));

      setSuccess("Kayıt başarılı!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin");
    } finally {
      setIsLoading(false);
    }
  };

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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-md my-8">
              {/* Decorative glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6]/10 via-[#06b6d4]/10 to-[#3b82f6]/10 rounded-3xl blur-2xl opacity-30" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Kapat"
                title="Kapat"
                className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all z-10 group"
              >
                <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              </button>

              {/* Tab Buttons */}
              <div className="relative flex gap-2 mb-4">
                <div 
                  onClick={() => { setActiveTab("login"); setError(null); setSuccess(null); }}
                  className="flex-1 cursor-pointer"
                >
                  <MagicCard
                    className={`p-4 transition-all duration-300 rounded-3xl ${
                      activeTab === "login" 
                        ? "bg-black/80 border-[#3b82f6]/30" 
                        : "bg-black/40 border-white/5 opacity-50 hover:opacity-80"
                    }`}
                    gradientColor="#ffffff"
                    gradientOpacity={0.12}
                    gradientFrom="#ffffff"
                    gradientTo="#a0a0a0"
                    gradientSize={180}
                  >
                    <div className="w-full text-center">
                      <h3 className={`text-base font-semibold ${activeTab === "login" ? "text-white" : "text-white/70"}`}>
                        Giriş Yap
                      </h3>
                    </div>
                  </MagicCard>
                </div>

                <div 
                  onClick={() => { setActiveTab("register"); setError(null); setSuccess(null); }}
                  className="flex-1 cursor-pointer"
                >
                  <MagicCard
                    className={`p-4 transition-all duration-300 rounded-3xl ${
                      activeTab === "register" 
                        ? "bg-black/80 border-[#3b82f6]/30" 
                        : "bg-black/40 border-white/5 opacity-50 hover:opacity-80"
                    }`}
                    gradientColor="#ffffff"
                    gradientOpacity={0.12}
                    gradientFrom="#ffffff"
                    gradientTo="#a0a0a0"
                    gradientSize={180}
                  >
                    <div className="w-full text-center">
                      <h3 className={`text-base font-semibold ${activeTab === "register" ? "text-white" : "text-white/70"}`}>
                        Kayıt Ol
                      </h3>
                    </div>
                  </MagicCard>
                </div>
              </div>

              {/* Form Card */}
              <MagicCard
                className="p-6 bg-black border border-white/10 backdrop-blur-xl rounded-3xl"
                gradientColor="#ffffff"
                gradientOpacity={0.15}
                gradientFrom="#ffffff"
                gradientTo="#e0e0e0"
                gradientSize={250}
              >
                <AnimatePresence mode="wait">
                  {activeTab === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleLogin}
                      className="space-y-5"
                    >
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">E-posta</label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors" />
                          <input
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            placeholder="ornek@email.com"
                            autoComplete="email"
                            className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#3b82f6]/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Şifre</label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#3b82f6]/20 transition-all duration-300"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="text-xs text-slate-500 hover:text-[#3b82f6] transition-colors bg-transparent border-none cursor-pointer"
                          >
                            Şifremi Unuttum
                          </button>
                        </div>
                      </div>

                      {/* Error/Success Messages */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                        >
                          <X className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 flex-shrink-0" />
                          {success}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Giriş Yap"
                        )}
                      </button>

                      {/* Divider */}
                      <div className="flex items-center gap-3 py-2">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-xs text-slate-500">veya</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                      </div>

                      {/* Social Login Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                        >
                          <GoogleIcon />
                          <span className="text-sm font-medium">Google</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                        >
                          <GitHubIcon />
                          <span className="text-sm font-medium">GitHub</span>
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleRegister}
                      className="space-y-5"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">İsim <span className="text-slate-500 font-normal">(Opsiyonel)</span></label>
                        <div className="relative group">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors" />
                          <input
                            type="text"
                            value={registerForm.name}
                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                            placeholder="Adınız Soyadınız"
                            className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#3b82f6]/20 transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">E-posta</label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors" />
                          <input
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            placeholder="ornek@email.com"
                            autoComplete="email"
                            className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#3b82f6]/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Şifre</label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            placeholder="En az 8 karakter"
                            autoComplete="new-password"
                            className="w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-[#3b82f6]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#3b82f6]/20 transition-all duration-300"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">Şifre en az 8 karakter olmalıdır</p>
                      </div>

                      {/* Error/Success Messages */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                        >
                          <X className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 flex-shrink-0" />
                          {success}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Kayıt Ol"
                        )}
                      </button>

                      {/* Divider */}
                      <div className="flex items-center gap-3 py-2">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-xs text-slate-500">veya</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                      </div>

                      {/* Social Login Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                        >
                          <GoogleIcon />
                          <span className="text-sm font-medium">Google</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                        >
                          <GitHubIcon />
                          <span className="text-sm font-medium">GitHub</span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </MagicCard>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
