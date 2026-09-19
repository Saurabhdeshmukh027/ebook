import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface DigitalPavtiTransformProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    eyebrow: 'THE TRANSFORMATION',
    headline: 'Paper becomes digital. Trust becomes transparent.',
    subheadline: 'One seamless transition from traditional pavti to E-PavtiBook.',
  },
  mr: {
    eyebrow: 'रूपांतर',
    headline: 'कागद डिजिटल होते. विश्वास पारदर्शक होते.',
    subheadline: 'पारंपरिक पावतीपासून E-PavtiBookपर्यंत एक निर्बाध संक्रमण.',
  },
  hi: {
    eyebrow: 'परिवर्तन',
    headline: 'कागज डिजिटल बनता है। विश्वास पारदर्शी बनता है।',
    subheadline: 'पारंपरिक पावती से E-PavtiBook तक एक सहज संक्रमण।',
  },
};

export function DigitalPavtiTransform({
  language = 'en',
  className = '',
  style,
}: DigitalPavtiTransformProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const digitalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [transformProgress, setTransformProgress] = useState(0);
  const content = CONTENT[language];

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      setTransformProgress(1);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.8,
          onUpdate: (self) => {
            setTransformProgress(self.progress);
            if (self.progress > 0.1) setIsVisible(true);
          },
        },
      });

      return () => tl.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const paperOpacity = 1 - transformProgress;
  const paperScale = 1 - transformProgress * 0.1;
  const paperRotate = -1 + transformProgress * 2;
  const paperBlur = transformProgress * 8;

  const digitalOpacity = transformProgress;
  const digitalScale = 0.9 + transformProgress * 0.1;
  const digitalRotate = 1 - transformProgress * 2;
  const digitalBlur = (1 - transformProgress) * 8;

  const lightIntensity = Math.sin(transformProgress * Math.PI) * 0.3;

  return (
    <section
      ref={sectionRef}
      id="digital-pavti"
      className={`digital-pavti-transform ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(167, 54, 40, ${0.06 + lightIntensity}) 0%, transparent 70%),
          linear-gradient(180deg, #FFFBF3 0%, #F7EFDD 100%)
        `,
        ...style,
      }}
      aria-labelledby="transform-heading"
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div
          className="transform-header"
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <p
            className="transform-eyebrow"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-sindoor)',
              marginBottom: '1rem',
            }}
          >
            {content.eyebrow}
          </p>

          <h2
            id="transform-heading"
            className="transform-headline"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'var(--color-ink)',
              letterSpacing: '-0.02em',
            }}
          >
            {content.headline}
          </h2>

          <p
            className="transform-subheadline"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'var(--color-ink-soft)',
              maxWidth: '700px',
              margin: '1.5rem auto 0',
            }}
          >
            {content.subheadline}
          </p>
        </div>

        <div
          className="transform-visual"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            position: 'relative',
            height: '60vh',
            minHeight: '400px',
          }}
        >
          <div
            className="paper-side"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              ref={paperRef}
              className="transform-pavti paper"
              style={{
                width: 'min(380px, 90vw)',
                aspectRatio: '3 / 4.5',
                opacity: paperOpacity,
                transform: `scale(${paperScale}) rotate(${paperRotate}deg)`,
                filter: `blur(${paperBlur}px)`,
                pointerEvents: 'none',
                transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease',
              }}
            >
              <TransformPavti
                variant="paper"
                intensity={1 - transformProgress}
              />
            </div>
          </div>

          <div
            className="digital-side"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              ref={digitalRef}
              className="transform-pavti digital"
              style={{
                width: 'min(380px, 90vw)',
                aspectRatio: '3 / 4.5',
                opacity: digitalOpacity,
                transform: `scale(${digitalScale}) rotate(${digitalRotate}deg)`,
                filter: `blur(${digitalBlur}px)`,
                pointerEvents: 'none',
                transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease',
              }}
            >
              <TransformPavti
                variant="digital"
                intensity={transformProgress}
              />
            </div>
          </div>

          <div
            className="transform-light"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(232, 149, 30, ${lightIntensity}) 0%, transparent 70%)`,
              pointerEvents: 'none',
              opacity: isVisible ? 1 : 0,
            }}
            aria-hidden="true"
          />

          <div
            className="progress-indicator"
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              height: '4px',
              background: 'rgba(201, 162, 39, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: `${transformProgress * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-sindoor), var(--color-marigold))',
                borderRadius: '2px',
                transition: prefersReducedMotion ? 'none' : 'width 0.1s linear',
              }}
            />
          </div>
        </div>

        <div
          className="transform-caption"
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '0 2rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: prefersReducedMotion ? '0s' : '0.5s',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--color-ink-soft)',
            }}
          >
            {transformProgress < 0.3 && content.eyebrow === 'THE TRANSFORMATION' && 'Traditional paper pavti — tactile, trusted, familiar'}
            {transformProgress >= 0.3 && transformProgress < 0.7 && 'Light passes through — information reorganizes'}
            {transformProgress >= 0.7 && 'E-PavtiBook digital pavti — same trust, transparent record'}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .transform-visual {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            height: auto !important;
            min-height: auto !important;
            padding: 2rem 0 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .transform-pavti {
            transition: none !important;
          }
          .transform-light {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

function TransformPavti({
  variant,
  intensity,
}: { variant: 'paper' | 'digital'; intensity: number }) {
  const isPaper = variant === 'paper';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: isPaper
          ? `
            linear-gradient(135deg, #FDF8F0 0%, #F5E6D3 50%, #E8D5C0 100%)
          `
          : 'var(--color-paper-card)',
        borderRadius: '8px',
        boxShadow: isPaper
          ? `
            0 20px 40px rgba(42, 30, 23, 0.15),
            0 8px 16px rgba(42, 30, 23, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(200, 180, 160, 0.2)
          `
          : `
            0 20px 40px rgba(42, 30, 23, 0.12),
            0 8px 16px rgba(42, 30, 23, 0.08),
            inset 0 1px 0 rgba(255, 251, 243, 0.5),
            0 0 0 1px rgba(201, 162, 39, 0.2)
          `,
        border: isPaper ? '1px solid rgba(201, 162, 39, 0.3)' : 'none',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label={isPaper ? 'Traditional paper pavti' : 'E-PavtiBook digital pavti'}
      role="img"
    >
      {isPaper && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            opacity: intensity,
          }}
          aria-hidden="true"
        />
      )}

      {!isPaper && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, rgba(201, 162, 39, ${0.03 * intensity}) 0%, transparent 50%, rgba(167, 54, 40, ${0.03 * intensity}) 100%)`,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1rem',
          borderBottom: isPaper ? '2px solid var(--color-sindoor)' : '1px solid rgba(201, 162, 39, 0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 500, color: isPaper ? 'var(--color-ink)' : 'var(--color-ink)' }}>
            {isPaper ? 'पावती' : 'डिजिटल पावती'}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 400, color: isPaper ? 'var(--color-ink-soft)' : 'var(--color-ink-soft)', marginTop: '0.25rem' }}>
            {isPaper ? 'श्री देवी मंडळ, नवरत्रि २०२६' : 'E-PavtiBook · Navratri 2026'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-sindoor)' }}>
            {isPaper ? 'क्र. ००१२४७' : 'EP-2026-001247'}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-ink-soft)', marginTop: '0.25rem' }}>
            {isPaper ? 'दिनांक: १५ ऑक्टोबर २०२६' : '15 Oct 2026 · 14:32'}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <PavtiField label={isPaper ? 'नाम' : 'Donor'} value={isPaper ? 'श्री रमेश पाटील' : 'Ramesh Patil'} />
        <PavtiField label={isPaper ? 'रक्कम' : 'Amount'} value={isPaper ? '₹ ५,०००' : '₹ 5,000'} />
        <PavtiField label={isPaper ? 'उद्देश' : 'Purpose'} value={isPaper ? 'वर्गणी' : 'Vargani'} />
        <PavtiField label={isPaper ? 'पद्धत' : 'Mode'} value={isPaper ? 'यूपीआय' : 'UPI'} />
      </div>

      {isPaper ? (
        <div
          style={{
            background: 'rgba(167, 54, 40, 0.08)',
            borderRadius: '6px',
            padding: '1rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-sindoor)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            स्वाक्षरी / सही
          </p>
          <div
            style={{
              height: '40px',
              background: 'repeating-linear-gradient(90deg, transparent, transparent 95%, var(--color-ink-soft) 96%, var(--color-ink-soft) 100%)',
              borderRadius: '4px',
              opacity: 0.6,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'var(--color-sindoor)',
              color: 'var(--color-paper)',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            disabled
            aria-label="Share digital pavti"
          >
            शेअर करा
          </button>
          <button
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: 'var(--color-ink)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            disabled
            aria-label="Download PDF"
          >
            डाउनलोड
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--color-ink-soft)',
          opacity: 0.7,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span>{isPaper ? 'मूल प्रति: देणीदार' : 'Donor copy'}</span>
        <span>{isPaper ? 'प्रतिलिपी: मंडळ' : 'Mandal copy'}</span>
      </div>

      {!isPaper && intensity > 0.5 && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '24px',
            height: '24px',
            background: 'var(--color-sindoor)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: intensity,
          }}
          aria-label="QR code indicator"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-paper)">
            <rect x="1" y="1" width="6" height="6" />
            <rect x="9" y="1" width="6" height="6" />
            <rect x="1" y="9" width="6" height="6" />
            <rect x="9" y="9" width="3" height="3" />
            <rect x="1" y="14" width="3" height="3" />
            <rect x="14" y="14" width="6" height="6" />
          </svg>
        </div>
      )}
    </div>
  );
}

function PavtiField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 500, color: 'var(--color-brass)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink)' }}>
        {value}
      </p>
    </div>
  );
}