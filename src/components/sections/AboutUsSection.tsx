"use client"

import type React from "react"

import { useEffect, useState, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
import type { GlobeMethods } from "react-globe.gl"
import * as THREE from "three"
import { Users, Target, Smile } from "lucide-react"

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
  const [countries, setCountries] = useState({ features: [] })
  const [arcs, setArcs] = useState<any[]>([])
  const [rings, setRings] = useState<any[]>([ISTANBUL_COORDS])
  const [mounted, setMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [globeSize, setGlobeSize] = useState({ width: 0, height: 0 })

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

  if (!mounted) return null

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <StarsBackground />
      </div>

      <div
        className={`absolute left-8 top-1/2 -translate-y-1/2 z-30 transition-opacity duration-300 flex flex-col gap-6 ${
          isDragging ? "opacity-0" : "opacity-100"
        }`}
      >
        <InfoCard
          icon={<Smile className="w-8 h-8" strokeWidth={1.5} />}
          value="4.8/5"
          label="User Satisfaction Score"
        />

        <InfoCard icon={<Users className="w-8 h-8" strokeWidth={1.5} />} value="12,500" label="Daily Unique Visitors" />

        <InfoCard
          icon={<Target className="w-8 h-8" strokeWidth={1.5} />}
          value="92%"
          label="Recommendation Match Score"
        />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[15%] pointer-events-auto" />
        <div className="absolute bottom-0 left-0 w-full h-[15%] pointer-events-auto" />
        <div className="absolute top-[15%] left-0 w-[25%] h-[70%] pointer-events-auto" />
        <div className="absolute top-[15%] right-0 w-[25%] h-[70%] pointer-events-auto" />
      </div>

      <div
        className="relative z-10"
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        style={{
          width: globeSize.width,
          height: globeSize.height,
        }}
      >
        <Globe
          ref={globeEl}
          width={globeSize.width}
          height={globeSize.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={null}
          globeMaterial={globeMaterial}
          polygonsData={countries.features}
          polygonCapColor={() => "#047857"}
          polygonSideColor={() => "#064e3b"}
          polygonStrokeColor={() => "#022c22"}
          polygonAltitude={0.01}
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.15}
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={10}
          arcDashInitialGap={() => Math.random() * 5}
          arcDashAnimateTime={(d: any) => d.dashAnimateTime}
          arcStroke={0.5}
          arcAltitudeAutoScale={0.5}
          ringsData={rings}
          ringColor={() => "#ffffff"}
          ringMaxRadius={5}
          ringPropagationSpeed={5}
          ringRepeatPeriod={1000}
          onGlobeReady={() => {
            if (globeEl.current) {
              const controls = globeEl.current.controls() as any

              controls.autoRotate = true
              controls.autoRotateSpeed = 0.5

              controls.enableDamping = true
              controls.dampingFactor = 0.1

              controls.minDistance = 150
              controls.maxDistance = 400

              globeEl.current.pointOfView({ lat: 41, lng: 28, altitude: 2.5 }, 1000)
            }
          }}
        />
      </div>

      <div className="absolute top-10 left-10 z-30 pointer-events-none">
        <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">
          GLOBAL <span className="text-emerald-400">CONNECT</span>
        </h1>
        <p className="text-emerald-200/70 mt-2 text-sm font-mono">ISTANBUL HUB ACTIVE /// MONITORING SIGNALS</p>
      </div>
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
