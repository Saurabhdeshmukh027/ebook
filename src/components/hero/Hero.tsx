import { useRef, useEffect, useState } from 'react';
import { CinematicVideo, useCinematicVideo } from '../cinematic/CinematicVideo';
import { AtmosphericLayer } from '../cinematic/AtmosphericLayer';
import { InteractionLayer, usePrefersReducedMotion } from '../cinematic/InteractionLayer';
import type { PointerPosition } from '../cinematic/InteractionLayer';
import { VIDEO_SRC, POSTER_SRC } from '../../data/assets';

export interface HeroProps {
  className?: string;
  onTransitionComplete?: () => void;
}

export function Hero({ className = '', onTransitionComplete }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    isLoaded: videoLoaded,
  } = useCinematicVideo(VIDEO_SRC, {
    autoplay: true,
    muted: true,
    loop: false,
    playsInline: true,
    preload: 'auto',
  });

  useEffect(() => {
    if (videoLoaded && !isLoaded) {
      setIsLoaded(true);
      if (!prefersReducedMotion) {
        const timer = setTimeout(() => setShowContent(true), 500);
        return () => clearTimeout(timer);
      } else {
        setShowContent(true);
      }
    }
  }, [videoLoaded, isLoaded, prefersReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onTransitionComplete?.();
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (hero) {
        hero.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [onTransitionComplete]);

  const handleVideoEnd = () => {
    if (!prefersReducedMotion) {
      const timer = setTimeout(() => onTransitionComplete?.(), 1000);
      return () => clearTimeout(timer);
    }
    onTransitionComplete?.();
  };

  const renderInteractionContent = (pointer: PointerPosition, isInside: boolean) => {
    if (!isInside) return null;

    const moveX = pointer.normalizedX * 30;
    const moveY = pointer.normalizedY * 20;

    return (
      <div
        className="hero-parallax-layer"
        style={{
          transform: `translate(${moveX}px, ${moveY}px)`,
          transition: 'transform 0.1s linear',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <div className="hero-light-ray" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200%',
          height: '200%',
          transform: `translate(-50%, -50%) rotate(${pointer.normalizedX * 15}deg)`,
          background: 'radial-gradient(ellipse at center, rgba(232,149,30,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>
    );
  };

  return (
    <section
      ref={heroRef}
      className={`cinematic-hero ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        backgroundColor: '#0A0A0A',
      }}
      data-cinematic-hero
      aria-label="Cinematic Durga Mata opening sequence"
      role="region"
      tabIndex={0}
    >
      <CinematicVideo
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoplay={true}
        muted={true}
        playsInline={true}
        loop={false}
        preload="auto"
        className="hero-video"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 10,
        }}
        onLoad={() => setIsLoaded(true)}
        onEnded={handleVideoEnd}
      />

      <AtmosphericLayer
        videoSrc={VIDEO_SRC}
        intensity={1}
        enableVignette={true}
        enableHaze={true}
        enableDepth={true}
      />

      <InteractionLayer
        sensitivity={1}
        enabled={!prefersReducedMotion}
      >
        {renderInteractionContent}
      </InteractionLayer>

      <div
        className="hero-content-layer"
        style={{
          position: 'relative',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '2rem',
          textAlign: 'center',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        aria-hidden={!showContent}
      >
        <div className="hero-text-content" style={{ maxWidth: '900px' }}>
          <p
            className="hero-sanskrit"
            style={{
              fontFamily: 'var(--font-devanagari)',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'var(--color-marigold)',
              marginBottom: '1.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.9,
            }}
          >
            जय माता दी
          </p>

          <h1
            className="hero-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              color: 'var(--color-paper)',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            E-PavtiBook
          </h1>

          <p
            className="hero-subtitle"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(247,239,221,0.8)',
              marginBottom: '3rem',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Digital Pavti & Transparent Accounting for Navratri Devi Mandals
          </p>

          <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="hero-cta-primary"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '1rem 2.5rem',
                backgroundColor: 'var(--color-sindoor)',
                color: 'var(--color-paper)',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, transform 0.1s ease',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onClick={onTransitionComplete}
            >
              Begin Your Mandal's Journey
            </button>

            <button
              className="hero-cta-secondary"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 500,
                padding: '1rem 2.5rem',
                backgroundColor: 'transparent',
                color: 'var(--color-paper)',
                borderRadius: '4px',
                border: '1px solid rgba(247,239,221,0.3)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-marigold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(247,239,221,0.3)'; }}
            >
              Learn More
            </button>
          </div>
        </div>

        <div
          className="hero-scroll-indicator"
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'rgba(247,239,221,0.5)',
            fontSize: '0.875rem',
          }}
        >
          <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.1em' }}>Scroll</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.6 }}>
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
          <style>{`
            .hero-scroll-indicator {
              animation: bounce 2s infinite;
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
              40% { transform: translateX(-50%) translateY(-10px); }
              60% { transform: translateX(-50%) translateY(-5px); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}