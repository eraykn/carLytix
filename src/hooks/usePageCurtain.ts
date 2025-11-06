"use client";

import { create } from "zustand";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

// Constants
const TRANSITION_DURATION = 1000; // ms - total animation time
const CURTAIN_UP_DURATION = 600; // ms - curtain rising to cover screen
const PAGE_SETTLE_DELAY = 200; // ms - delay before curtain exits
const CURTAIN_EXIT_DURATION = 400; // ms - curtain exiting upward
const GUARD_DELAY = 100; // ms - prevents rapid clicks

// Zustand store for global transition state
interface TransitionStore {
  isTransitioning: boolean;
  setTransitioning: (value: boolean) => void;
}

export const useTransitionStore = create<TransitionStore>((set) => ({
  isTransitioning: false,
  setTransitioning: (value: boolean) => set({ isTransitioning: value }),
}));

// Main hook for page transitions
export function usePageCurtain() {
  const router = useRouter();
  const { isTransitioning, setTransitioning } = useTransitionStore();
  const isNavigatingRef = useRef(false);

  const navigateWithCurtain = useCallback(
    (href: string, onComplete?: () => void) => {
      // Guard: Prevent rapid clicks
      if (isNavigatingRef.current || isTransitioning) {
        return;
      }

      isNavigatingRef.current = true;
      setTransitioning(true);

      // Phase 1: Curtain rises up to cover screen completely
      setTimeout(() => {
        // Navigate to new page while curtain is fully covering
        router.push(href);

        // Phase 2: Wait for new page to settle, then exit curtain
        setTimeout(() => {
          setTransitioning(false);
          isNavigatingRef.current = false;

          if (onComplete) {
            onComplete();
          }
        }, PAGE_SETTLE_DELAY + CURTAIN_EXIT_DURATION);
      }, CURTAIN_UP_DURATION);

      // Reset guard after total duration + buffer
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, TRANSITION_DURATION + GUARD_DELAY);
    },
    [router, isTransitioning, setTransitioning]
  );

  return {
    navigateWithCurtain,
    isTransitioning,
  };
}
