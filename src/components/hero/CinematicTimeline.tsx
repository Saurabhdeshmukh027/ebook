/**
 * CinematicTimeline — ScrollTrigger-based cinematic progress driver
 *
 * Creates a single ScrollTrigger that pins the hero and produces
 * a normalized 0→1 progress value as the user scrolls.
 *
 * The scroll position is already smooth because Lenis feeds it to
 * ScrollTrigger via the global GSAP ticker. No additional scroll
 * listeners or ScrollTrigger.refresh() calls needed here.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CinematicPhase {
  id: string;
  start: number;
  end: number;
  onEnter?: (progress: number) => void;
  onUpdate?: (progress: number) => void;
  onLeave?: () => void;
  onEnterBack?: (progress: number) => void;
}

export interface CinematicTimelineProps {
  phases: CinematicPhase[];
  containerRef: React.RefObject<HTMLElement | null>;
  pinElement?: React.RefObject<HTMLElement | null>;
  pinSpacing?: number;
  onProgress?: (progress: number) => void;
  onVelocity?: (velocity: number) => void;
  onComplete?: () => void;
  enabled?: boolean;
  reducedMotion?: boolean;
}

export function CinematicTimeline({
  phases,
  containerRef,
  pinElement,
  pinSpacing = 4,
  onProgress,
  onVelocity,
  onComplete,
  enabled = true,
  reducedMotion = false,
}: CinematicTimelineProps) {
  const completionRef = useRef(false);
  const lastProgressRef = useRef(0);

  // Store callbacks in refs to avoid re-creating ScrollTrigger
  const onProgressRef = useRef(onProgress);
  const onVelocityRef = useRef(onVelocity);
  const onCompleteRef = useRef(onComplete);
  const phasesRef = useRef(phases);

  onProgressRef.current = onProgress;
  onVelocityRef.current = onVelocity;
  onCompleteRef.current = onComplete;
  phasesRef.current = phases;

  useEffect(() => {
    if (!enabled || reducedMotion || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const pinTarget = pinElement?.current || container;

    const ctx = gsap.context(() => {
      // Create a minimal timeline — the progress comes from ScrollTrigger
      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${pinSpacing * 100}%`,
          // scrub: true works best with Lenis because Lenis already provides
          // smooth interpolated scroll positions. Adding a numeric scrub value
          // on top of Lenis would double-smooth, adding latency.
          scrub: true,
          pin: pinTarget,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            lastProgressRef.current = progress;

            // Dispatch progress to all listeners
            onProgressRef.current?.(progress);

            // Calculate velocity from ScrollTrigger
            const velocity = self.getVelocity() / 1000; // normalize
            onVelocityRef.current?.(velocity);

            // Fire phase callbacks
            const currentPhases = phasesRef.current;
            for (let i = 0; i < currentPhases.length; i++) {
              const phase = currentPhases[i];
              if (progress >= phase.start && progress <= phase.end) {
                const phaseProgress = (progress - phase.start) / (phase.end - phase.start);
                phase.onUpdate?.(phaseProgress);
              }
            }

            // Completion check
            if (progress >= 1 && !completionRef.current) {
              completionRef.current = true;
              onCompleteRef.current?.();
            } else if (progress < 1) {
              completionRef.current = false;
            }
          },
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  // Only re-create when structural props change, not callbacks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, reducedMotion, containerRef, pinElement, pinSpacing]);

  return null;
}