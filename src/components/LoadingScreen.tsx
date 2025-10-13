"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 30;
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }
      setProgress(Math.floor(currentProgress));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#1a1f2e_0%,#0f1419_100%)]"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Pulsating glow */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] blur-3xl"
      />

      {/* Content */}
      <div className="flex flex-col items-center z-10 relative -top-[5%]">
        {/* Blur circle behind logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent)] blur-[80px] pointer-events-none"
        />

        {/* Logo - Icon + Text Vertical */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center mb-[60px]"
        >
          {/* Stylized C Icon */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          >
            <defs>
              <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Drift trail C shape */}
            <path
              d="M 60 15 Q 70 15 75 20 Q 80 25 80 35 L 80 45 Q 80 55 75 60 Q 70 65 60 65"
              stroke="url(#iconGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 55 20 Q 63 20 67 24 Q 71 28 71 36 L 71 44 Q 71 52 67 56 Q 63 60 55 60"
              stroke="url(#iconGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Speed lines */}
            <line x1="10" y1="30" x2="35" y2="30" stroke="url(#iconGradient)" strokeWidth="3" strokeLinecap="round" />
            <line x1="5" y1="40" x2="30" y2="40" stroke="url(#iconGradient)" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="50" x2="35" y2="50" stroke="url(#iconGradient)" strokeWidth="3" strokeLinecap="round" />
          </svg>

          {/* CarLytix Text */}
          <div className="mt-5 flex items-baseline gap-0">
            <span className="text-[48px] font-normal tracking-[-0.02em] bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">
              Car
            </span>
            <span className="text-[48px] font-bold tracking-[-0.02em] bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">
              Lytix
            </span>
          </div>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-[400px]"
        >
          {/* Outer Container */}
          <div className="relative w-full h-2 rounded-full bg-[#1e293b] border border-[#334155] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* Progress Fill with Shimmer */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className="absolute left-0 top-0 h-full rounded-full overflow-hidden"
            >
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-full h-full rounded-full shadow-[0_0_16px_rgba(59,130,246,0.7)] bg-[length:200%_100%]"
                style={{
                  backgroundImage: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
                }}
              />
            </motion.div>
          </div>

          {/* Percentage Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-center text-sm text-[#94a3b8] font-mono font-medium"
          >
            Loading... {progress}%
          </motion.p>
        </motion.div>
      </div>

      {/* Version Number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 right-6 text-[10px] text-[#475569]"
      >
        v1.0.0
      </motion.div>
    </motion.div>
  );
}