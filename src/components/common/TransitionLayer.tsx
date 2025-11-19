"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransitionStore } from "@/hooks/usePageCurtain";

// Animation configuration
const CURTAIN_DURATION_IN = 0.6; // Curtain rising (entry)
const CURTAIN_DURATION_OUT = 0.4; // Curtain exiting (leaving)
const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]; // Custom easing for smooth motion

export function TransitionLayer() {
  const { isTransitioning } = useTransitionStore();

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="curtain-overlay"
          initial={{ y: "100%" }}
          animate={{ 
            y: 0,
            transition: {
              duration: CURTAIN_DURATION_IN,
              ease: CURTAIN_EASE,
            }
          }}
          exit={{ 
            y: "-100%",
            transition: {
              duration: CURTAIN_DURATION_OUT,
              ease: CURTAIN_EASE,
            }
          }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0f172a] via-slate-900 to-[#0f172a] pointer-events-none"
          style={{ willChange: "transform" }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative"
            >
              {/* Carlytix logo or loading indicator */}
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-20 h-20 border-4 border-[#2db7f5] border-t-transparent rounded-full"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-lg font-semibold tracking-wide"
                >
                  Yükleniyor...
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* Gradient overlay for extra depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#2db7f5]/5 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
