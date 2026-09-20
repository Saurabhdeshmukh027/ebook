import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { Language } from '../../types';

interface MandalBenefitsIntroProps {
  language?: Language;
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    eyebrow: 'BUILT FOR YOUR DEVI MANDAL',
    headline: 'Everything your Devi Mandal needs to keep the record clear.',
    subheadline: 'Six focused capabilities. One transparent system.',
  },
  mr: {
    eyebrow: 'तुमच्या देवी मंडळासाठी तयार',
    headline: 'तुमच्या देवी मंडळाचा हिशोब स्पष्ट ठेवण्यासाठी आवश्यक ते सर्व.',
    subheadline: 'सहा लक्ष्यभेदी क्षमता. एक पारदर्शक प्रणाली.',
  },
  hi: {
    eyebrow: 'आपके देवी मंडल के लिए निर्मित',
    headline: 'आपके देवी मंडल का रिकॉर्ड स्पष्ट रखने के लिए आवश्यक सब कुछ।',
    subheadline: 'छह लक्ष्य-उन्मुख क्षमताएं। एक पारदर्शक प्रणाली।',
  },
};

const BENEFIT_IDS = [
  'benefit-pavti',
  'benefit-collection',
  'benefit-payments',
  'benefit-expenses',
  'benefit-balance',
  'benefit-transparency',
];

export function MandalBenefitsIntro({
  language = 'en',
  className = '',
  style,
}: MandalBenefitsIntroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const content = CONTENT[language];

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => setIsVisible(true),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // IntersectionObserver for active benefit tracking
  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = BENEFIT_IDS.indexOf(entry.target.id);
            if (idx !== -1) {
              setActiveIndex(idx);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.15,
      }
    );

    BENEFIT_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className={`mandal-benefits-intro ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: `
          linear-gradient(180deg, #FFFBF3 0%, #F7EFDD 100%)
        `,
        ...style,
      }}
      aria-labelledby="benefits-heading"
    >
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p
          className="benefits-eyebrow"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-sindoor)',
            marginBottom: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {content.eyebrow}
        </p>

        <h2
          id="benefits-heading"
          className="benefits-headline"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--color-ink)',
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
          className="benefits-subheadline"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--color-ink-soft)',
            maxWidth: '700px',
            margin: '0 auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: prefersReducedMotion ? '0s' : '0.3s',
          }}
        >
          {content.subheadline}
        </p>
      </div>

      <div
        className="benefits-index"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginTop: '4rem',
          flexWrap: 'wrap',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transitionDelay: prefersReducedMotion ? '0s' : '0.5s',
        }}
        aria-label="Feature index"
      >
        {[
          { num: '01', label: { en: 'Digital Pavti', mr: 'डिजिटल पावती', hi: 'डिजिटल पावती' }, id: 'benefit-pavti' },
          { num: '02', label: { en: 'Vargani / Collection', mr: 'वर्गणी / संकलन', hi: 'वर्गणी / संग्रह' }, id: 'benefit-collection' },
          { num: '03', label: { en: 'Online Payments', mr: 'ऑनलाइन पेमेंट', hi: 'ऑनलाइन भुगतान' }, id: 'benefit-payments' },
          { num: '04', label: { en: 'Expenses', mr: 'खर्च', hi: 'खर्च' }, id: 'benefit-expenses' },
          { num: '05', label: { en: 'Balance', mr: 'शिल्लक', hi: 'बैलेंस' }, id: 'benefit-balance' },
          { num: '06', label: { en: 'Transparency', mr: 'पारदर्शकता', hi: 'पारदर्शिता' }, id: 'benefit-transparency' },
        ].map((item, index) => (
          <span
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: activeIndex === index ? 'var(--color-sindoor)' : 'var(--color-ink-soft)',
              padding: '0.5rem 0.75rem',
              background: activeIndex === index ? 'rgba(167, 54, 40, 0.08)' : 'transparent',
              borderRadius: '999px',
              border: activeIndex === index ? '1px solid rgba(167, 54, 40, 0.2)' : 'none',
              transition: 'color 0.2s ease, background 0.2s ease, border-color 0.2s ease',
            }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600 }}>
              {item.num}
            </span>
            {item.label[language]}
          </span>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mandal-benefits-intro {
            padding: 3.5rem 1.25rem !important;
          }
          .benefits-index {
            gap: 0.35rem !important;
            margin-top: 1.5rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .benefits-eyebrow,
          .benefits-headline,
          .benefits-subheadline,
          .benefits-index {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}