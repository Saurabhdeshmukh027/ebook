import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { Language } from '../../types';

export interface HeroContentProps {
  isVisible: boolean;
  onCtaClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  language?: Language;
}

const CONTENT = {
  en: {
    eyebrow: 'NAVRATRI DEVI MANDALS',
    headline: 'Where devotion meets trust.',
    subheadline: 'Your Devi Mandal\'s vargani, pavti, and accounts — now in one transparent digital system.',
    ctaPrimary: 'Begin Your Mandal\'s Journey',
    ctaSecondary: 'Learn More',
  },
  mr: {
    eyebrow: 'नवरात्रि देवी मंडळ',
    headline: 'श्रद्धेचा उत्सव. विश्वासाचा हिशोब.',
    subheadline: 'तुमच्या देवी मंडळाची वर्गणी, पावती आणि हिशोब — आता एका पारदर्शक डिजिटल व्यवस्थेत.',
    ctaPrimary: 'तुमच्या मंडळासाठी सुरू करा',
    ctaSecondary: 'अधिक जाणून घ्या',
  },
  hi: {
    eyebrow: 'नवरात्रि देवी मंडल',
    headline: 'श्रद्धा का उत्सव. विश्वास का हिसाब।',
    subheadline: 'आपके देवी मंडल की वर्गणी, पावती और हिसाब — अब एक पारदर्शी डिजिटल व्यवस्था में।',
    ctaPrimary: 'अपने मंडल के लिए शुरू करें',
    ctaSecondary: 'और जानें',
  },
};

export function HeroContent({
  isVisible,
  onCtaClick,
  className = '',
  style,
  language = 'en',
}: HeroContentProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [revealState, setRevealState] = useState<{
    eyebrow: boolean;
    headline: boolean;
    subheadline: boolean;
    cta: boolean;
  }>({
    eyebrow: false,
    headline: false,
    subheadline: false,
    cta: false,
  });

  const content = CONTENT[language];

  useEffect(() => {
    if (!isVisible) {
      setRevealState({
        eyebrow: false,
        headline: false,
        subheadline: false,
        cta: false,
      });
      return;
    }

    const timings = prefersReducedMotion
      ? [0, 0, 0, 0]
      : [0, 300, 600, 900];

    const timeouts = [
      setTimeout(() => setRevealState(s => ({ ...s, eyebrow: true })), timings[0]),
      setTimeout(() => setRevealState(s => ({ ...s, headline: true })), timings[1]),
      setTimeout(() => setRevealState(s => ({ ...s, subheadline: true })), timings[2]),
      setTimeout(() => setRevealState(s => ({ ...s, cta: true })), timings[3]),
    ];

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isVisible, prefersReducedMotion]);

  const transition = prefersReducedMotion
    ? 'opacity 0.3s ease, transform 0.3s ease'
    : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  return (
    <div
      className={`hero-content ${className}`}
      style={{
        position: 'relative',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '5rem 2rem 3rem',
        textAlign: 'center',
        ...style,
      }}
      aria-hidden={!isVisible}
    >
      <div className="hero-text-content" style={{ maxWidth: '900px', width: '100%' }}>
        <p
          className="hero-eyebrow"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-marigold)',
            marginBottom: '1.25rem',
            opacity: revealState.eyebrow ? 1 : 0,
            transform: revealState.eyebrow ? 'translateY(0)' : 'translateY(16px)',
            transition,
          }}
        >
          {content.eyebrow}
        </p>

        <h1
          className="hero-headline"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: 'var(--color-paper)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            opacity: revealState.headline ? 1 : 0,
            transform: revealState.headline ? 'translateY(0)' : 'translateY(20px)',
            transition,
          }}
        >
          {content.headline}
        </h1>

        <p
          className="hero-subheadline"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(247,239,221,0.75)',
            marginBottom: '3rem',
            maxWidth: '640px',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: revealState.subheadline ? 1 : 0,
            transform: revealState.subheadline ? 'translateY(0)' : 'translateY(16px)',
            transition,
          }}
        >
          {content.subheadline}
        </p>

        <div
          className="hero-cta-group"
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: revealState.cta ? 1 : 0,
            transform: revealState.cta ? 'translateY(0)' : 'translateY(20px)',
            transition,
          }}
        >
          <button
            className="hero-cta-primary"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              padding: '1rem 2.25rem',
              backgroundColor: 'var(--color-sindoor)',
              color: 'var(--color-paper)',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 24px rgba(167, 54, 40, 0.3)',
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'var(--color-sindoor)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(167, 54, 40, 0.3)';
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-sindoor-dark)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(167, 54, 40, 0.4)';
            }}
            onClick={onCtaClick}
          >
            {content.ctaPrimary}
          </button>

          <button
            className="hero-cta-secondary"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              padding: '1rem 2.25rem',
              backgroundColor: 'transparent',
              color: 'var(--color-paper)',
              borderRadius: '4px',
              border: '1px solid rgba(247,239,221,0.25)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-marigold)';
              e.currentTarget.style.color = 'var(--color-marigold)';
              e.currentTarget.style.backgroundColor = 'rgba(232, 149, 30, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247,239,221,0.25)';
              e.currentTarget.style.color = 'var(--color-paper)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {content.ctaSecondary}
          </button>
        </div>
      </div>
    </div>
  );
}