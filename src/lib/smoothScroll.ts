/**
 * Global Smooth Scroll Engine
 *
 * Architecture:
 *   Native wheel/touch input
 *          ↓
 *   Lenis (inertial interpolation)
 *          ↓
 *   GSAP ticker (single coordinated RAF)
 *          ↓
 *   ScrollTrigger.update()
 *          ↓
 *   Cinematic timelines
 *
 * ONE global instance. Initialized once from App.
 * No competing RAF loops. No duplicate initialization.
 */

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Singleton ──────────────────────────────────────────────────────────────

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let isInitialized = false;

// ─── Public accessors ───────────────────────────────────────────────────────

export function getGlobalLenis(): Lenis | null {
  return lenisInstance;
}

export function isSmoothScrollActive(): boolean {
  return lenisInstance !== null && !lenisInstance.isStopped;
}

// ─── Reduced motion detection ───────────────────────────────────────────────

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Mobile detection ───────────────────────────────────────────────────────

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || 'ontouchstart' in window;
}

// ─── Init / Destroy ─────────────────────────────────────────────────────────

export function initSmoothScroll(): Lenis | null {
  // Guard: already initialized
  if (isInitialized && lenisInstance) {
    return lenisInstance;
  }

  // Guard: reduced motion → use native scroll
  if (prefersReducedMotion()) {
    isInitialized = true;
    return null;
  }

  const mobile = isMobileDevice();

  const lenis = new Lenis({
    lerp: mobile ? 0.12 : 0.08,
    duration: mobile ? 1.0 : 1.2,
    easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    wheelMultiplier: mobile ? 0.8 : 1,
    touchMultiplier: mobile ? 1.5 : 2,
    touchInertiaMultiplier: 35,
    syncTouch: true,
    syncTouchLerp: 0.06,
    // Lenis v1.1+ normalizes wheel delta
  });

  lenisInstance = lenis;
  isInitialized = true;

  // ── Coordinate Lenis with GSAP ticker (SINGLE RAF) ──
  // The GSAP ticker calls lenis.raf(), which advances Lenis's interpolation.
  // Lenis then calls ScrollTrigger.update() to sync trigger positions.
  tickerCallback = (time: number) => {
    lenis.raf(time * 1000); // GSAP ticker time is in seconds, Lenis expects ms
  };

  gsap.ticker.add(tickerCallback);

  // Disable GSAP's built-in lag smoothing to prevent frame drops
  // from causing sudden jumps
  gsap.ticker.lagSmoothing(0);

  // ── Connect Lenis scroll events to ScrollTrigger ──
  lenis.on('scroll', ScrollTrigger.update);

  return lenis;
}

export function destroySmoothScroll(): void {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  isInitialized = false;
}

// ─── Programmatic scroll helpers ────────────────────────────────────────────

export function scrollTo(
  target: number | string | HTMLElement,
  options: {
    duration?: number;
    easing?: (t: number) => number;
    immediate?: boolean;
    offset?: number;
  } = {}
): void {
  const {
    duration = 1.2,
    easing = (t: number) => 1 - Math.pow(1 - t, 3),
    immediate = false,
    offset = 0,
  } = options;

  if (lenisInstance) {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        lenisInstance.scrollTo(element as HTMLElement, { duration, easing, immediate, offset });
      }
    } else {
      lenisInstance.scrollTo(target, { duration, easing, immediate, offset });
    }
  } else {
    // Fallback: native scroll when Lenis isn't active (reduced motion)
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target + offset, behavior: 'auto' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
}

export function scrollToTop(options?: { duration?: number }): void {
  scrollTo(0, options);
}

export function stopSmoothScroll(): void {
  lenisInstance?.stop();
}

export function startSmoothScroll(): void {
  lenisInstance?.start();
}

// ─── React hook: call ONCE from App ─────────────────────────────────────────

export function useSmoothScroll(): Lenis | null {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = initSmoothScroll();

    // Listen for reduced-motion changes at runtime
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // User enabled reduced motion → destroy Lenis
        destroySmoothScroll();
        lenisRef.current = null;
      } else {
        // User disabled reduced motion → reinitialize
        lenisRef.current = initSmoothScroll();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      destroySmoothScroll();
    };
  }, []);

  return lenisRef.current;
}