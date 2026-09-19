import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const CONTENT = {
  en: {
    headline: 'Keep the devotion in the celebration.',
    subheadline: 'Keep the clarity in the record.',
    descriptor: 'E-PavtiBook — Digital Pavti & transparent mandal accounting',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'Explore E-PavtiBook',
  },
  mr: {
    headline: 'उत्सवात श्रद्धा ठेवा. हिशोबात स्पष्टता ठेवा.',
    subheadline: '',
    descriptor: 'E-PavtiBook — डिजिटल पावती आणि पारदर्शक मंडळ हिशोब',
    ctaPrimary: 'सुरू करा',
    ctaSecondary: 'E-PavtiBook एक्सप्लोर करा',
  },
  hi: {
    headline: 'उत्सव में श्रद्धा रखें। हिसाब में स्पष्टता रखें।',
    subheadline: '',
    descriptor: 'E-PavtiBook — डिजिटल पावती और पारदर्शक मंडल हिसाब',
    ctaPrimary: 'शुरू करें',
    ctaSecondary: 'E-PavtiBook एक्सप्लोर करें',
  },
};

export function FinalCTA({
  language = 'en',
  className = '',
  style,
  onPrimaryClick,
  onSecondaryClick,
}: FinalCTAProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const content = CONTENT[language];

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => setIsVisible(true),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`final-cta ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(167, 54, 40, 0.12) 0%, transparent 70%),
          linear-gradient(180deg, #260B09 0%, #3B1310 50%, #260B09 100%)
        `,
        ...style,
      }}
      aria-labelledby="final-cta-heading"
    >
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p
          id="final-cta-heading"
          className="cta-headline"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 500,
            lineHeight: 1.25,
            color: 'var(--color-paper)',
            marginBottom: content.subheadline ? '1rem' : '2rem',
            letterSpacing: '-0.01em',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion
              ? 'opacity 0.3s ease, transform 0.3s ease'
              : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {content.headline}
        </p>

        {content.subheadline && (
          <p
            className="cta-subheadline"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(247, 239, 221, 0.7)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: prefersReducedMotion
                ? 'opacity 0.3s ease, transform 0.3s ease'
                : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: prefersReducedMotion ? '0s' : '0.2s',
            }}
          >
            {content.subheadline}
          </p>
        )}

        <div
          className="cta-buttons"
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion
              ? 'opacity 0.3s ease, transform 0.3s ease'
              : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: prefersReducedMotion ? '0s' : '0.4s',
          }}
        >
          <button
            className="cta-primary"
            style={{
              padding: '1rem 2.5rem',
              background: 'var(--color-marigold)',
              color: 'var(--color-cinematic-black)',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
              boxShadow: '0 8px 24px rgba(232, 149, 30, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-brass)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(232, 149, 30, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-marigold)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 149, 30, 0.3)';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onClick={onPrimaryClick}
          >
            {content.ctaPrimary}
          </button>

          <button
            className="cta-secondary"
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              color: 'var(--color-paper)',
              border: '1px solid rgba(247, 239, 221, 0.3)',
              borderRadius: '8px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-marigold)';
              e.currentTarget.style.color = 'var(--color-marigold)';
              e.currentTarget.style.backgroundColor = 'rgba(232, 149, 30, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247, 239, 221, 0.3)';
              e.currentTarget.style.color = 'var(--color-paper)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={onSecondaryClick}
          >
            {content.ctaSecondary}
          </button>
        </div>

        <p
          className="cta-descriptor"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'rgba(247, 239, 221, 0.5)',
            maxWidth: '500px',
            margin: '0 auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: prefersReducedMotion
              ? 'opacity 0.3s ease, transform 0.3s ease'
              : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: prefersReducedMotion ? '0s' : '0.6s',
          }}
        >
          {content.descriptor}
        </p>
      </div>

      <div
        className="cta-atmosphere"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.4,
          background: `
            radial-gradient(ellipse 40% 30% at 20% 20%, rgba(232, 149, 30, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 30% 20% at 80% 80%, rgba(167, 54, 40, 0.06) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      <style>{`
        @media (max-width: 768px) {
          .final-cta {
            padding: 4.5rem 1.25rem 5rem !important;
          }
          .cta-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            max-width: 320px;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .cta-buttons button {
            width: 100% !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-headline,
          .cta-subheadline,
          .cta-buttons,
          .cta-descriptor {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export type { FinalCTAProps };