/**
 * HeroPointer — Mouse parallax tracking for the cinematic hero
 *
 * Tracks mouse position within the hero container and provides
 * smoothly interpolated normalized coordinates (-1 to 1).
 *
 * Uses GSAP ticker instead of an independent RAF loop, so pointer
 * interpolation runs on the same single clock as everything else.
 *
 * Returns a ref (not state) to avoid per-frame React re-renders.
 * Consumers should read from the ref inside their own GSAP/animation callbacks.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface PointerPosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export interface HeroPointerOptions {
  enabled?: boolean;
  reduceMotion?: boolean;
  sensitivity?: number;
  damping?: number;
  maxOffset?: number;
  containerSelector?: string;
}

export interface HeroPointerReturn {
  positionRef: React.RefObject<PointerPosition>;
  isInsideRef: React.RefObject<boolean>;
}

const ZERO_POSITION: PointerPosition = { x: 0, y: 0, normalizedX: 0, normalizedY: 0 };

export function useHeroPointer(options: HeroPointerOptions = {}): HeroPointerReturn {
  const {
    enabled = true,
    reduceMotion = false,
    sensitivity = 1,
    damping = 0.08,
    maxOffset = 1,
    containerSelector = '[data-cinematic-hero]',
  } = options;

  const positionRef = useRef<PointerPosition>({ ...ZERO_POSITION });
  const isInsideRef = useRef(false);
  const targetRef = useRef<PointerPosition>({ ...ZERO_POSITION });
  const tickerFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (!enabled || reduceMotion) {
      positionRef.current = { ...ZERO_POSITION };
      isInsideRef.current = false;
      return;
    }

    // Check system-level reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const element = document.querySelector(containerSelector) as HTMLElement;
    if (!element) return;

    const handleMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normalizedX = ((x / rect.width) * 2 - 1) * sensitivity;
      const normalizedY = ((y / rect.height) * 2 - 1) * sensitivity;

      targetRef.current = {
        x,
        y,
        normalizedX: Math.max(-maxOffset, Math.min(maxOffset, normalizedX)),
        normalizedY: Math.max(-maxOffset, Math.min(maxOffset, normalizedY)),
      };
    };

    const handleEnter = () => { isInsideRef.current = true; };
    const handleLeave = () => {
      isInsideRef.current = false;
      // Ease back to center
      targetRef.current = { ...ZERO_POSITION };
    };

    element.addEventListener('mousemove', handleMove, { passive: true });
    element.addEventListener('mouseenter', handleEnter);
    element.addEventListener('mouseleave', handleLeave);

    // ── GSAP ticker callback — smooth interpolation on the single clock ──
    const tickerFn = () => {
      const current = positionRef.current;
      const target = targetRef.current;

      const dx = target.normalizedX - current.normalizedX;
      const dy = target.normalizedY - current.normalizedY;

      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        positionRef.current = {
          x: current.x + (target.x - current.x) * damping,
          y: current.y + (target.y - current.y) * damping,
          normalizedX: current.normalizedX + dx * damping,
          normalizedY: current.normalizedY + dy * damping,
        };
      }
    };

    tickerFnRef.current = tickerFn;
    gsap.ticker.add(tickerFn);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseenter', handleEnter);
      element.removeEventListener('mouseleave', handleLeave);
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }
    };
  }, [enabled, reduceMotion, sensitivity, damping, maxOffset, containerSelector]);

  return { positionRef, isInsideRef };
}