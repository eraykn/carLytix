"use client"

import type React from "react"

import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import type { GlobeMethods } from "react-globe.gl"
import * as THREE from "three"
import { Users, Target, Smile, Quote, ChevronDown, Menu, Bot } from "lucide-react"
import { motion } from "framer-motion"

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
})

const ISTANBUL_COORDS = { lat: 41.0082, lng: 28.9784 }

const EUROPEAN_CITIES = [
  { lat: 51.5074, lng: -0.1278, name: "London" },
  { lat: 48.8566, lng: 2.3522, name: "Paris" },
  { lat: 52.52, lng: 13.405, name: "Berlin" },
  { lat: 40.4168, lng: -3.7038, name: "Madrid" },
  { lat: 41.9028, lng: 12.4964, name: "Rome" },
  { lat: 52.3676, lng: 4.9041, name: "Amsterdam" },
  { lat: 59.3293, lng: 18.0686, name: "Stockholm" },
  { lat: 48.2082, lng: 16.3738, name: "Vienna" },
  { lat: 52.2297, lng: 21.0122, name: "Warsaw" },
  { lat: 37.9838, lng: 23.7275, name: "Athens" },
  { lat: 53.3498, lng: -6.2603, name: "Dublin" },
  { lat: 38.7223, lng: -9.1393, name: "Lisbon" },
  { lat: 50.8503, lng: 4.3517, name: "Brussels" },
  { lat: 55.6761, lng: 12.5683, name: "Copenhagen" },
  { lat: 50.0755, lng: 14.4378, name: "Prague" },
  { lat: 47.4979, lng: 19.0402, name: "Budapest" },
  { lat: 44.4268, lng: 26.1025, name: "Bucharest" },
  { lat: 50.4501, lng: 30.5234, name: "Kyiv" },
  { lat: 46.2044, lng: 6.1432, name: "Geneva" },
  { lat: 59.9139, lng: 10.7522, name: "Oslo" },
]

const TURKISH_CITIES = [
  { lat: 39.9334, lng: 32.8597, name: "Ankara" },
  { lat: 38.4237, lng: 27.1428, name: "Izmir" },
  { lat: 36.8969, lng: 30.7133, name: "Antalya" },
  { lat: 40.1885, lng: 29.061, name: "Bursa" },
  { lat: 37.0, lng: 35.3213, name: "Adana" },
  { lat: 37.0662, lng: 37.3833, name: "Gaziantep" },
  { lat: 41.2867, lng: 36.33, name: "Samsun" },
  { lat: 37.5744, lng: 36.9371, name: "Kahramanmaras" },
  { lat: 37.7648, lng: 30.5566, name: "Isparta" },
]

const getRandomColor = () => {
  const colors = ["#ffffff", "#6ee7b7", "#34d399"]
  return colors[Math.floor(Math.random() * colors.length)]
}

const RUSSIAN_CITIES = [
  { lat: 55.7558, lng: 37.6173, name: "Moscow" },
  { lat: 59.9343, lng: 30.3351, name: "Saint Petersburg" },
  { lat: 55.0084, lng: 82.9357, name: "Novosibirsk" },
  { lat: 56.8389, lng: 60.6057, name: "Yekaterinburg" },
  { lat: 55.7963, lng: 49.1088, name: "Kazan" },
]

