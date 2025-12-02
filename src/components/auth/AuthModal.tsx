"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Check } from "lucide-react";

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md">
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Kapat"
                title="Kapat"
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Tab Buttons */}
              <div className="flex gap-4 mb-4">
                <MagicCard
                  className={`flex-1 p-4 cursor-pointer transition-all ${
                    activeTab === "login" 
                      ? "bg-[#1a1f2e] border-[#3b82f6]/50" 
                      : "bg-[#0d1117] border-white/10 opacity-60 hover:opacity-100"
                  }`}
                  gradientColor="#3b82f6"
                  gradientOpacity={activeTab === "login" ? 0.3 : 0.1}
                  gradientFrom="#3b82f6"
                  gradientTo="#06b6d4"
                >
                  <button
                    onClick={() => { setActiveTab("login"); setError(null); setSuccess(null); }}
                    className="w-full text-center"
                  >
                    <h3 className="text-lg font-semibold text-white">Giriş Yap</h3>
                    <p className="text-xs text-slate-400 mt-1">Hesabınıza giriş yapın</p>
                  </button>
                </MagicCard>

                <MagicCard
                  className={`flex-1 p-4 cursor-pointer transition-all ${
                    activeTab === "register" 
                      ? "bg-[#1a1f2e] border-[#06b6d4]/50" 
                      : "bg-[#0d1117] border-white/10 opacity-60 hover:opacity-100"
                  }`}
                  gradientColor="#06b6d4"
                  gradientOpacity={activeTab === "register" ? 0.3 : 0.1}
                  gradientFrom="#06b6d4"
                  gradientTo="#22c55e"
                >
                  <button
                    onClick={() => { setActiveTab("register"); setError(null); setSuccess(null); }}
                    className="w-full text-center"
                  >
                    <h3 className="text-lg font-semibold text-white">Kayıt Ol</h3>
                    <p className="text-xs text-slate-400 mt-1">Yeni hesap oluşturun</p>
                  </button>
                </MagicCard>
              </div>

              {/* Form Card */}
              <MagicCard
                className="p-6 bg-[#0d1117] border border-white/10"
                gradientColor={activeTab === "login" ? "#3b82f6" : "#06b6d4"}
                gradientOpacity={0.15}
                gradientFrom={activeTab === "login" ? "#3b82f6" : "#06b6d4"}
                gradientTo={activeTab === "login" ? "#06b6d4" : "#22c55e"}
              >
                <AnimatePresence mode="wait">
                  {activeTab === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">E-posta</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            placeholder="ornek@email.com"
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Şifre</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Error/Success Messages */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
                        >
                          {error}
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          {success}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Giriş Yap"
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleRegister}
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">İsim (Opsiyonel)</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input
                            type="text"
                            value={registerForm.name}
                            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                            placeholder="Adınız Soyadınız"
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#06b6d4]/50 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">E-posta</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            placeholder="ornek@email.com"
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#06b6d4]/50 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Şifre</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            placeholder="En az 8 karakter"
                            className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#06b6d4]/50 transition-colors"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
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
                          className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
                        >
                          {error}
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          {success}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#22c55e] text-white font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Kayıt Ol"
                        )}
                      </button>
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
