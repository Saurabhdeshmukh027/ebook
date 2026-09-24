/**
 * CinematicHero — Continuous Cinematic Hero Section
 *
 * Architecture (Step 10):
 *   - Video plays continuously at ~0.5x deliberate slow cinematic pace
 *   - Completely uncoupled from scroll position (ZERO video.currentTime seeking)
 *   - Hero is an unpinned 100svh section that naturally scrolls into ProductStory
 *   - Subtle pointer parallax and scroll parallax exit via GSAP ticker
 *   - Bottom-right Gemini watermark is 100% physically clipped & obscured
 *     via scale(1.12) + ambient corner vignette
 *   - Preserves full reduced-motion accessibility & multi-lingual i18n
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { CinematicVideo } from '../cinematic/CinematicVideo';
import { HeroAtmosphere } from './HeroAtmosphere';
import { HeroContent } from './HeroContent';
import { useHeroPointer } from './HeroPointer';
import { CinematicScrollIndicator } from './CinematicScrollIndicator';
import { EpavtibookReveal } from './EpavtibookReveal';
import { VIDEO_SRC, POSTER_SRC } from '../../data/assets';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { scrollTo } from '../../lib/smoothScroll';
import type { Language } from '../../types';

/**
 * ── Cinematic E-PavtiBook Reveal Configuration ──
 *
 * All durations in milliseconds unless specified as video seconds.
 *
 * REVEAL_TRIGGER_TIME: Video currentTime (seconds) to trigger E-PavtiBook reveal.
 *   (durga-v3.mp4 duration: ~10.0s; previous: ~7.8s; now 2–3s earlier: 5.0s).
 *
 * REVEAL_HOLD_DURATION_MS: Duration E-PavtiBook holds alone on screen (2500ms, spec: ~2.5s).
 * REVEAL_EXIT_DURATION_MS: Duration of E-PavtiBook exit animation (600ms, spec: 500–700ms).
 * BREATHING_GAP_MS: Duration of empty cinematic pause before HeroContent (400ms, spec: 300–500ms).
 */
export const REVEAL_TRIGGER_TIME = 5.0;
export const REVEAL_HOLD_DURATION_MS = 2500;
export const REVEAL_EXIT_DURATION_MS = 600;
export const BREATHING_GAP_MS = 400;

export interface CinematicHeroProps {
  className?: string;
  language?: Language;
}