const US_CITIES = [
  { lat: 40.7128, lng: -74.006, name: "New York" },
  { lat: 34.0522, lng: -118.2437, name: "Los Angeles" },
  { lat: 41.8781, lng: -87.6298, name: "Chicago" },
  { lat: 29.7604, lng: -95.3698, name: "Houston" },
  { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
  { lat: 38.9072, lng: -77.0369, name: "Washington DC" },
]

const MIDDLE_EAST_CITIES = [
  { lat: 25.2048, lng: 55.2708, name: "Dubai" },
  { lat: 24.7136, lng: 46.6753, name: "Riyadh" },
  { lat: 25.2854, lng: 51.531, name: "Doha" },
  { lat: 35.6892, lng: 51.389, name: "Tehran" },
  { lat: 32.0853, lng: 34.7818, name: "Tel Aviv" },
  { lat: 30.0444, lng: 31.2357, name: "Cairo" },
  { lat: 31.9454, lng: 35.9284, name: "Amman" },
]

export default function GlobeVisualization() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const listenerRef = useRef<(() => void) | null>(null)
  const [countries, setCountries] = useState({ features: [] })
  const [arcs, setArcs] = useState<any[]>([])
  const [rings, setRings] = useState<any[]>([ISTANBUL_COORDS])
  const [mounted, setMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isZoomedClose, setIsZoomedClose] = useState(false)
  const [showGlobeUI, setShowGlobeUI] = useState(false)

  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 })

  const setupGlobeControls = useCallback(() => {
    if (!globeEl.current) return

    const controls = globeEl.current.controls() as any
    const camera = globeEl.current.camera()

    if (!controls || !camera) return

    // 1. LİMİTLERİ ZORLA (Her çağrıldığında tekrar uygular)
    controls.minDistance = 150
    controls.maxDistance = 400
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // 2. ESKİ LISTENER VARSA SİL (Duplicate/Çakışma önleme)
    if (listenerRef.current) {
      controls.removeEventListener("change", listenerRef.current)
    }

    // 3. YENİ LISTENER OLUŞTUR
    const handleCameraChange = () => {
      if (camera.position) {
        // Three.js native fonksiyonu ile mesafe ölçümü (daha stabil)
        const dist = camera.position.length()
        const isClose = dist < 220
        
        // State update optimization
        setIsZoomedClose((prev) => (prev !== isClose ? isClose : prev))
      }
    }

    // 4. LISTENER'I KAYDET VE EKLE
    listenerRef.current = handleCameraChange
    controls.addEventListener("change", handleCameraChange)
    
    // 5. Kontrolü güncelle ki ayarlar hemen işlesin
    controls.update()
  }, [])

  useEffect(() => {
    setMounted(true)
    const updateSize = () => {
      setGlobeSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop
        const viewportHeight = window.innerHeight
        if (scrollTop > viewportHeight * 0.5) {
          setShowGlobeUI(true)
        } else {
          setShowGlobeUI(false)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
    }
    return () => container?.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Biraz gecikmeli çalıştır ki Globe tamamen render olsun
    const timeout = setTimeout(() => {
      setupGlobeControls()
    }, 100)

    return () => clearTimeout(timeout)
  }, [globeSize, setupGlobeControls])

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson",
    )
      .then((res) => res.json())
      .then((data) => {
        setCountries(data)

        const featureCount = data.features.length
        const arcCount = 60

        const initialArcs = Array.from({ length: arcCount }).map(() => {
          const rand = Math.random()
          let sourceList

          if (rand < 0.4) {
            sourceList = TURKISH_CITIES
          } else if (rand < 0.65) {
            sourceList = EUROPEAN_CITIES
          } else if (rand < 0.8) {
            sourceList = MIDDLE_EAST_CITIES
          } else if (rand < 0.9) {
            sourceList = RUSSIAN_CITIES
          } else {
            sourceList = US_CITIES
          }

          const randomCity = sourceList[Math.floor(Math.random() * sourceList.length)]

          return {
            startLat: randomCity.lat,
            startLng: randomCity.lng,
            endLat: ISTANBUL_COORDS.lat,
            endLng: ISTANBUL_COORDS.lng,
            color: getRandomColor(),
            dashAnimateTime: Math.random() * 1500 + 2500,
          }
        })
        setArcs(initialArcs)
      })
  }, [])

  const globeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: "#1e3a8a",
      emissive: "#172554",
      emissiveIntensity: 0.2,
      shininess: 0.7,
    })
  }, [])

  const getPolygonCapColor = useCallback(() => "#047857", [])
  const getPolygonSideColor = useCallback(() => "#064e3b", [])
  const getPolygonStrokeColor = useCallback(() => "#022c22", [])
  const getRingColor = useCallback(() => "#ffffff", [])
  const getArcDashAnimateTime = useCallback((d: any) => d.dashAnimateTime, [])
  const getArcDashInitialGap = useCallback(() => Math.random() * 5, [])

  if (!mounted) return null

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-slate-950 snap-y snap-mandatory scroll-smooth"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <StarsBackground />
      </div>

      {/* Top Center Logo - Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${
          showGlobeUI && (isDragging || isZoomedClose)
            ? "opacity-0 -translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {/* CarLytix Logo */}
          <img 
            src="/images/brands/carlytix-concept-a-logo.svg" 
            alt="CarLytix Logo" 
            className="h-[40px] w-auto drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] ml-2"
          />
        </div>
      </motion.div>

      {/* Top Right Navigation - Glassmorphism */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className={`fixed top-12 right-10 z-40 hidden md:flex items-center gap-8 px-6 py-3 rounded-xl bg-white/[0.06] backdrop-blur-[16px] border border-white/[0.12] transition-all duration-700 ${
          showGlobeUI && (isDragging || isZoomedClose)
            ? "opacity-0 translate-x-4 pointer-events-none"
            : "opacity-100 translate-x-0"
        }`}
      >
        {[
          { name: "Main Menu", href: "/" },
          { name: "Compare", href: "/compare" },
          { name: "CarLytix Assistant", href: "/assistant" },
          { name: "About Us", href: "/aboutus" },
        ].map((item, index) => (
          <motion.a
            key={item.name}
            href={item.href}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="text-sm text-[#d1d5db] hover:text-[#3b82f6] transition-colors duration-300 relative group"
          >
            {item.name}
            <span className="absolute bottom-[-8px] left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300" />
          </motion.a>
        ))}
      </motion.nav>

      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`fixed top-12 right-10 z-40 md:hidden p-2 rounded-lg bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] hover:bg-white/[0.18] transition-all duration-700 ${
          showGlobeUI && (isDragging || isZoomedClose)
            ? "opacity-0 translate-x-4 pointer-events-none"
            : "opacity-100 translate-x-0"
        }`}
      >
        <Menu className="w-6 h-6 text-[#e2e8f0]" />
      </motion.button>

      {/* Section 1: About Carlytix - Full Screen */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center z-10 snap-start shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-slate-950/40 pointer-events-none" />

        <div className="flex flex-col items-center text-center max-w-5xl px-6 z-20 relative">
          {/* Tag */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-px bg-emerald-500/50"></div>
            <span className="text-emerald-400 font-mono text-xs tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              ABOUT CARLYTIX
            </span>
            <div className="w-12 h-px bg-emerald-500/50"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            Akıllı Araç{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Analitiği
            </span>{" "}
            ile
            <br />
            Daha İyi{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Seçimler
            </span>{" "}
            Yapın
          </h1>

          {/* Divider */}
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mb-8"></div>

          {/* Description */}
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
            Carlytix, reklamlar ya da sponsorluklar yerine binlerce veri noktası üzerinden sürücüleri ihtiyaçlarına en
            uygun araçlarla eşleştiren bağımsız bir otomotiv analiz platformudur.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30">
          <span className="text-emerald-400/50 text-xs font-mono tracking-widest">SCROLL DOWN</span>
          <div className="animate-bounce text-emerald-400/60">
            <ChevronDown size={28} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Section 1b: Founder Note - Before Globe */}
      <section className="relative w-full min-h-screen flex items-center justify-center z-10 snap-start shrink-0 py-20">
        <div className="max-w-3xl px-6 z-20 relative">
          {/* Founder Note */}
          <div className="space-y-12">
            <div>
              <h2 className="text-emerald-400 font-mono text-xs tracking-[0.4em] font-bold uppercase mb-8 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                FOUNDER. NOTE
              </h2>
              <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-10 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.1)]">
                <div className="flex items-start gap-6 mb-6">
                  <div className="p-4 bg-emerald-500/10 rounded-full flex-shrink-0">
                    <Quote className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Eray Kan</h3>
                    <p className="text-emerald-400/70 text-sm font-mono tracking-wider">Founder & Developer</p>
                  </div>
                </div>

                <div className="space-y-6 text-base text-slate-300 leading-relaxed">
                  <p className="text-white/80">
                    "Ben Eray Kan, Carlytix'i sıfırdan geliştiren tek yazılımcıyım. Amacım, araç satın alma sürecindeki
                    belirsizlikleri ortadan kaldırarak, kullanıcıların kararlarını net veriler ve akıllı analizlerle
                    desteklemek."
                  </p>
                  <p className="border-t border-emerald-500/20 pt-6 italic text-emerald-100/60">
                    "Carlytix, yerel bir proje olarak başladı ancak hedefi sınırların ötesine geçerek dünya genelinde
                    sürücülere daha doğru öneriler sunmak."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Globe Visualization - Full Screen */}
      <section className="relative w-full h-screen z-10 snap-start shrink-0 overflow-hidden">
        {/* Top Left Logo & Status - Only visible when in Globe section */}
        <div
          className={`absolute left-8 top-8 z-30 transition-all duration-700 ${
            isDragging || isZoomedClose
              ? "opacity-0 translate-x-[-20px] pointer-events-none"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="flex flex-col gap-2">
            {/* Logo */}
            <img 
              src="/images/brands/carlytix-concept-a-logo.svg" 
              alt="CarLytix Logo" 
              className="h-20 w-auto"
            />
            {/* Status Text */}
            <div className="text-xs font-mono text-slate-400 tracking-wider">
              <span className="text-emerald-400 font-bold">ISTANBUL HUB ACTIVE</span>
              <span className="text-slate-500 mx-2">///</span>
              <span className="text-blue-400">MONITORING SIGNALS</span>
            </div>
          </div>
        </div>

        {/* Left Info Cards - Only visible when in Globe section */}
        <div
          className={`absolute left-12 top-1/2 -translate-y-1/2 z-30 transition-all duration-700 flex flex-col gap-6 ${
            isDragging || isZoomedClose
              ? "opacity-0 translate-x-[-20px] pointer-events-none"
              : "opacity-100 translate-x-0"
          }`}
        >
          <InfoCard
            icon={<Smile className="w-8 h-8" strokeWidth={1.5} />}
            value="4.8/5"
            label="User Satisfaction Score"
          />

          <InfoCard
            icon={<Users className="w-8 h-8" strokeWidth={1.5} />}
            value="12,500"
            label="Daily Unique Visitors"
          />

          <InfoCard
            icon={<Target className="w-8 h-8" strokeWidth={1.5} />}
            value="92%"
            label="Recommendation Match Score"
          />

          <InfoCard
            icon={<Bot className="w-8 h-8" strokeWidth={1.5} />}
            value="<1s"
            label="AI Processing Time"
          />
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Interaction Masks */}
          <div className="absolute top-0 left-0 w-full h-[15%] pointer-events-auto" />
          <div className="absolute bottom-0 left-0 w-full h-[15%] pointer-events-auto" />
          <div className="absolute top-[15%] left-0 w-[25%] h-[70%] pointer-events-auto" />
          <div className="absolute top-[15%] right-0 w-[25%] h-[70%] pointer-events-auto" />
        </div>

        <div
          className="relative z-10 w-full h-full flex items-center justify-center"
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
        >
          <Globe
            ref={globeEl}
            width={globeSize.width}
            height={globeSize.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={null}
            globeMaterial={globeMaterial}
            polygonsData={countries.features}
            polygonCapColor={getPolygonCapColor}
            polygonSideColor={getPolygonSideColor}
            polygonStrokeColor={getPolygonStrokeColor}
            polygonAltitude={0.01}
            atmosphereColor="#3b82f6"
            atmosphereAltitude={0.15}
            arcsData={arcs}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={10}
            arcDashInitialGap={getArcDashInitialGap}
            arcDashAnimateTime={getArcDashAnimateTime}
            arcStroke={0.5}
            arcAltitudeAutoScale={0.5}
            ringsData={rings}
            ringColor={getRingColor}
            ringMaxRadius={5}
            ringPropagationSpeed={5}
            ringRepeatPeriod={1000}
            onGlobeReady={() => {
              if (globeEl.current) {
                // İlk açılış pozisyonu - İstanbul'a odaklı, animasyonsuz
                globeEl.current.pointOfView({ lat: 41.0082, lng: 28.9784, altitude: 1.8 }, 0)
                // Kontrolleri ayarla
                setupGlobeControls()
              }
            }}
          />
        </div>
      </section>
    </div>
  )
}

function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    const stars = Array.from({ length: 1500 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.1,
      opacity: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      blinkSpeed: Math.random() * 0.02 + 0.005,
      blinkDir: 1,
    }))

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
      gradient.addColorStop(0, "#0f172a")
      gradient.addColorStop(1, "#020617")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      stars.forEach((star) => {
        star.opacity += star.blinkSpeed * star.blinkDir
        if (star.opacity > 1 || star.opacity < 0.1) {
          star.blinkDir *= -1
        }

        star.y -= star.speed
        if (star.y < 0) {
          star.y = height
          star.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.opacity))})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
}

function InfoCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 p-6 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] w-[340px]">
      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
          {value}
        </span>
        <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase leading-tight mt-1">
          {label}
        </span>
      </div>
    </div>
  )
}
