import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface StatementSectionProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    eyebrow: 'THE STATEMENT',
    headline: 'Navratri is built on श्रद्धा and community trust.',
    subheadline: 'The financial record should carry that same trust.',
    devanagari: 'श्रद्धा आणि विश्वास — यांचे प्रतिबिंब हिशोबात.',
  },
  mr: {
    eyebrow: 'प्रमाण',
    headline: 'नवरत्री श्रद्धावरील आणि सामाजिक विश्वासावरील आहे.',
    subheadline: 'हिशोबहीही तेच विश्वास वाहून जावी.',
    devanagari: 'श्रद्धा आणि विश्वास — यांचे प्रतिबिंब हिशोबात.',
  },
  hi: {
    eyebrow: 'कथन',
    headline: 'नवरात्रि श्रद्धा और सामुदायिक विश्वास पर बनी है।',
    subheadline: 'वित्तीय रिकॉर्ड को भी वही विश्वास वहन करना चाहिए।',
    devanagari: 'श्रद्धा और विश्वास — इनका प्रतिबिंब हिसाब में।',
  },
};

export function StatementSection({
  language = 'en',
  className = '',
  style,
}: StatementSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const content = CONTENT[language];

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => setIsVisible(true),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="why"
      className={`statement-section ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167, 54, 40, 0.08) 0%, transparent 70%),
          linear-gradient(180deg, #0A0A0A 0%, #1A0A08 50%, #F7EFDD 100%)
        `,
        ...style,
      }}
      aria-labelledby="statement-heading"
    >
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p
          id="statement-eyebrow"
          className="statement-eyebrow"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-marigold)',
            marginBottom: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {content.eyebrow}
        </p>

        <h2
          id="statement-heading"
          className="statement-headline"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--color-paper)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: prefersReducedMotion ? '0s' : '0.15s',
          }}
        >
          {content.headline}
        </h2>

        <p
          className="statement-subheadline"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(247, 239, 221, 0.8)',
            marginBottom: '2.5rem',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: prefersReducedMotion ? '0s' : '0.3s',
          }}
        >
          {content.subheadline}
        </p>

        <p
          className="statement-devanagari"
          style={{
            fontFamily: 'var(--font-devanagari)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--color-marigold)',
            opacity: isVisible ? 0.9 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: prefersReducedMotion ? '0s' : '0.45s',
          }}
        >
          {content.devanagari}
        </p>
      </div>

      <div
        className="statement-divider"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-marigold), transparent)',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      <style>{`
        @media (max-width: 768px) {
          .statement-section {
            padding: 3.5rem 1.25rem !important;
          }
          .statement-eyebrow {
            margin-bottom: 0.875rem !important;
          }
          .statement-headline {
            margin-bottom: 1rem !important;
          }
          .statement-subheadline {
            margin-bottom: 1.5rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .statement-eyebrow,
          .statement-headline,
          .statement-subheadline,
          .statement-devanagari {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}