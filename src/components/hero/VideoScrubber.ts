/**
 * Video Scrubber — Smooth video time interpolation
 *
 * Drives video.currentTime from a target progress value.
 * Uses GSAP ticker for frame updates instead of an independent RAF loop,
 * ensuring all animation runs on a single coordinated clock.
 *
 * Pipeline:
 *   ScrollTrigger progress → setTargetProgress(0..1)
 *     ↓ (per GSAP frame)
 *   currentTime += (targetTime - currentTime) × smoothing
 *     ↓
 *   video.currentTime = smoothed value
 */

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

export interface VideoScrubberOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
  smoothing?: number;
  onProgress?: (progress: number, currentTime: number, duration: number) => void;
}

export interface VideoScrubberReturn {
  seekTo: (progress: number) => void;
  setTargetProgress: (progress: number) => void;
  getSmoothedProgress: () => number;
}

export function useVideoScrubber({
  videoRef,
  enabled = true,
  smoothing = 0.1,
  onProgress,
}: VideoScrubberOptions): VideoScrubberReturn {
  const targetProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const durationRef = useRef(0);
  const tickerIdRef = useRef<((time: number, deltaTime: number) => void) | null>(null);

  // Store onProgress in a ref to avoid re-registering the ticker
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;

    // Capture duration when available
    const captureDuration = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };

    captureDuration();
    video.addEventListener('loadedmetadata', captureDuration);

    // ── GSAP ticker callback — runs on the single global RAF ──
    const tickerFn = (_time: number, deltaTime: number) => {
      const duration = durationRef.current;
      if (!duration || duration <= 0) return;

      const targetTime = Math.max(0, Math.min(duration, targetProgressRef.current * duration));
      const currentTime = video.currentTime;
      const diff = targetTime - currentTime;

      // Adaptive smoothing based on delta time (frame-rate independent)
      // Base smoothing ~0.1 per 16.67ms frame; scale by actual deltaTime
      const frameFactor = Math.min(deltaTime / 16.67, 3); // cap for large gaps
      const adaptiveSmoothing = 1 - Math.pow(1 - smoothing, frameFactor);

      if (Math.abs(diff) > 0.016) {
        // Interpolate toward target
        const nextTime = Math.max(0, Math.min(duration, currentTime + diff * adaptiveSmoothing));
        video.currentTime = nextTime;

        smoothedProgressRef.current = nextTime / duration;
        onProgressRef.current?.(smoothedProgressRef.current, nextTime, duration);
      } else if (Math.abs(diff) > 0.001) {
        // Close enough — snap to exact target
        video.currentTime = targetTime;
        smoothedProgressRef.current = targetProgressRef.current;
        onProgressRef.current?.(targetProgressRef.current, targetTime, duration);
      }
      // else: already at target, do nothing
    };

    tickerIdRef.current = tickerFn;
    gsap.ticker.add(tickerFn);

    return () => {
      video.removeEventListener('loadedmetadata', captureDuration);
      if (tickerIdRef.current) {
        gsap.ticker.remove(tickerIdRef.current);
        tickerIdRef.current = null;
      }
    };
  }, [videoRef, enabled, smoothing]);

  const setTargetProgress = useCallback((progress: number) => {
    targetProgressRef.current = Math.max(0, Math.min(1, progress));
  }, []);

  const seekTo = useCallback((progress: number) => {
    const video = videoRef.current;
    if (!video) return;

    const duration = durationRef.current;
    if (duration <= 0) return;

    const clamped = Math.max(0, Math.min(1, progress));
    targetProgressRef.current = clamped;
    smoothedProgressRef.current = clamped;
    video.currentTime = clamped * duration;
    onProgressRef.current?.(clamped, clamped * duration, duration);
  }, [videoRef]);

  return {
    seekTo,
    setTargetProgress,
    getSmoothedProgress: () => smoothedProgressRef.current,
  };
}

export type { VideoScrubberReturn as VideoScrubberReturnType };