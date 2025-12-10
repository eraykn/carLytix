# 🚗 CarLytix - Akıllı Araç Danışmanlık Platformu

<p align="center">
  <img src="/public/images/brands/carlytix-concept-a-logo.svg" alt="CarLytix Logo" width="300"/>
</p>

<p align="center">
  <strong>Yapay Zeka Destekli Araç Seçim ve Karşılaştırma Platformu</strong>
</p>

<p align="center">
  <a href="#özellikler">Özellikler</a> •
  <a href="#teknolojiler">Teknolojiler</a> •
  <a href="#dosya-yapısı">Dosya Yapısı</a> •
  <a href="#api-endpoints">API</a>
</p>

---

## 📋 Proje Hakkında

**CarLytix**, kullanıcıların araç seçim sürecini kolaylaştırmak için geliştirilmiş, yapay zeka destekli modern bir web platformudur. Kullanıcılar ihtiyaçlarına göre araç önerileri alabilir, farklı modelleri karşılaştırabilir ve AI chatbot ile interaktif danışmanlık hizmeti alabilirler.

### 🎯 Temel Amaçlar

- **Kişiselleştirilmiş Araç Önerisi**: Kullanıcının bütçesi, yaşam tarzı ve önceliklerine göre en uygun araç önerileri
- **Detaylı Araç Karşılaştırma**: Teknik özellikler, güvenlik donanımları ve performans değerleri üzerinden kapsamlı karşılaştırma
- **AI Chatbot Desteği**: Google Gemini tabanlı yapay zeka ile interaktif araç danışmanlığı
- **Kullanıcı Yönetimi**: Kayıt, giriş ve oturum yönetimi ile kişiselleştirilmiş deneyim

---

## ✨ Özellikler

### 🏠 Ana Sayfa (Hero Section)
- Etkileyici animasyonlu yükleme ekranı
- Öne çıkan araç karuseli
- Scroll ile araç geçişi
- Modern glassmorphism tasarım

### 🤖 AI Chat Asistanı (`/ai`)
- **Google Gemini AI** entegrasyonu ile akıllı sohbet
- Türkiye otomobil pazarı odaklı özelleştirilmiş sistem promptu
- Araç karşılaştırma tabloları
- Markdown desteği (tablolar, listeler, kalın/italik yazı)
- Tema seçenekleri (Açık/Koyu/Sistem)
- AI Persona ayarları
- Sohbet geçmişi kaydetme
- Typewriter efekti ile akıcı mesaj gösterimi

### 🧙‍♂️ Akıllı Asistan (`/assistant`)
- Adım adım araç seçim sihirbazı
- Kategori bazlı filtreleme:
  - **Kullanım Alanı**: Şehir içi, Uzun yol, Karma, Kış şartları, Aile odaklı, Spor
  - **Gövde Tipi**: SUV, Sedan, Hatchback, Crossover, Station
  - **Yakıt Türü**: Elektrikli, Benzin, Dizel, Hibrit
  - **Öncelikler**: Güvenlik, Düşük tüketim, Performans, Konfor, Teknoloji/ADAS, Uygun bakım
- Bütçe girişi
- Kişiselleştirilmiş araç önerileri
- Session tabanlı kullanıcı takibi

### ⚖️ Araç Karşılaştırma (`/compare`)
- Çoklu araç seçimi
- Detaylı teknik özellik karşılaştırması:
  - Motor hacmi, güç, tork
  - 0-100 km/h hızlanma, maksimum hız
  - Yakıt tüketimi
  - Boyutlar ve ağırlık
  - Bagaj kapasitesi
  - Elektrikli araç özellikleri (menzil, şarj süresi)
- Güvenlik donanımları karşılaştırması
- Marka ve model bazlı filtreleme

### 🔐 Kullanıcı Yönetimi
- Kayıt ve giriş sistemi
- Şifre hashleme (bcrypt)
- Token tabanlı oturum yönetimi
- Modal tabanlı auth arayüzü

---

## 🛠 Teknolojiler

### Frontend

