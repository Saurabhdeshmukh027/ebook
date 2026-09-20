/**
 * CinematicScrollIndicator — Premium localized scroll indication
 *
 * Communicates: "SCROLL TO EXPLORE" before the user starts scrolling.
 * Features:
 *   - Localized typography (English, Marathi, Hindi)
 *   - Slender vertical hairline with a subtle downward travelling glow
 *   - Gentle breathing opacity
 *   - Graceful fade-out when user starts exploring, stays hidden
 *   - Reduced-motion accessibility
 *   - Responsive spacing safe from mobile browser chrome
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

  return (
    <div
      className={`cinematic-scroll-indicator ${className} ${isVisible ? 'visible' : 'hidden'}`}
      onClick={onClick}
      style={{
        position: 'absolute',
        bottom: 'clamp(1.25rem, 3.5vh, 2.25rem)',
        left: '50%',
        transform: isVisible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(14px)',
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.625rem',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: prefersReducedMotion
          ? 'opacity 0.3s ease'
          : 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      aria-hidden={!isVisible}
      role="note"
      aria-label={text}
    >
      <span
        className="indicator-label"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.6875rem, 1.2vw, 0.75rem)',
          fontWeight: 500,
          letterSpacing: language === 'en' ? '0.22em' : '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(247, 239, 221, 0.7)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
        }}
      >
        {text}
      </span>

      {/* Slender hairline with descending light shimmer */}
      <div
        className="indicator-line-track"
        style={{
          position: 'relative',
          width: '1px',
          height: '28px',
          backgroundColor: 'rgba(247, 239, 221, 0.15)',
          overflow: 'hidden',
          borderRadius: '1px',
        }}
      >
        <div
          className="indicator-line-glow"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '45%',
            background: 'linear-gradient(180deg, transparent 0%, var(--color-marigold) 70%, #FFF 100%)',
            animation: prefersReducedMotion ? 'none' : 'indicator-drop 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            boxShadow: '0 0 6px var(--color-marigold)',
          }}
        />
      </div>

      <style>{`
        .cinematic-scroll-indicator.visible {
          animation: ${prefersReducedMotion ? 'none' : 'indicator-breathe 4s ease-in-out infinite'};
        }

        @keyframes indicator-drop {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          80% {
            transform: translateY(220%);
            opacity: 0.8;
          }
          100% {
            transform: translateY(220%);
            opacity: 0;
          }
        }

        @keyframes indicator-breathe {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .cinematic-scroll-indicator {
            bottom: clamp(1rem, 3vh, 1.75rem) !important;
          }
        }
      `}</style>
    </div>
  );
});
