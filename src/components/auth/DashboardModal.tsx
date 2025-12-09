"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Search, Heart, Sliders, ChevronLeft, Lock, Loader2, Check, Car, Trash2, Calendar, Fuel, TurkishLira } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
      className="w-full p-4 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 text-left group cursor-pointer"
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

// Toggle Switch Component
const ToggleSwitch = ({ 
  enabled, 
  onChange 
}: { 
  enabled: boolean; 
  onChange: (value: boolean) => void;
}) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      aria-label={enabled ? "Disable" : "Enable"}
      title={enabled ? "Disable" : "Enable"}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
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

// Option Selector Component
const OptionSelector = ({ 
  options, 
  selected, 
  onChange 
}: { 
  options: string[]; 
  selected: string; 
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex gap-1 p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            selected === option
              ? 'bg-[#3b82f6] text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

// AI Settings Interface
interface AISettings {
  customizationEnabled: boolean;
  customInstructions: string;
  responseStyle: string;
  tone: string;
  suggestionSensitivity: string;
  budgetFlexibility: string;
  brandPreference: string;
  typingAnimation: boolean;
  useHistory: boolean;
}

// Default AI Settings
const defaultAISettings: AISettings = {
  customizationEnabled: true,
  customInstructions: "",
  responseStyle: "Dengeli",
  tone: "Samimi",
  suggestionSensitivity: "Orta",
  budgetFlexibility: "+10%",
  brandPreference: "Dengeli",
  typingAnimation: true,
  useHistory: true,
};

// AI Settings Panel Component - receives settings as props
const AISettingsPanel = ({ 
  onBack,
  initialSettings,
  onSave
}: { 
  onBack: () => void;
  initialSettings: AISettings;
  onSave: (settings: AISettings) => void;
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [customizationEnabled, setCustomizationEnabled] = useState(initialSettings.customizationEnabled);
  const [customInstructions, setCustomInstructions] = useState(initialSettings.customInstructions);
  const [responseStyle, setResponseStyle] = useState(initialSettings.responseStyle);
  const [tone, setTone] = useState(initialSettings.tone);
  const [suggestionSensitivity, setSuggestionSensitivity] = useState(initialSettings.suggestionSensitivity);
  const [budgetFlexibility, setBudgetFlexibility] = useState(initialSettings.budgetFlexibility);
  const [brandPreference, setBrandPreference] = useState(initialSettings.brandPreference);
  const [typingAnimation, setTypingAnimation] = useState(initialSettings.typingAnimation);
  const [useHistory, setUseHistory] = useState(initialSettings.useHistory);

  // Ayarları kaydet
  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Oturum bulunamadı");
        return;
      }

      const newSettings: AISettings = {
        customizationEnabled,
        customInstructions,
        responseStyle,
        tone,
        suggestionSensitivity,
        budgetFlexibility,
        brandPreference,
        typingAnimation,
        useHistory,
      };

      const response = await fetch("/api/user/ai-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Kaydetme başarısız");
        return;
      }

      // Update parent state and close panel
      onSave(newSettings);
      
      // Diğer sayfalara bildir (AI Page için)
      window.dispatchEvent(new Event("aiSettingsUpdated"));
      
      onBack();
    } catch (err) {
      console.error("Failed to save AI settings:", err);
      setError("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Assistant Settings</h2>
            <p className="text-xs text-slate-500">Customize your AI experience</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Enable Customization - Controls only custom instructions input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Enable customization</p>
              <p className="text-xs text-slate-500 mt-0.5">Customize how CarLytix AI responds to you.</p>
            </div>
            <ToggleSwitch enabled={customizationEnabled} onChange={setCustomizationEnabled} />
          </div>

          {/* Custom Instructions - Shows locked state when disabled */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Custom instructions</label>
            <div className="relative">
              {!customizationEnabled && (
                <div className="absolute inset-0 flex items-center justify-center z-10 rounded-lg bg-black/40">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
              )}
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                disabled={!customizationEnabled}
                placeholder="Örn: Bana her zaman Türkçe cevap ver, teknik detayları basitleştir..."
                maxLength={1000}
                className={`w-full h-20 px-3 py-2 text-sm placeholder-slate-500 rounded-lg resize-none focus:outline-none transition-colors ${
                  customizationEnabled 
                    ? 'text-white bg-white/[0.03] border border-white/[0.08] focus:border-[#3b82f6]/50' 
                    : 'text-slate-600 bg-black/60 border border-white/[0.04] cursor-not-allowed'
                }`}
              />
              {customizationEnabled && (
                <p className="text-[10px] text-slate-500 mt-1 text-right">{customInstructions.length}/1000</p>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Section - Always visible */}
        <div className="pt-4 border-t border-white/[0.06]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Advanced</p>
          
          <div className="space-y-4">
            {/* Response Style */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Yanıt stili</label>
              <OptionSelector 
                options={["Kısa", "Dengeli", "Detaylı"]} 
                selected={responseStyle} 
                onChange={setResponseStyle} 
              />
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Ton</label>
              <OptionSelector 
                options={["Teknik", "Kurumsal", "Samimi"]} 
                selected={tone} 
                onChange={setTone} 
              />
            </div>

            {/* Suggestion Sensitivity */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Öneri hassasiyeti</label>
              <OptionSelector 
                options={["Sıkı", "Orta", "Geniş"]} 
                selected={suggestionSensitivity} 
                onChange={setSuggestionSensitivity} 
              />
            </div>

            {/* Budget Flexibility */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Bütçe esnekliği</label>
              <OptionSelector 
                options={["+5%", "+10%", "+20%"]} 
                selected={budgetFlexibility} 
                onChange={setBudgetFlexibility} 
              />
            </div>

            {/* Brand Preference */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Marka eğilimi</label>
              <OptionSelector 
                options={["Dengeli", "Favori"]} 
                selected={brandPreference} 
                onChange={setBrandPreference} 
              />
            </div>

            {/* Typing Animation */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-300">Typing animasyon</span>
              <ToggleSwitch enabled={typingAnimation} onChange={setTypingAnimation} />
            </div>

            {/* Use History */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-300">Kişisel geçmişi kullan</span>
              <ToggleSwitch enabled={useHistory} onChange={setUseHistory} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="w-full py-2.5 text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            "Kaydet"
          )}
        </button>
      </div>
    </div>
  );
};

// Multi Select Chip Component
const MultiSelectChip = ({ 
  options, 
  selected, 
  onChange,
  maxSelections
}: { 
  options: string[]; 
  selected: string[]; 
  onChange: (value: string[]) => void;
  maxSelections: number;
}) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      // Remove from selection
      onChange(selected.filter(s => s !== option));
    } else {
      // Add to selection, respecting max limit
      if (selected.length >= maxSelections) {
        // Remove first selected and add new one
        onChange([...selected.slice(1), option]);
      } else {
        onChange([...selected, option]);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer border ${
              isSelected
                ? 'bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/40'
                : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15]'
            }`}
          >
            {option}
            {isSelected && <Check className="w-3 h-3 ml-1.5 inline" />}
          </button>
        );
      })}
    </div>
  );
};

// Vehicle Preferences Interface
interface VehiclePreferences {
  usage: string[];
  bodyType: string[];
  fuelType: string[];
  priorities: string[];
  brands: string[];
}

// Default Vehicle Preferences
const defaultVehiclePreferences: VehiclePreferences = {
  usage: [],
  bodyType: [],
  fuelType: [],
  priorities: [],
  brands: [],
};

// Brand list
const BRAND_LIST = [
  "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota", "Honda", "Hyundai", "Renault",
  "Peugeot", "Opel", "Volvo", "Tesla", "Skoda", "Ford", "Kia", "Nissan", "Fiat", "Seat",
  "Cupra", "Mazda", "Porsche", "Land Rover", "Jaguar", "Jeep", "Mini", "Citroën", "Dacia",
  "Suzuki", "Mitsubishi", "Subaru", "Lexus", "Alfa Romeo", "Genesis", "Dodge", "Chrysler",
  "Chevrolet", "Cadillac", "Holden", "Buick", "Infiniti", "Acura", "Rivian", "Lucid",
  "Polestar", "BYD", "Chery", "Geely", "Great Wall", "MG"
];

// Vehicle Preferences Panel Component
const VehiclePreferencesPanel = ({ 
  onBack,
  initialPreferences,
  onSave
}: { 
  onBack: () => void;
  initialPreferences: VehiclePreferences;
  onSave: (preferences: VehiclePreferences) => void;
}) => {
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  
  const [usage, setUsage] = useState<string[]>(initialPreferences.usage);
  const [bodyType, setBodyType] = useState<string[]>(initialPreferences.bodyType);
  const [fuelType, setFuelType] = useState<string[]>(initialPreferences.fuelType);
  const [priorities, setPriorities] = useState<string[]>(initialPreferences.priorities);
  const [brands, setBrands] = useState<string[]>(initialPreferences.brands);

  const filteredBrands = BRAND_LIST.filter(
    brand => brand.toLowerCase().includes(brandSearch.toLowerCase()) && !brands.includes(brand)
  );

  const handleAddBrand = (brand: string) => {
    setBrands([...brands, brand]);
    setBrandSearch("");
    setShowBrandDropdown(false);
  };

  const handleRemoveBrand = (brand: string) => {
    setBrands(brands.filter(b => b !== brand));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save - backend integration later
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPreferences: VehiclePreferences = {
      usage,
      bodyType,
      fuelType,
      priorities,
      brands,
    };
    
    onSave(newPreferences);
    setSaving(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">Vehicle Preferences</h2>
            <p className="text-xs text-slate-500">Set your ideal car specifications</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <p className="text-sm text-emerald-400">Tercihlerin güncellendi. Öneriler bundan sonra buna göre şekillenecek.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Usage Section */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white">Kullanım</p>
            <p className="text-xs text-slate-500 mt-0.5">En fazla 3 seçenek</p>
          </div>
          <MultiSelectChip
            options={["Şehir içi", "Uzun yol", "Karma", "Aile odaklı", "Sportif"]}
            selected={usage}
            onChange={setUsage}
            maxSelections={3}
          />
        </div>

        {/* Body Type Section */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white">Gövde Tipi</p>
            <p className="text-xs text-slate-500 mt-0.5">En fazla 3 seçenek</p>
          </div>
          <MultiSelectChip
            options={["SUV", "Sedan", "Hatchback", "Crossover", "Station", "Coupe"]}
            selected={bodyType}
            onChange={setBodyType}
            maxSelections={3}
          />
        </div>

        {/* Fuel Type Section */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white">Yakıt / Enerji</p>
            <p className="text-xs text-slate-500 mt-0.5">En fazla 4 seçenek</p>
          </div>
          <MultiSelectChip
            options={["Elektrikli", "Hibrit", "Benzin", "Dizel"]}
            selected={fuelType}
            onChange={setFuelType}
            maxSelections={4}
          />
        </div>

        {/* Priorities Section */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white">Öncelikler</p>
            <p className="text-xs text-slate-500 mt-0.5">Hepsini seçebilirsiniz</p>
          </div>
          <MultiSelectChip
            options={["Güvenlik", "Düşük tüketim", "Performans", "Konfor", "Teknoloji/ADAS", "Uygun bakım"]}
            selected={priorities}
            onChange={setPriorities}
            maxSelections={6}
          />
        </div>

        {/* Brand Preferences Section */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-white">Marka Tercihleri</p>
            <p className="text-xs text-slate-500 mt-0.5">Tercih ettiğiniz markaları ekleyin</p>
          </div>
          
          {/* Brand Search Input */}
          <div className="relative">
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setShowBrandDropdown(true);
              }}
              onFocus={() => setShowBrandDropdown(true)}
              placeholder="Marka ara..."
              className="w-full px-4 py-2.5 text-sm text-white placeholder-slate-500 rounded-lg bg-white/[0.03] border border-white/[0.08] focus:border-[#3b82f6]/50 focus:outline-none transition-colors"
            />
            
            {/* Brand Dropdown */}
            <AnimatePresence>
              {showBrandDropdown && brandSearch && filteredBrands.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-lg bg-[#1a1a2e] border border-white/[0.08] shadow-xl z-10"
                >
                  {filteredBrands.slice(0, 8).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleAddBrand(brand)}
                      className="w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
                    >
                      {brand}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Brands */}
          {brands.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40"
                >
                  {brand}
                  <button
                    onClick={() => handleRemoveBrand(brand)}
                    className="p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label={`Remove ${brand}`}
                    title={`Remove ${brand}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Text */}
        <div className="pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-slate-500 text-center italic">
            Bu tercihleri Carlytix AI, öneri ve karşılaştırma yanıtlarında otomatik olarak dikkate alır.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              "Tercihlerimi Kaydet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Matched Car Interface
interface MatchedCar {
  id: string;
  carId: string;
  brand: string;
  model: string;
  trim?: string;
  year: number;
  body: string;
  fuel: string;
  price: number;
  imageMain?: string;
  brandLogo?: string;
  matchScore?: number;
  matchDate: string;
  isFavorite: boolean;
  notes?: string;
}

// Match Cars Panel Component
const MatchCarsPanel = ({ 
  onBack,
  onCountChange 
}: { 
  onBack: () => void;
  onCountChange?: (count: number) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [matchedCars, setMatchedCars] = useState<MatchedCar[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch matched cars
  useEffect(() => {
    const fetchMatchedCars = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await fetch("/api/user/matched-cars", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setMatchedCars(data.cars);
          onCountChange?.(data.cars.length);
        }
      } catch (error) {
        console.error("Failed to fetch matched cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedCars();
  }, [onCountChange]);

  // Delete a matched car
  const handleDelete = async (carId: string) => {
    setDeletingId(carId);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(`/api/user/matched-cars?carId=${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const newCars = matchedCars.filter((car) => car.carId !== carId);
        setMatchedCars(newCars);
        onCountChange?.(newCars.length);
        toast.success("Araç listeden kaldırıldı");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">Match Cars</h2>
            <p className="text-xs text-slate-500">CarLytix Match ile eşleştiğiniz araçlar</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
          </div>
        ) : matchedCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#06b6d4]/20 flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Henüz eşleşme yok</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              CarLytix Match&apos;te size önerilen araçları &quot;Bu Arabayı Seç&quot; butonuyla buraya ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchedCars.map((car) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
              >
                <div className="flex gap-4 items-center">
                  {/* Car Image */}
                  <div className="flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-white/[0.05] flex items-center justify-center">
                    {car.imageMain ? (
                      <Image
                        src={car.imageMain}
                        alt={`${car.brand} ${car.model}`}
                        width={112}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Car Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {car.brand} {car.model}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {car.year} • {car.trim || car.body} • {car.fuel}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <TurkishLira className="w-3 h-3" />
                        {car.price?.toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(car.matchDate)}
                      </span>
                    </div>
                  </div>

                  {/* Match Score - Centered */}
                  {car.matchScore && (
                    <div className="flex-shrink-0 px-3 py-2 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/30">
                      <span className="text-sm font-bold text-[#3b82f6]">{car.matchScore}</span>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(car.carId)}
                    disabled={deletingId === car.carId}
                    className="flex-shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                    title="Listeden Kaldır"
                  >
                    {deletingId === car.carId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
        <p className="text-xs text-slate-500 text-center">
          {matchedCars.length} araç listenizde
        </p>
      </div>
    </div>
  );
};

export function DashboardModal({ isOpen, onClose, user }: DashboardModalProps) {
  const [activePanel, setActivePanel] = useState<'main' | 'ai-settings' | 'vehicle-preferences' | 'match-cars'>('main');
  const [aiSettings, setAiSettings] = useState<AISettings>(defaultAISettings);
  const [vehiclePreferences, setVehiclePreferences] = useState<VehiclePreferences>(defaultVehiclePreferences);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [matchedCarsCount, setMatchedCarsCount] = useState(0);

  // Lazy load AI settings and matched cars count when modal opens
  useEffect(() => {
    if (isOpen && !settingsLoaded) {
      const loadSettings = async () => {
        try {
          const token = localStorage.getItem("auth_token");
          if (!token) return;

          // Load AI settings
          const response = await fetch("/api/user/ai-settings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.settings) {
              setAiSettings({
                customizationEnabled: data.settings.customizationEnabled,
                customInstructions: data.settings.customInstructions || "",
                responseStyle: data.settings.responseStyle,
                tone: data.settings.tone,
                suggestionSensitivity: data.settings.suggestionSensitivity,
                budgetFlexibility: data.settings.budgetFlexibility,
                brandPreference: data.settings.brandPreference,
                typingAnimation: data.settings.typingAnimation,
                useHistory: data.settings.useHistory,
              });
            }
          }

          // Load matched cars count
          const carsResponse = await fetch("/api/user/matched-cars", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (carsResponse.ok) {
            const carsData = await carsResponse.json();
            if (carsData.success) {
              setMatchedCarsCount(carsData.count || 0);
            }
          }
        } catch (err) {
          console.error("Failed to load AI settings:", err);
        } finally {
          setSettingsLoaded(true);
        }
      };

      loadSettings();
    }
  }, [isOpen, settingsLoaded]);

  // Modal açıkken body scroll'u kilitle
  useEffect(() => {
    if (isOpen) {
      // Mevcut scroll pozisyonunu kaydet
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Modal kapandığında scroll'u geri yükle
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setActivePanel('main');
    onClose();
  };

  const handleSaveSettings = (newSettings: AISettings) => {
    setAiSettings(newSettings);
  };

  const handleVehicleSave = async (newPreferences: VehiclePreferences) => {
    setVehiclePreferences(newPreferences);
    
    // API'ye kaydet
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch("/api/vehicle-preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(newPreferences),
        });
      }
    } catch (error) {
      console.error("Failed to save vehicle preferences:", error);
    }
    
    onClose(); // Dashboard'ı kapat
    toast.success('Tercihlerin güncellendi. Öneriler bundan sonra buna göre şekillenecek.', {
      position: 'bottom-left',
      duration: 3000,
    });
  };

  // Client-side only portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div 
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6]/10 via-[#06b6d4]/10 to-[#3b82f6]/10 rounded-3xl blur-2xl opacity-40" />
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="Close"
                title="Close"
                className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all z-10 group cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {/* Modal Content */}
              <div className="relative bg-[#0a0a0f]/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden min-h-[400px] max-h-[80vh] flex flex-col">
                <AnimatePresence mode="wait">
                  {activePanel === 'main' ? (
                    <motion.div
                      key="main"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header with user info */}
                      <div className="p-6 border-b border-white/[0.06]">
                        <div className="flex items-center gap-4">
                          <LargeGradientAvatar name={user.name} email={user.email} />
                          <div className="flex-1 min-w-0">
                            {user.name && (
                              <h2 className="text-xl font-semibold text-white truncate">
                                {user.name}
                              </h2>
                            )}
                            <p className={`text-sm text-slate-400 truncate ${!user.name ? 'text-base' : ''}`}>
                              {user.email}
                            </p>
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
                            onClick={() => setActivePanel('ai-settings')}
                          />
                          <GlassTile 
                            icon={Sliders} 
                            title="Vehicle Preferences" 
                            subtitle="Set your ideal car specs"
                            onClick={() => setActivePanel('vehicle-preferences')}
                          />
                          <GlassTile 
                            icon={Heart} 
                            title="Match Cars" 
                            subtitle={matchedCarsCount > 0 ? `${matchedCarsCount} araç eşleşti` : "Henüz eşleşme yok"}
                            onClick={() => setActivePanel('match-cars')}
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
                    </motion.div>
                  ) : activePanel === 'ai-settings' ? (
                    <motion.div
                      key="ai-settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col min-h-0 max-h-[80vh]"
                    >
                      <AISettingsPanel 
                        onBack={() => setActivePanel('main')} 
                        initialSettings={aiSettings}
                        onSave={handleSaveSettings}
                      />
                    </motion.div>
                  ) : activePanel === 'vehicle-preferences' ? (
                    <motion.div
                      key="vehicle-preferences"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col min-h-0 max-h-[80vh]"
                    >
                      <VehiclePreferencesPanel 
                        onBack={() => setActivePanel('main')} 
                        initialPreferences={vehiclePreferences}
                        onSave={handleVehicleSave}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="match-cars"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col min-h-0 max-h-[80vh]"
                    >
                      <MatchCarsPanel 
                        onBack={() => setActivePanel('main')} 
                        onCountChange={(count) => setMatchedCarsCount(count)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