| Teknoloji | Açıklama |
|-----------|----------|
| **Next.js 15.5** | React tabanlı full-stack framework (App Router) |
| **React 19** | UI kütüphanesi |
| **TypeScript** | Tip güvenli JavaScript |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **shadcn/ui** | Radix UI tabanlı yeniden kullanılabilir bileşen kütüphanesi |
| **Magic UI** | Modern animasyonlu UI bileşenleri |
| **Three.js** | 3D grafik ve görselleştirme |
| **Figma** | UI/UX tasarım aracı |
| **Framer Motion** | Animasyon kütüphanesi |
| **GSAP** | Gelişmiş animasyonlar |
| **Radix UI** | Erişilebilir UI primitifleri |
| **Lucide React** | İkon kütüphanesi |
| **React Hook Form** | Form yönetimi |
| **Zod** | Schema validasyonu |
| **Zustand** | State management |
| **Embla Carousel** | Carousel komponenti |
| **React Markdown** | Markdown render |
| **Recharts** | Grafik kütüphanesi |
| **Sonner** | Toast bildirimleri |

### Backend

| Teknoloji | Açıklama |
|-----------|----------|
| **Next.js API Routes** | Serverless API endpoints |
| **Prisma ORM** | Veritabanı ORM |
| **PostgreSQL** | İlişkisel veritabanı |
| **Google Generative AI** | Gemini AI entegrasyonu |
| **bcryptjs** | Şifre hashleme |
| **crypto** | Token oluşturma |

### Geliştirme Araçları

| Teknoloji | Açıklama |
|-----------|----------|
| **Turbopack** | Next.js hızlı bundler |
| **ESLint** | Kod kalite kontrolü |
| **Prettier** | Kod formatlama |

---

## 📁 Dosya Yapısı

```
my-app/
├── 📁 prisma/
│   ├── schema.prisma          # Veritabanı şeması
│   └── seed.ts                # Örnek veri ekleme scripti
│
├── 📁 public/
│   ├── 📁 car/                # Araç görselleri
│   ├── 📁 fonts/              # Özel fontlar (Satoshi)
│   ├── 📁 images/
│   │   ├── 📁 brands/         # Marka logoları
│   │   └── 📁 cars/           # Araç fotoğrafları
│   └── 📁 logo/               # Platform logosu
│
├── 📁 src/
│   ├── 📁 app/                # Next.js App Router
│   │   ├── globals.css        # Global stiller
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Ana sayfa
│   │   ├── 📁 aboutus/        # Hakkımızda sayfası
│   │   ├── 📁 ai/             # AI Chat sayfası
│   │   ├── 📁 assistant/      # Akıllı asistan sayfası
│   │   │   ├── page.tsx
│   │   │   └── 📁 recommended/
│   │   ├── 📁 compare/        # Araç karşılaştırma sayfası
│   │   └── 📁 api/            # API Routes
│   │       ├── 📁 assistant/      # Asistan API'leri
│   │       ├── 📁 assistantApi/   # Session & araç API'leri
│   │       │   ├── route.ts
│   │       │   ├── 📁 car/
│   │       │   └── 📁 session/
│   │       ├── 📁 auth/           # Kimlik doğrulama
│   │       │   ├── 📁 login/
│   │       │   ├── 📁 logout/
│   │       │   ├── 📁 me/
│   │       │   └── 📁 register/
│   │       ├── 📁 cars/           # Araç verileri API
│   │       │   └── route.ts
│   │       └── 📁 chat/           # AI Chat API
│   │           └── route.ts
│   │
│   ├── 📁 components/
│   │   ├── 📁 auth/
│   │   │   └── AuthModal.tsx      # Giriş/Kayıt modalı
│   │   ├── 📁 car/
│   │   │   ├── CarCarousel.tsx    # Araç karuseli
│   │   │   ├── CarDetailsPanel.tsx # Araç detay paneli
│   │   │   └── CarRecommendationCard.tsx # Öneri kartı
│   │   ├── 📁 common/
│   │   │   ├── Footer.tsx         # Alt bilgi
│   │   │   ├── ImageWithFallback.tsx # Fallback'li resim
│   │   │   ├── LoadingScreen.tsx  # Yükleme ekranı
│   │   │   └── TransitionLayer.tsx # Sayfa geçiş efekti
│   │   ├── 📁 icons/
│   │   │   └── Logo.tsx           # Logo komponenti
│   │   ├── 📁 sections/
│   │   │   ├── AboutSection.tsx   # Hakkında bölümü
│   │   │   ├── AboutUsSection.tsx
│   │   │   ├── AIChatSection.tsx  # AI Chat arayüzü
│   │   │   ├── AssistantSection.tsx # Asistan arayüzü
│   │   │   ├── HeroSection.tsx    # Hero bölümü
│   │   │   └── 📁 Compare/
│   │   │       └── CompareSection.tsx # Karşılaştırma arayüzü
│   │   └── 📁 ui/                 # Radix UI bileşenleri
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── magic-card.tsx
│   │       └── ... (40+ UI bileşeni)
│   │
│   ├── 📁 hooks/
│   │   └── usePageCurtain.ts      # Sayfa geçiş hook'u
│   │
│   ├── 📁 lib/
│   │   ├── prisma.ts              # Prisma client instance
│   │   ├── utils.ts               # Yardımcı fonksiyonlar
│   │   ├── 📁 constants/
│   │   │   └── carData.ts         # Statik araç verileri
│   │   └── 📁 utils/
│   │       └── tagMapping.ts      # Tag eşleştirme
│   │
│   └── 📁 types/                  # TypeScript tip tanımları
│
├── components.json                # shadcn/ui konfigürasyonu
├── eslint.config.mjs             # ESLint ayarları
├── next.config.ts                # Next.js konfigürasyonu
├── package.json                  # Bağımlılıklar
├── postcss.config.mjs            # PostCSS ayarları
├── tailwind.config.ts            # Tailwind ayarları
└── tsconfig.json                 # TypeScript ayarları
```