export function CinematicHero({
  className = '',
  language = 'en',
}: CinematicHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Layer refs for GSAP ticker DOM updates (zero React state per frame) ──
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const atmosphereWrapperRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // ── State for gates ──
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [revealTriggered, setRevealTriggered] = useState(false);
  const [isEpavtibookExited, setIsEpavtibookExited] = useState(false);
  const [heroContentRevealed, setHeroContentRevealed] = useState(false);

  // ── E-PavtiBook reveal: one-shot guard ──
  const hasTriggeredRevealRef = useRef(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  // ── Pointer parallax (mouse tracking on desktop, touch tracking on mobile) ──
  const { positionRef: pointerRef, isTouchRef } = useHeroPointer({
    enabled: !prefersReducedMotion,
    reduceMotion: prefersReducedMotion,
    sensitivity: 1,
    damping: 0.06,
    maxOffset: 1,
    containerSelector: '[data-cinematic-hero]',
  });

  // ── Video loaded gate ──
  const handleVideoLoaded = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // ── Video time tracking for E-PavtiBook reveal (one-shot, synchronized to video playback) ──
  const handleVideoTimeUpdate = useCallback((currentTime: number) => {
    if (hasTriggeredRevealRef.current) return;

    if (currentTime >= REVEAL_TRIGGER_TIME) {
      hasTriggeredRevealRef.current = true;
      setRevealTriggered(true);
    }
  }, []);

  // ── E-PavtiBook exit complete → cinematic breathing gap → reveal hero content ──
  const handleEpavtibookExitComplete = useCallback(() => {
    setIsEpavtibookExited(true);
    const timer = setTimeout(() => {
      setHeroContentRevealed(true);
    }, BREATHING_GAP_MS);
    return () => clearTimeout(timer);
  }, []);

  // ── Scroll tracking for indicator dismissal ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Sync reduced-motion state with video playback ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
    }
  }, [prefersReducedMotion]);

  // ── Reduced motion: bypass choreography, show content immediately ──
  useEffect(() => {
    if (!prefersReducedMotion || hasTriggeredRevealRef.current) return;
    hasTriggeredRevealRef.current = true;
    setRevealTriggered(true);
    setIsEpavtibookExited(true);
    setHeroContentRevealed(true);
  }, [prefersReducedMotion]);

  // ── GSAP Ticker: Pointer Parallax + Elegant Scroll Parallax Exit ──
  useEffect(() => {
    if (prefersReducedMotion) return;

    const tickerFn = () => {
      const pointer = pointerRef.current;
      const scrollY = window.scrollY;

      // Detect mobile touch or viewport
      const isMobile =
        isTouchRef.current ||
        (typeof window !== 'undefined' &&
          (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches));

      // Parallax ranges:
      // Desktop: Video ±16px X, ±10px Y; Atmosphere ±24px X, ±15px Y; Content ±10px X, ±6px Y
      // Mobile: Video ±8px X, ±6px Y; Atmosphere ±12px X, ±8px Y; Content ±5px X, ±3px Y
      const videoMultiplierX = isMobile ? 8 : 16;
      const videoMultiplierY = isMobile ? 6 : 10;
      const atmMultiplierX = isMobile ? 12 : 24;
      const atmMultiplierY = isMobile ? 8 : 15;
      const contentMultiplierX = isMobile ? 5 : 10;
      const contentMultiplierY = isMobile ? 3 : 6;

      // ── Video Layer: Subtle parallax + 0.25x scroll parallax exit ──
      if (videoLayerRef.current) {
        const videoTranslateX = pointer.normalizedX * videoMultiplierX;
        const videoTranslateY = pointer.normalizedY * videoMultiplierY + scrollY * 0.25;
        const scale = 1.12 + Math.abs(pointer.normalizedX) * (isMobile ? 0.005 : 0.01);

        videoLayerRef.current.style.transform =
          `translate3d(${videoTranslateX}px, ${videoTranslateY}px, 0) scale(${scale})`;
      }

      // ── Atmosphere wrapper: slightly deeper parallax ──
      if (atmosphereWrapperRef.current) {
        const atmTranslateX = pointer.normalizedX * atmMultiplierX;
        const atmTranslateY = pointer.normalizedY * atmMultiplierY + scrollY * 0.15;
        atmosphereWrapperRef.current.style.transform =
          `translate3d(${atmTranslateX}px, ${atmTranslateY}px, 0)`;
      }

      // ── Content wrapper: counter-parallax + smooth upward scroll fade ──
      if (contentWrapperRef.current && heroContentRevealed) {
        const contentTranslateX = -pointer.normalizedX * contentMultiplierX;
        const contentTranslateY = -pointer.normalizedY * contentMultiplierY - scrollY * 0.35;
        const contentOpacity = Math.max(0, 1 - scrollY / 320);

        contentWrapperRef.current.style.transform =
          `translate3d(${contentTranslateX}px, ${contentTranslateY}px, 0)`;
        contentWrapperRef.current.style.opacity = `${contentOpacity}`;
      }
    };

    gsap.ticker.add(tickerFn);
    return () => gsap.ticker.remove(tickerFn);
  }, [prefersReducedMotion, pointerRef, isTouchRef, heroContentRevealed]);

  const handleIndicatorClick = useCallback(() => {
    scrollTo('#product');
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`cinematic-hero ${className}`}
      data-cinematic-hero
      aria-label="Cinematic Durga Mata opening sequence"
      role="region"
    >
      {/* Video Layer — Continuous cinematic video playback */}
      <div
        ref={videoLayerRef}
        className="hero-video-wrapper"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          overflow: 'hidden',
          willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
          transformOrigin: '50% 40%',
          opacity: isVideoReady ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      >
        <CinematicVideo
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoplay={!prefersReducedMotion}
          muted={true}
          playsInline={true}
          loop={true}
          playbackRate={0.5}
          preload="auto"
          className="hero-video"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            transform: 'scale(1.12)',
            transformOrigin: '50% 40%',
            filter: videoError ? 'grayscale(0.3) brightness(0.7)' : 'none',
          }}
          onLoad={handleVideoLoaded}
          onTimeUpdate={handleVideoTimeUpdate}
          onError={() => setVideoError(true)}
        />
      </div>

      {/* Watermark Concealer & Ambient Bottom Vignette */}
      <div
        className="hero-ambient-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 8,
          pointerEvents: 'none',
          background: `
            linear-gradient(0deg, #0A0A0A 0%, rgba(10, 10, 10, 0.85) 12%, transparent 26%),
            radial-gradient(circle at 94% 92%, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.6) 12%, transparent 22%),
            radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10, 10, 10, 0.5) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Video error poster fallback */}
      {videoError && (
        <div
          className="hero-video-fallback"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 6,
            backgroundColor: '#0A0A0A',
            backgroundImage: POSTER_SRC ? `url(${POSTER_SRC})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
          }}
          aria-hidden="true"
        />
      )}

      {/* Atmosphere overlay with rich warm golden embers & haze */}
      <div
        ref={atmosphereWrapperRef}
        style={{
          position: 'absolute',
          inset: '-20px',
          zIndex: 10,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <HeroAtmosphere
          intensity={0.9}
          enableVignette={true}
          enableHaze={true}
          enableDepth={true}
          enableGrain={!prefersReducedMotion}
          isVideoReady={true}
          velocity={0}
        />
      </div>

      {/* E-PavtiBook cinematic reveal overlay (active only during reveal -> hold -> exit) */}
      <EpavtibookReveal
        isTriggered={revealTriggered}
        isExitComplete={isEpavtibookExited}
        language={language}
        holdDurationMs={REVEAL_HOLD_DURATION_MS}
        exitDurationMs={REVEAL_EXIT_DURATION_MS}
        onExitComplete={handleEpavtibookExitComplete}
      />

      {/* Hero content — typography & CTAs (strictly hidden until E-PavtiBook exit + breathing gap) */}
      <div
        className="hero-content-reveal-wrapper"
        style={{
          position: 'relative',
          zIndex: 40,
          opacity: heroContentRevealed ? 1 : 0,
          visibility: heroContentRevealed ? 'visible' : 'hidden',
          transition: prefersReducedMotion
            ? 'none'
            : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pointerEvents: heroContentRevealed ? 'auto' : 'none',
        }}
        aria-hidden={!heroContentRevealed}
      >
        <div
          ref={contentWrapperRef}
          className="hero-content-wrapper"
          style={{
            willChange: 'transform, opacity',
          }}
        >
          <HeroContent
            isVisible={heroContentRevealed}
            language={language}
            onCtaClick={handleIndicatorClick}
          />
        </div>
      </div>

      {/* Localized Scroll Indicator — gracefully fades on scroll, scrolls to #product on click */}
      <CinematicScrollIndicator
        isVisible={heroContentRevealed && !isScrolledPastHero}
        language={language}
        onClick={handleIndicatorClick}
      />

      <style>{`
        .cinematic-hero {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          background-color: #0A0A0A;
          contain: layout style paint;
          isolation: isolate;
        }
        .hero-video {
          image-rendering: optimizeQuality;
          object-position: center 35%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .cinematic-hero {
            height: 100dvh;
            min-height: 520px;
          }
          .hero-ambient-vignette {
            opacity: 0.9;
          }
        }
        @media (max-width: 480px) {
          .cinematic-hero {
            min-height: 480px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-video,
          .hero-atmosphere,
          .hero-content-wrapper,
          .hero-video-wrapper {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
