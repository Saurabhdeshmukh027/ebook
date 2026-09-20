import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { Language } from '../../types';

interface BenefitPavtiProps {
  language?: Language;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const CONTENT = {
  en: {
    eyebrow: '01 — DIGITAL PAVTI',
    headline: 'Issue a clear digital pavti for every contribution.',
    subheadline: 'Instant receipt. Unique identity. Shareable. Verifiable.',
  },
  mr: {
    eyebrow: '०१ — डिजिटल पावती',
    headline: 'प्रत्येक वर्गणीसाठी स्पष्ट डिजिटल पावती जारी करा.',
    subheadline: 'तात्काळ रसीद. अनन्य ओळख. शेअर करण्यायोग्य. सत्यापन्यायोग्य.',
  },
  hi: {
    eyebrow: '०१ — डिजिटल पावती',
    headline: 'हर योगदान के लिए स्पष्ट डिजिटल पावती जारी करें।',
    subheadline: 'तात्कालिक रसीद। अनन्य पहचान। साझा करने योग्य। सत्यापन योग्य।',
  },
};

export function BenefitPavti({
  language = 'en',
  className = '',
  style,
  index = 0,
}: BenefitPavtiProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pavtiRef = useRef<HTMLDivElement>(null);
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
        start: 'top 75%',
        onEnter: () => {
          setIsVisible(true);
          if (pavtiRef.current) {
            gsap.fromTo(pavtiRef.current,
              { y: 30, opacity: 0, scale: 0.98 },
              { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
            );
          }
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="benefit-pavti"
      className={`benefit-pavti ${className}`}
      style={{
        position: 'relative',
        padding: '6rem 2rem',
        background: index % 2 === 0 ? '#FFFBF3' : '#F7EFDD',
        ...style,
      }}
      aria-labelledby={`benefit-pavti-heading-${index}`}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          className="benefit-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          <div
            className="benefit-text"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
              transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <p
              id={`benefit-pavti-eyebrow-${index}`}
              className="benefit-eyebrow"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-sindoor)',
                marginBottom: '1rem',
              }}
            >
              {content.eyebrow}
            </p>

            <h2
              id={`benefit-pavti-heading-${index}`}
              className="benefit-headline"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 500,
                lineHeight: 1.25,
                color: 'var(--color-ink)',
                letterSpacing: '-0.01em',
                marginBottom: '1.5rem',
              }}
            >
              {content.headline}
            </h2>

            <p
              className="benefit-subheadline"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--color-ink-soft)',
                maxWidth: '500px',
              }}
            >
              {content.subheadline}
            </p>
          </div>

          <div
            className="benefit-visual"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              ref={pavtiRef}
              className="digital-pavti-showcase"
              style={{
                width: 'min(420px, 100%)',
                aspectRatio: '3 / 4.2',
                background: 'var(--color-paper-card)',
                borderRadius: '12px',
                boxShadow: `
                  0 24px 48px rgba(42, 30, 23, 0.12),
                  0 8px 16px rgba(42, 30, 23, 0.08),
                  inset 0 1px 0 rgba(255, 251, 243, 0.5),
                  0 0 0 1px rgba(201, 162, 39, 0.2)
                `,
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
              aria-label="Digital pavti example"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201, 162, 39, 0.2)', paddingBottom: '1rem' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-ink)' }}>डिजिटल पावती</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-ink-soft)' }}>E-PavtiBook · Navratri 2026</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-sindoor)' }}>EP-2026-001247</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-ink-soft)' }}>15 Oct 2026 · 14:32</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <PavtiField label="Donor" value="Ramesh Patil" />
                <PavtiField label="Amount" value="₹ 5,000" />
                <PavtiField label="Purpose" value="Vargani" />
                <PavtiField label="Mode" value="UPI" />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button style={{ flex: 1, padding: '0.75rem', background: 'var(--color-sindoor)', color: 'var(--color-paper)', border: 'none', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Share</button>
                <button style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'var(--color-ink)', border: '1px solid rgba(201, 162, 39, 0.3)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Download</button>
              </div>

              <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '28px', height: '28px', background: 'var(--color-sindoor)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="QR code">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-paper)">
                  <rect x="1" y="1" width="6" height="6" />
                  <rect x="9" y="1" width="6" height="6" />
                  <rect x="1" y="9" width="6" height="6" />
                  <rect x="9" y="9" width="3" height="3" />
                  <rect x="1" y="14" width="3" height="3" />
                  <rect x="14" y="14" width="6" height="6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .benefit-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 768px) {
          .benefit-pavti {
            padding: 2.75rem 1.25rem !important;
          }
          .benefit-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .digital-pavti-showcase {
            width: min(320px, 92vw) !important;
            padding: 1.25rem 1rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .benefit-text {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function PavtiField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-brass)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink)' }}>
        {value}
      </p>
    </div>
  );
}