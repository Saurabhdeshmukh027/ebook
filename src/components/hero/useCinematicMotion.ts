/**
 * useCinematicMotion — Unified Motion Coordinator
 *
 * Coordinates two modes on the single GSAP ticker:
 *   MODE A: Cinematic Idle Motion
 *     - Before user scrolls, cinematic progress slowly advances at ~0.006/s
 *     - Gently breathes and holds near ~0.09 (within mystery phase)
 *     - Never loops or snaps
 *
 *   MODE B: User Scroll Control
 *     - When user scrolls, control transfers with zero jump using offset decay:
 *       targetProgress = scrollProgress + idleOffset * (1 - scrollProgress)^2
 *     - Zero discontinuity, zero dead-zone
 *     - Settles naturally when scroll stops
 *
 * Architecture:
 *   idleProgress (Mode A)  ──\
 *                             ──> authoritative targetProgress ──> VideoScrubber ──> video.currentTime
 *   scrollProgress (Mode B) ──/
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';

export interface UseCinematicMotionOptions {
  enabled?: boolean;
  reducedMotion?: boolean;
  maxIdleProgress?: number;
  idleSpeed?: number;
  onTargetProgressChange?: (progress: number) => void;
}

export interface UseCinematicMotionReturn {
  handleScrollProgress: (progress: number) => void;
  handleScrollVelocity: (velocity: number) => void;
  hasUserInteracted: boolean;
  mode: 'idle' | 'scroll';
  targetProgressRef: React.MutableRefObject<number>;
  scrollVelocityRef: React.MutableRefObject<number>;
}

const DEFAULT_MAX_IDLE = 0.09; // 9% of video duration (~0.9s of 10s video, strictly mystery phase)
const DEFAULT_IDLE_SPEED = 0.006; // advances ~0.006 progress per second (~15s to reach 0.09)

export function useCinematicMotion({
  enabled = true,
  reducedMotion = false,
  maxIdleProgress = DEFAULT_MAX_IDLE,
  idleSpeed = DEFAULT_IDLE_SPEED,
  onTargetProgressChange,
}: UseCinematicMotionOptions = {}): UseCinematicMotionReturn {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [mode, setMode] = useState<'idle' | 'scroll'>('idle');

  // Internal refs to avoid per-frame re-renders
  const modeRef = useRef<'idle' | 'scroll'>('idle');
  const hasInteractedRef = useRef(false);

  const idleProgressRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const idleOffsetRef = useRef(0);
  const targetProgressRef = useRef(0);

  const onTargetProgressChangeRef = useRef(onTargetProgressChange);
  onTargetProgressChangeRef.current = onTargetProgressChange;

  // ── Mode Switch: Idle → Scroll Handoff ──
  const switchToScroll = useCallback((scrollProgress: number) => {
    if (modeRef.current === 'scroll') return;

    modeRef.current = 'scroll';
    setMode('scroll');

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setHasUserInteracted(true);
    }

    // Capture idle offset at exact moment of takeover
    // This ensures: targetProgress === currentIdleProgress at instant of handoff
    const currentVisual = idleProgressRef.current;
    idleOffsetRef.current = Math.max(0, currentVisual - scrollProgress);
  }, []);

  // ── Scroll input handler (called by ScrollTrigger / CinematicTimeline) ──
  const handleScrollProgress = useCallback((progress: number) => {
    if (reducedMotion) return;

    scrollProgressRef.current = Math.max(0, Math.min(1, progress));

    // If user has scrolled past a tiny threshold (1px equivalent), switch to scroll mode
    if (modeRef.current === 'idle' && progress > 0.0005) {
      switchToScroll(progress);
    }
  }, [reducedMotion, switchToScroll]);

  // ── Velocity handler ──
  const handleScrollVelocity = useCallback((velocity: number) => {
    scrollVelocityRef.current = velocity;

    // Any velocity detection switches to scroll mode
    if (modeRef.current === 'idle' && Math.abs(velocity) > 0.001) {
      switchToScroll(scrollProgressRef.current);
    }
  }, [switchToScroll]);

  // ── Wheel / Touch event detection for immediate zero-latency handoff ──
  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const onUserGesture = () => {
      if (modeRef.current === 'idle') {
        switchToScroll(scrollProgressRef.current);
      }
    };

    window.addEventListener('wheel', onUserGesture, { passive: true, once: true });
    window.addEventListener('touchmove', onUserGesture, { passive: true, once: true });

    return () => {
      window.removeEventListener('wheel', onUserGesture);
      window.removeEventListener('touchmove', onUserGesture);
    };
  }, [enabled, reducedMotion, switchToScroll]);

  // ── GSAP Ticker: Coordinates progress progression ──
  useEffect(() => {
    if (!enabled || reducedMotion) {
      targetProgressRef.current = 0;
      onTargetProgressChangeRef.current?.(0);
      return;
    }

    let breathingTime = 0;

    const tickerFn = (_time: number, deltaTime: number) => {
      const dtSeconds = Math.min(deltaTime / 1000, 0.1); // cap against tab backgrounding

      if (modeRef.current === 'idle') {
        // Mode A: Cinematic Idle Motion
        if (idleProgressRef.current < maxIdleProgress) {
          // Slow forward drift with gentle ease-out as it approaches maxIdleProgress
          const remainingFactor = Math.max(0.2, 1 - (idleProgressRef.current / maxIdleProgress) * 0.7);
          idleProgressRef.current = Math.min(
            maxIdleProgress,
            idleProgressRef.current + dtSeconds * idleSpeed * remainingFactor
          );
          targetProgressRef.current = idleProgressRef.current;
        } else {
          // Subtle breathing oscillation around maxIdleProgress (±0.002, 5-second breath)
          breathingTime += dtSeconds;
          const breathingDelta = Math.sin(breathingTime * 1.2) * 0.002;
          targetProgressRef.current = Math.max(0.01, maxIdleProgress + breathingDelta);
        }
      } else {
        // Mode B: User Scroll Control
        const s = scrollProgressRef.current;
        const offset = idleOffsetRef.current;

        // Smooth offset decay formula:
        // As s approaches 1, the offset cleanly decays to 0 via (1 - s)^2
        const effectiveOffset = offset * Math.pow(Math.max(0, 1 - s), 2);
        const computedTarget = Math.max(0, Math.min(1, s + effectiveOffset));

        targetProgressRef.current = computedTarget;
      }

      onTargetProgressChangeRef.current?.(targetProgressRef.current);
    };

    gsap.ticker.add(tickerFn);

    return () => {
      gsap.ticker.remove(tickerFn);
    };
  }, [enabled, reducedMotion, maxIdleProgress, idleSpeed]);

  return {
    handleScrollProgress,
    handleScrollVelocity,
    hasUserInteracted,
    mode,
    targetProgressRef,
    scrollVelocityRef,
  };
}
