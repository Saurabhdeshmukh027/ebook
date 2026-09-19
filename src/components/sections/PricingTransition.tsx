import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface PricingTransitionProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    headline: 'Your mandal\'s work deserves a clear record.',
    subheadline: 'Choose what your mandal needs this Navratri.',
  },
  mr: {
    headline: 'तुमच्या मंडळाचे काम स्पष्ट हिशोबाचे हकदार आहे.',
    subheadline: 'हे नवरत्री तुमच्या मंडळाला काय हवा, ते निवडा.',
  },
  hi: {
    headline: 'आपके मंडल का काम स्पष्ट रिकॉर्ड का हकदार है।',
    subheadline: 'यह नवरात्रि आपके मंडल को क्या चाहिए, चुनें।',
  },
};

export function PricingTransition({
  language = 'en',
  className = '',
  style,
}: PricingTransitionProps) {
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
      id="pricing-transition"
      className={`pricing-transition ${className}`}
      style={{
        position: 'relative',
        padding: '6rem 2rem',
        background: `
          linear-gradient(180deg, #F7EFDD 0%, #FFFBF3 50%, #F7EFDD 100%)
        `,
        ...style,
      }}
      aria-labelledby="pricing-transition-heading"
    >
      <div className="container" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2
          id="pricing-transition-heading"
          className="transition-headline"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 500,
            lineHeight: 1.25,
            color: 'var(--color-ink)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion
              ? 'opacity 0.3s ease, transform 0.3s ease'
              : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {content.headline}
        </h2>

        <p
          className="transition-subheadline"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--color-ink-soft)',
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
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pricing-transition {
            padding: 3.5rem 1.25rem 1.5rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .transition-headline,
          .transition-subheadline {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}