---

## 🗄 Veritabanı Şeması

### Ana Tablolar

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      Brand      │────▶│       Car       │────▶│  TechnicalSpecs │
│─────────────────│     │─────────────────│     │─────────────────│
│ id              │     │ id              │     │ horsepower      │
│ name            │     │ modelName       │     │ torque          │
│                 │     │ year            │     │ acceleration    │
│                 │     │ brandId         │     │ topSpeed        │
│                 │     │ imageUrl        │     │ fuelConsumption │
│                 │     │                 │     │ electricRange   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │ SecurityFeature │
                        │─────────────────│
                        │ name            │
                        │ isAvailable     │
                        └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   AssistantCar  │     │   UserSession   │
│─────────────────│     │─────────────────│
│ brand, model    │     │ usageTags       │
│ price, tags     │     │ bodyType        │
│ scores          │     │ fuelType        │
│ specs (JSON)    │     │ budget          │
│ whyBullets      │     │ recommendedIds  │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   ChatSession   │────▶│   ChatMessage   │
│─────────────────│     │─────────────────│
│ persona         │     │ role            │
│ budgetFlex      │     │ content         │
│ theme           │     │ tokenCount      │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│      User       │────▶│   AuthSession   │
│─────────────────│     │─────────────────│
│ email           │     │ token           │
│ password (hash) │     │ expiresAt       │
│ name            │     │ userAgent       │
│ isVerified      │     │ ipAddress       │
└─────────────────┘     └─────────────────┘
```

---

## 📡 API Endpoints

### Araç API'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/cars` | Tüm araçları listele |
| `GET` | `/api/assistantApi/car` | Asistan araçlarını getir |
| `POST` | `/api/assistantApi/car` | Filtreye göre araç öner |

### Chat API'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/chat` | AI ile sohbet (streaming) |
| `GET` | `/api/chat/history` | Sohbet geçmişini getir |

### Session API'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/assistantApi/session` | Yeni session oluştur |
| `PUT` | `/api/assistantApi/session` | Session güncelle |

### Auth API'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı |
| `POST` | `/api/auth/login` | Kullanıcı girişi |
| `POST` | `/api/auth/logout` | Çıkış yap |
| `GET` | `/api/auth/me` | Kullanıcı bilgisi |

---

## 🎨 UI/UX Özellikleri

- **Dark Mode Varsayılan**: Göz yorgunluğunu azaltan koyu tema
- **Light Mode Desteği**: Aydınlık ortamlar için açık tema seçeneği
- **Glassmorphism**: Modern bulanık cam efektleri
- **Micro Animations**: Kullanıcı etkileşimlerinde akıcı animasyonlar
- **Responsive Design**: Mobil ve masaüstü uyumlu
- **Custom Scrollbar**: Özelleştirilmiş kaydırma çubuğu
- **Loading States**: Yükleme durumları için skeleton ve spinner
- **Toast Notifications**: Kullanıcı bildirimleri

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## 👤 Geliştirici

**Eray Kan**

- GitHub: [@eraykn](https://github.com/eraykn)

---

<p align="center">
  Made with ❤️ using Next.js and AI
</p>