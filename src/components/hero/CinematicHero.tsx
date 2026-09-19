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
import { VIDEO_SRC, POSTER_SRC } from '../../data/assets';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';
import { scrollTo } from '../../lib/smoothScroll';

export interface CinematicHeroProps {
  className?: string;
  language?: 'en' | 'mr' | 'hi';
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
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  // ── Pointer parallax (mouse tracking on desktop) ──
  const { positionRef: pointerRef } = useHeroPointer({
    enabled: !prefersReducedMotion,
    reduceMotion: prefersReducedMotion,
    sensitivity: 1,
    damping: 0.06,
    maxOffset: 1,
    containerSelector: '[data-cinematic-hero]',
  });

  // ── Reveal hero content smoothly on mount without waiting for 6MB video stream ──
  useEffect(() => {
    const timer = setTimeout(() => setIsContentVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // ── Video loaded gate ──
  const handleVideoLoaded = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  // ── Scroll tracking for indicator dismissal ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Continuous slow video playback initialization with mobile touch fallback ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    // Set slow cinematic playback rate (~0.5x)
    video.playbackRate = 0.5;

    const startPlay = () => {
      video.playbackRate = 0.5;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.debug('Autoplay deferred on mobile:', err);
        });
      }
    };

    startPlay();

    // Re-verify playback rate on loaded metadata, canplay, and playing
    video.addEventListener('loadedmetadata', startPlay);
    video.addEventListener('canplay', startPlay);
    video.addEventListener('playing', () => setIsVideoReady(true));

    // Interaction fallback: first mobile tap/scroll starts video playback if blocked by power-saver
    const touchEvents = ['touchstart', 'pointerdown', 'touchend', 'scroll', 'click'];
    const handleFirstInteraction = () => {
      startPlay();
      touchEvents.forEach((evt) => window.removeEventListener(evt, handleFirstInteraction));
    };
    touchEvents.forEach((evt) => {
      window.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      video.removeEventListener('loadedmetadata', startPlay);
      video.removeEventListener('canplay', startPlay);
      touchEvents.forEach((evt) => window.removeEventListener(evt, handleFirstInteraction));
    };
  }, [prefersReducedMotion]);

  // ── GSAP Ticker: Pointer Parallax + Elegant Scroll Parallax Exit ──
  useEffect(() => {
    if (prefersReducedMotion) return;

    const tickerFn = () => {
      const pointer = pointerRef.current;
      const scrollY = window.scrollY;

      // ── Video Layer: Subtle mouse parallax + 0.25x scroll parallax exit ──
      if (videoLayerRef.current) {
        const videoTranslateX = pointer.normalizedX * 16;
        const videoTranslateY = pointer.normalizedY * 10 + scrollY * 0.25;
        const scale = 1.12 + Math.abs(pointer.normalizedX) * 0.01;

        videoLayerRef.current.style.transform =
          `translate3d(${videoTranslateX}px, ${videoTranslateY}px, 0) scale(${scale})`;
      }

      // ── Atmosphere wrapper: slightly deeper mouse parallax ──
      if (atmosphereWrapperRef.current) {
        const atmTranslateX = pointer.normalizedX * 24;
        const atmTranslateY = pointer.normalizedY * 15 + scrollY * 0.15;
        atmosphereWrapperRef.current.style.transform =
          `translate3d(${atmTranslateX}px, ${atmTranslateY}px, 0)`;
      }

      // ── Content wrapper: counter-parallax + smooth upward scroll fade ──
      if (contentWrapperRef.current) {
        const contentTranslateX = -pointer.normalizedX * 10;
        const contentTranslateY = -pointer.normalizedY * 6 - scrollY * 0.35;
        const contentOpacity = Math.max(0, 1 - scrollY / 320);

        contentWrapperRef.current.style.transform =
          `translate3d(${contentTranslateX}px, ${contentTranslateY}px, 0)`;
        contentWrapperRef.current.style.opacity = `${contentOpacity}`;
      }
    };

    gsap.ticker.add(tickerFn);
    return () => gsap.ticker.remove(tickerFn);
  }, [prefersReducedMotion, pointerRef]);

  const handleIndicatorClick = useCallback(() => {
    scrollTo('#product');
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`cinematic-hero ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '600px',
        overflow: 'hidden',
        backgroundColor: '#0A0A0A',
        contain: 'layout style paint',
      }}
      data-cinematic-hero
      aria-label="Cinematic Durga Mata opening sequence"
      role="region"
    >
      {/* Instant Base Poster Layer — Renders immediately at 0ms, preventing any black screen */}
      <div
        className="hero-poster-base"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          backgroundImage: `url(${POSTER_SRC})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          transform: 'scale(1.12)',
          transformOrigin: '50% 40%',
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
        aria-hidden="true"
      />

      {/* Video Layer — Continuous playback crossfading smoothly over the poster */}
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
            transform: 'scale(1.12)',
            transformOrigin: '50% 40%',
            filter: videoError ? 'grayscale(0.3) brightness(0.7)' : 'none',
          }}
          onLoad={handleVideoLoaded}
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

      {/* Hero content — typography & CTAs */}
      <div
        ref={contentWrapperRef}
        className="hero-content-wrapper"
        style={{
          position: 'relative',
          zIndex: 40,
          willChange: 'transform, opacity',
        }}
      >
        <HeroContent
          isVisible={isContentVisible}
          language={language}
          onCtaClick={handleIndicatorClick}
        />
      </div>

      {/* Localized Scroll Indicator — gracefully fades on scroll, scrolls to #product on click */}
      <CinematicScrollIndicator
        isVisible={isContentVisible && !isScrolledPastHero}
        language={language}
        onClick={handleIndicatorClick}
      />

      <style>{`
        .cinematic-hero {
          isolation: isolate;
        }
        .hero-video {
          image-rendering: optimizeQuality;
        }
        @keyframes hero-ambient-breathe {
          0%, 100% {
            transform: scale(1.12) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.145) translate3d(0, -3px, 0);
          }
        }
        .hero-poster-base {
          animation: hero-ambient-breathe 14s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .cinematic-hero {
            height: 100dvh;
            min-height: 520px;
          }
          .hero-video {
            object-position: center 35%;
            object-fit: cover;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-video,
          .hero-atmosphere,
          .hero-content-wrapper,
          .hero-video-wrapper,
          .hero-poster-base {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
