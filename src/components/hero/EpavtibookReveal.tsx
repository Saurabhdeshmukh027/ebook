/**
 * EpavtibookReveal — Cinematic product name reveal overlay
 *
 * Strict sequential choreography:
 *   1. ENTRANCE (~800ms): E-PavtiBook reveals in golden light at center stage
 *   2. HOLD (2.5s): E-PavtiBook holds alone on screen — clean cinematic pause
 *   3. EXIT (~600ms): E-PavtiBook exits (opacity 1→0, translateY 0→-10px, scale 1→0.98)
 *   4. COMPLETION: Triggers onExitComplete callback for the breathing gap
 *
 * There is NEVER simultaneous display with HeroContent.
 * Respects prefers-reduced-motion: completes immediately.
 */

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { Language } from '../../types';

// ── Localized reveal content ──────────────────────────────────────────────────

const REVEAL_CONTENT = {
  en: {
    productName: 'E-PavtiBook',
    tagline: 'Digital Pavti. Transparent Records.',
    cta: 'Explore E-PavtiBook',
  },
  mr: {
    productName: 'E-PavtiBook',
    tagline: 'डिजिटल पावती. पारदर्शक नोंदी.',
    cta: 'E-PavtiBook एक्सप्लोर करा',
  },
  hi: {
    productName: 'E-PavtiBook',
    tagline: 'डिजिटल पावती. पारदर्शी रिकॉर्ड.',
    cta: 'E-PavtiBook एक्सप्लोर करें',
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export interface EpavtibookRevealProps {
  isTriggered: boolean;
  isExitComplete?: boolean;
  language?: Language;
  holdDurationMs?: number;
  exitDurationMs?: number;
  onExitComplete?: () => void;
  className?: string;
}

export function EpavtibookReveal({
  isTriggered,
  isExitComplete = false,
  language = 'en',
  holdDurationMs = 2500,
  exitDurationMs = 600,
  onExitComplete,
  className = '',
}: EpavtibookRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasCompletedRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const content = REVEAL_CONTENT[language];

  // ── GSAP Choreography Timeline: Entrance → Hold → Exit ──
  useEffect(() => {
    if (!isTriggered || !containerRef.current) return;

    if (prefersReducedMotion) {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onExitComplete?.();
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onExitComplete?.();
          }
        },
      });
      timelineRef.current = tl;

      // ── PHASE 1: ENTRANCE (0 to ~800ms) ──
      tl.to(
        '.reveal-atmosphere',
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.inOut',
        },
        0
      );

      tl.to(
        '.reveal-product-name',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.1
      );

      // ── PHASE 2: HOLD (2.5s clean cinematic pause alone on screen) ──
      const holdSec = holdDurationMs / 1000;
      tl.to({}, { duration: holdSec });

      // ── PHASE 3: EXIT (500–700ms refined cinematic exit) ──
      // opacity: 1 → 0, translateY: 0 → -10px, scale: 1 → 0.98
      const exitSec = exitDurationMs / 1000;
      tl.to(
        '.reveal-product-name',
        {
          opacity: 0,
          y: -10,
          scale: 0.98,
          duration: exitSec,
          ease: 'power2.inOut',
        }
      );

      tl.to(
        '.reveal-atmosphere',
        {
          opacity: 0,
          duration: exitSec,
          ease: 'power1.inOut',
        },
        `<`
      );
    }, containerRef);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [isTriggered, prefersReducedMotion, holdDurationMs, exitDurationMs, onExitComplete]);

  // Don't render until triggered or after complete exit
  if (!isTriggered || isExitComplete) return null;

  return (
    <div
      ref={containerRef}
      className={`epavtibook-reveal ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
      aria-live="polite"
    >
      {/* Subtle central darkening & warm golden halo — visual stage for product name */}
      <div
        className="reveal-atmosphere"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 50% 50%, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 60%, transparent 85%),
            radial-gradient(circle at 50% 45%, rgba(232, 149, 30, 0.15) 0%, transparent 65%)
          `,
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Product reveal content */}
      <div
        className="reveal-content-inner"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '1rem 2rem',
          maxWidth: '900px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <h2
          className="reveal-product-name"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
            fontWeight: 500,
            color: 'var(--color-paper)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
            opacity: 0,
            transform: 'translateY(16px) scale(0.96)',
            willChange: 'transform, opacity',
            textShadow:
              '0 0 35px rgba(232, 149, 30, 0.5), 0 0 70px rgba(232, 149, 30, 0.2), 0 2px 20px rgba(0, 0, 0, 0.8)',
          }}
        >
          {content.productName}
        </h2>
      </div>
    </div>
  );
}

