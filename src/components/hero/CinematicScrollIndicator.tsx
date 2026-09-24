/**
 * CinematicScrollIndicator — Ultra-premium sacred scroll indication
 *
 * Communicates: "SCROLL TO EXPLORE" before the user starts scrolling.
 * Features:
 *   - Localized royal typography (English, Marathi, Hindi) with gold-ivory metallic gradient
 *   - Celestial diamond marks (✦) and fine tapered horizontal light hairlines
 *   - Feathered dark glass radial backplate with breathing amber ambient aura
 *   - Sculpted kinetic vertical light column with descending liquid-gold drop
 *   - Synchronized pulsing golden chevron with radiant glow
 *   - Click-to-scroll to #product section
 *   - Reduced-motion accessibility
 *   - Mobile responsive positioning
 */

import { memo } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { Language } from '../../types';

export interface CinematicScrollIndicatorProps {
  isVisible: boolean;
  language?: Language;
  className?: string;
  onClick?: () => void;
}

const INDICATOR_TEXT = {
  en: 'SCROLL TO EXPLORE',
  mr: 'पुढे पाहण्यासाठी स्क्रोल करा',
  hi: 'आगे देखने के लिए स्क्रोल करें',
};

export const CinematicScrollIndicator = memo(function CinematicScrollIndicator({
  isVisible,
  language = 'en',
  className = '',
  onClick,
}: CinematicScrollIndicatorProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const text = INDICATOR_TEXT[language] || INDICATOR_TEXT.en;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={`cinematic-scroll-indicator ${className} ${isVisible ? 'visible' : 'hidden'}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isVisible ? 0 : -1}
      role="button"
      aria-label={text}
      style={{
        position: 'absolute',
        bottom: 'clamp(1.5rem, 3.5vh, 2.5rem)',
        left: '50%',
        transform: isVisible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(16px)',
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.45rem',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: prefersReducedMotion
          ? 'opacity 0.3s ease'
          : 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        outline: 'none',
        padding: '0.625rem 1.5rem 0.5rem',
        borderRadius: '24px',
        background: 'radial-gradient(ellipse at center, rgba(12, 10, 8, 0.78) 0%, rgba(12, 10, 8, 0.45) 60%, transparent 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      aria-hidden={!isVisible}
    >
      {/* Ambient background gold aura */}
      <div
        className="indicator-ambient-aura"
        style={{
          position: 'absolute',
          inset: '-8px -16px',
          borderRadius: '30px',
          background: 'radial-gradient(ellipse at center, rgba(232, 149, 30, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: -1,
          animation: prefersReducedMotion ? 'none' : 'ambient-glow 3.5s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Royal Typography Header with Celestial Accents */}
      <div
        className="indicator-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
        }}
      >
        <span
          className="indicator-flourish flourish-left"
          style={{
            display: 'inline-block',
            width: '20px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(232, 149, 30, 0.6))',
          }}
          aria-hidden="true"
        />
        <span
          style={{
            color: 'var(--color-marigold)',
            fontSize: '0.625rem',
            opacity: 0.85,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ✦
        </span>

        <span
          className="indicator-label"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.6875rem, 1.1vw, 0.75rem)',
            fontWeight: 600,
            letterSpacing: language === 'en' ? '0.24em' : '0.1em',
            textTransform: 'uppercase',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F7EFDD 50%, #E8951E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))',
          }}
        >
          {text}
        </span>

        <span
          style={{
            color: 'var(--color-marigold)',
            fontSize: '0.625rem',
            opacity: 0.85,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ✦
        </span>
        <span
          className="indicator-flourish flourish-right"
          style={{
            display: 'inline-block',
            width: '20px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(232, 149, 30, 0.6), transparent)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Kinetic Sacred Light Column */}
      <div
        className="indicator-column-assembly"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          marginTop: '2px',
        }}
      >
        {/* Slender hairline track with liquid gold drop */}
        <div
          className="indicator-track"
          style={{
            position: 'relative',
            width: '2px',
            height: '32px',
            backgroundColor: 'rgba(247, 239, 221, 0.15)',
            overflow: 'hidden',
            borderRadius: '2px',
          }}
        >
          <div
            className="indicator-drop-pulse"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '50%',
              background: 'linear-gradient(180deg, transparent 0%, var(--color-marigold) 65%, #FFFFFF 100%)',
              animation: prefersReducedMotion ? 'none' : 'light-drop 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              boxShadow: '0 0 8px var(--color-marigold), 0 0 2px #FFF',
            }}
          />
        </div>

        {/* Pulsing Golden Chevron */}
        <svg
          className="indicator-chevron-icon"
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          style={{
            display: 'block',
            filter: 'drop-shadow(0 0 4px rgba(232, 149, 30, 0.6))',
            animation: prefersReducedMotion ? 'none' : 'chevron-flow 2.2s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          <path
            d="M1 1.5L7 6.5L13 1.5"
            stroke="url(#indicatorGoldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="indicatorGoldGrad" x1="1" y1="1.5" x2="13" y2="6.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F7EFDD" />
              <stop offset="0.5" stopColor="#E8951E" />
              <stop offset="1" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style>{`
        .cinematic-scroll-indicator {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
        }

        .cinematic-scroll-indicator:hover {
          filter: drop-shadow(0 0 16px rgba(232, 149, 30, 0.5));
          transform: translateX(-50%) translateY(-3px) !important;
        }

        .cinematic-scroll-indicator:focus-visible {
          outline: 2px solid var(--color-marigold);
          outline-offset: 4px;
        }

        @keyframes light-drop {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            transform: translateY(200%);
            opacity: 0.9;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }

        @keyframes chevron-flow {
          0%, 20% {
            transform: translateY(0);
            opacity: 0.5;
            filter: drop-shadow(0 0 2px rgba(232, 149, 30, 0.3));
          }
          65%, 75% {
            transform: translateY(3px);
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(232, 149, 30, 0.85));
          }
          100% {
            transform: translateY(0);
            opacity: 0.5;
            filter: drop-shadow(0 0 2px rgba(232, 149, 30, 0.3));
          }
        }

        @keyframes ambient-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.04);
          }
        }

        @media (max-width: 768px) {
          .cinematic-scroll-indicator {
            bottom: clamp(2.5rem, 5vh, 3.5rem) !important;
          }
        }

        @media (max-width: 480px) {
          .cinematic-scroll-indicator {
            bottom: clamp(4rem, 8.5vh, 5.25rem) !important;
          }
        }
      `}</style>
    </div>
  );
});
