"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight,
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Edit3, 
  Lock, 
  Shield, 
  Bell, 
  Smartphone, 
  Globe, 
  Trash2, 
  Camera,
  X,
  Loader2,
  Check,
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface AccountPanelProps {
  onBack: () => void;
  user: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
    createdAt?: string;
    membershipType?: string;
  };
  onUserUpdate?: (user: { name?: string; email?: string; avatar?: string }) => void;
}

// Toggle Switch Component
const ToggleSwitch = ({ 
  enabled, 
  onChange,
  disabled = false
}: { 
  enabled: boolean; 
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      aria-label={enabled ? "Disable" : "Enable"}
      title={enabled ? "Disable" : "Enable"}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
        enabled ? 'bg-[#3b82f6]' : 'bg-slate-700'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );
};

// Editable Avatar Component
const EditableAvatar = ({ 
  name, 
  email, 
  avatar,
  onAvatarChange
}: { 
  name?: string; 
  email: string;
  avatar?: string;
  onAvatarChange: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Profil fotoğrafı seç"
        title="Profil fotoğrafı seç"
      />
      
      {avatar ? (
        <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white/10">
          <img 
            src={avatar} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradient(email)} flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-white/10`}>
          {initials}
        </div>
      )}
      
      {/* Overlay on hover */}
      <button
        onClick={handleClick}
        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity cursor-pointer"
        title="Profil fotoğrafını değiştir"
        aria-label="Profil fotoğrafını değiştir"
      >
        <Camera className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

// Slide-over Edit Panel
const EditSlideOver = ({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[380px] bg-[#0f0f15] border-l border-white/[0.08] z-20 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
                aria-label="Kapat"
                title="Kapat"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Section Component
const Section = ({ 
  title, 
  icon: Icon,
  children,
  className = ""
}: { 
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#3b82f6]" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

// Info Row Component
const InfoRow = ({ 
  label, 
  value,
  icon: Icon,
  action,
  onAction
}: { 
  label: string;
  value: string;
  icon?: React.ElementType;
  action?: string;
  onAction?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-sm text-white mt-0.5">{value}</p>
        </div>
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors cursor-pointer flex items-center gap-1"
        >
          {action}
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

// Notification Setting Row
const NotificationRow = ({ 
  label, 
  description,
  enabled,
  onChange,
  disabled = false
}: { 
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <div className="flex-1 pr-4">
        <p className="text-sm text-white">{label}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <ToggleSwitch enabled={enabled} onChange={onChange} disabled={disabled} />
    </div>
  );
};

// Security Item Component
const SecurityItem = ({ 
  icon: Icon,
  label, 
  description,
  action,
  onAction,
  badge,
  variant = "default"
}: { 
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: string;
  onAction?: () => void;
  badge?: string;
  variant?: "default" | "danger";
}) => {
  return (
    <button
      onClick={onAction}
      disabled={!onAction}
      className={`w-full flex items-center justify-between py-3 px-3 rounded-lg bg-white/[0.02] border transition-colors ${
        variant === "danger" 
          ? "border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30" 
          : "border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
      } ${onAction ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          variant === "danger" ? "bg-red-500/10" : "bg-white/[0.05]"
        }`}>
          <Icon className={`w-4 h-4 ${variant === "danger" ? "text-red-400" : "text-slate-400"}`} />
        </div>
        <div className="text-left">
          <p className={`text-sm ${variant === "danger" ? "text-red-400" : "text-white"}`}>{label}</p>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-800 rounded-full">
            {badge}
          </span>
        )}
        {action && (
          <span className={`text-xs ${variant === "danger" ? "text-red-400" : "text-[#3b82f6]"}`}>
            {action}
          </span>
        )}
        {onAction && <ChevronRight className={`w-4 h-4 ${variant === "danger" ? "text-red-400" : "text-slate-500"}`} />}
      </div>
    </button>
  );
};

export function AccountPanel({ onBack, user, onUserUpdate }: AccountPanelProps) {
  const [activeEdit, setActiveEdit] = useState<'name' | 'email' | 'password' | 'delete' | null>(null);
  const [saving, setSaving] = useState(false);
  const [userCreatedAt, setUserCreatedAt] = useState<string | undefined>(user.createdAt);
  
  // Form states
  const [newName, setNewName] = useState(user.name || "");
  const [newEmail, setNewEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  
  // Notification states
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newFeatures: true,
    aiReports: false
  });

  // createdAt yoksa API'den çek
  useEffect(() => {
    if (!user.createdAt) {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("auth_token");
          if (!token) return;
          
          const response = await fetch("/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user?.createdAt) {
              setUserCreatedAt(data.user.createdAt);
              
              // localStorage'ı da güncelle
              const storedUser = localStorage.getItem("user");
              if (storedUser) {
                const userObj = JSON.parse(storedUser);
                userObj.createdAt = data.user.createdAt;
                localStorage.setItem("user", JSON.stringify(userObj));
              }
            }
          }
        } catch {
          // Sessizce başarısız ol
        }
      };
      
      fetchUserProfile();
    }
  }, [user.createdAt]);

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Bilinmiyor";
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get membership badge
  const getMembershipBadge = (type?: string) => {
    switch (type) {
      case "pro":
        return { label: "Pro", color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white" };
      case "standard":
        return { label: "Standard", color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" };
      default:
        return { label: "Free", color: "bg-slate-700 text-slate-300" };
    }
  };

  const membership = getMembershipBadge(user.membershipType);

  // Handle avatar change
  const handleAvatarChange = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: result }),
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          // localStorage'daki user bilgisini güncelle
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userObj = JSON.parse(storedUser);
            userObj.avatar = result;
            localStorage.setItem("user", JSON.stringify(userObj));
          }
          
          // Parent component'i güncelle
          onUserUpdate?.({ avatar: result });
          
          // Diğer bileşenlere bildir (örn: UserProfileMenu)
          window.dispatchEvent(new Event("userUpdated"));
          
          toast.success("Profil fotoğrafı güncellendi");
        } else {
          toast.error(data.error || "Fotoğraf güncellenemedi");
        }
      } catch {
        toast.error("Bir hata oluştu");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle name update
  const handleNameUpdate = async () => {
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      toast.error("İsim boş olamaz");
      return;
    }
    
    if (trimmedName.length < 1) {
      toast.error("İsim en az 1 karakter olmalı");
      return;
    }
    
    if (trimmedName.length > 50) {
      toast.error("İsim en fazla 50 karakter olabilir");
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName.trim() }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // localStorage'daki user bilgisini güncelle
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.name = newName.trim();
          localStorage.setItem("user", JSON.stringify(userObj));
        }
        
        onUserUpdate?.({ name: newName.trim() });
        
        // Diğer bileşenlere bildir
        window.dispatchEvent(new Event("userUpdated"));
        
        toast.success("İsim güncellendi");
        setActiveEdit(null);
      } else {
        toast.error(data.error || "Güncelleme başarısız");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // Handle email update
  const handleEmailUpdate = async () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("Geçerli bir e-posta girin");
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // localStorage'daki user bilgisini güncelle
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.email = newEmail.trim();
          localStorage.setItem("user", JSON.stringify(userObj));
        }
        
        onUserUpdate?.({ email: newEmail.trim() });
        
        // Diğer bileşenlere bildir
        window.dispatchEvent(new Event("userUpdated"));
        
        toast.success("E-posta güncellendi");
        setActiveEdit(null);
      } else {
        toast.error(data.error || "Güncelleme başarısız");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword) {
      toast.error("Mevcut şifrenizi girin");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Yeni şifre en az 6 karakter olmalı");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          currentPassword,
          newPassword 
        }),
      });

      if (response.ok) {
        toast.success("Şifre değiştirildi");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setActiveEdit(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "Şifre değiştirilemedi");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // Handle account delete
  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== user.email) {
      toast.error("E-posta adresi eşleşmiyor");
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("auth_token");
        toast.success("Hesabınız silindi");
        window.location.href = "/";
      } else {
        toast.error("Hesap silinemedi");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // Handle notification change
  const handleNotificationChange = async (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    
    try {
      const token = localStorage.getItem("auth_token");
      await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [key]: value }),
      });
    } catch {
      // Silently fail, toggle will revert on next load
    }
  };

  // Load notification settings
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await fetch("/api/user/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNotifications(data.settings);
          }
        }
      } catch {
        // Use defaults
      }
    };

    loadNotifications();
  }, []);

  return (
    <div className="relative flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Geri"
            title="Geri"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">Hesap Ayarları</h2>
            <p className="text-xs text-slate-500">Profil ve güvenlik ayarlarınızı yönetin</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Account Overview */}
        <Section title="Account Overview" icon={User}>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-start gap-4">
              <EditableAvatar 
                name={user.name} 
                email={user.email}
                avatar={user.avatar}
                onAvatarChange={handleAvatarChange}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-white truncate">
                  {user.name || "İsimsiz Kullanıcı"}
                </h4>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
                
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(userCreatedAt)}</span>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${membership.color}`}>
                    {membership.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Personal Information */}
        <Section title="Kişisel Bilgiler" icon={Edit3}>
          <InfoRow 
            icon={User}
            label="Ad Soyad"
            value={user.name || "Belirtilmemiş"}
            action="Düzenle"
            onAction={() => setActiveEdit('name')}
          />
          <InfoRow 
            icon={Mail}
            label="E-posta"
            value={user.email}
            action="Düzenle"
            onAction={() => setActiveEdit('email')}
          />
        </Section>

        {/* Security */}
        <Section title="Güvenlik" icon={Shield}>
          <SecurityItem
            icon={Lock}
            label="Şifre Değiştir"
            description="Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirin"
            onAction={() => setActiveEdit('password')}
          />
          <SecurityItem
            icon={Smartphone}
            label="İki Faktörlü Doğrulama"
            description="Ekstra güvenlik katmanı ekleyin"
            badge="Yakında"
          />
          <SecurityItem
            icon={Smartphone}
            label="Cihaz Geçmişi"
            description="Hesabınıza bağlı cihazları görüntüleyin"
            badge="Yakında"
          />
          <SecurityItem
            icon={Globe}
            label="Giriş Yapılan IP'ler"
            description="Son giriş konumlarınızı kontrol edin"
            badge="Yakında"
          />
        </Section>

        {/* Notifications */}
        <Section title="Bildirimler" icon={Bell}>
          <NotificationRow
            label="E-posta Bildirimleri"
            description="Önemli güncellemeler ve bildirimler"
            enabled={notifications.emailNotifications}
            onChange={(v) => handleNotificationChange('emailNotifications', v)}
          />
          <NotificationRow
            label="Yeni Özellik Duyuruları"
            description="CarLytix'teki yeni özellikleri öğrenin"
            enabled={notifications.newFeatures}
            onChange={(v) => handleNotificationChange('newFeatures', v)}
          />
          <NotificationRow
            label="AI Rapor Çıktıları"
            description="AI analizleriniz tamamlandığında bildirim alın"
            enabled={notifications.aiReports}
            onChange={(v) => handleNotificationChange('aiReports', v)}
          />
        </Section>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-white/[0.06]">
          <SecurityItem
            icon={Trash2}
            label="Hesabı Sil"
            description="Bu işlem geri alınamaz"
            variant="danger"
            onAction={() => setActiveEdit('delete')}
          />
        </div>
      </div>

      {/* Slide-over Panels */}
      
      {/* Edit Name */}
      <EditSlideOver
        isOpen={activeEdit === 'name'}
        onClose={() => setActiveEdit(null)}
        title="Ad Soyad Düzenle"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Ad Soyad</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Adınızı girin"
              maxLength={50}
              minLength={1}
              className="w-full px-4 py-3 text-sm text-white placeholder-slate-500 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-[#3b82f6]/50 focus:outline-none transition-colors"
            />
            <p className="text-xs text-slate-500 text-right">{newName.length}/50</p>
          </div>
          
          <button
            onClick={handleNameUpdate}
            disabled={saving || newName.trim().length === 0}
            className="w-full py-3 text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </EditSlideOver>

      {/* Edit Email */}
      <EditSlideOver
        isOpen={activeEdit === 'email'}
        onClose={() => setActiveEdit(null)}
        title="E-posta Düzenle"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">E-posta Adresi</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              className="w-full px-4 py-3 text-sm text-white placeholder-slate-500 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-[#3b82f6]/50 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-400">
              E-posta değişikliği sonrası yeniden giriş yapmanız gerekebilir.
            </p>
          </div>
          
          <button
            onClick={handleEmailUpdate}
            disabled={saving}
            className="w-full py-3 text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </EditSlideOver>

      {/* Change Password */}
      <EditSlideOver
        isOpen={activeEdit === 'password'}
        onClose={() => setActiveEdit(null)}
        title="Şifre Değiştir"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Mevcut Şifre</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mevcut şifrenizi girin"
                className="w-full px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-[#3b82f6]/50 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Yeni Şifre</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifrenizi girin"
                className="w-full px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-[#3b82f6]/50 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifrenizi tekrar girin"
              className="w-full px-4 py-3 text-sm text-white placeholder-slate-500 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-[#3b82f6]/50 focus:outline-none transition-colors"
            />
          </div>
          
          <button
            onClick={handlePasswordChange}
            disabled={saving}
            className="w-full py-3 text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Değiştiriliyor...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Şifreyi Değiştir
              </>
            )}
          </button>
        </div>
      </EditSlideOver>

      {/* Delete Account */}
      <EditSlideOver
        isOpen={activeEdit === 'delete'}
        onClose={() => setActiveEdit(null)}
        title="Hesabı Sil"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">Bu işlem geri alınamaz!</p>
                <p className="text-xs text-red-400/70 mt-1">
                  Hesabınızı sildiğinizde tüm verileriniz, tercihleriniz ve eşleşmeleriniz kalıcı olarak silinecektir.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-300">
              Onaylamak için e-posta adresinizi yazın: <span className="text-white font-medium">{user.email}</span>
            </label>
            <input
              type="email"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              placeholder="E-posta adresinizi yazın"
              className="w-full px-4 py-3 text-sm text-white placeholder-slate-500 rounded-lg bg-white/[0.03] border border-red-500/20 focus:border-red-500/50 focus:outline-none transition-colors"
            />
          </div>
          
          <button
            onClick={handleDeleteAccount}
            disabled={saving || deleteConfirmEmail !== user.email}
            className="w-full py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Siliniyor...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Hesabı Kalıcı Olarak Sil
              </>
            )}
          </button>
        </div>
      </EditSlideOver>
    </div>
  );
}
