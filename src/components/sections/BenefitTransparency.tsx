import { useEffect, useRef, useState, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface BenefitTransparencyProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const CONTENT = {
  en: {
    eyebrow: '06 — TRANSPARENT RECORDS',
    headline: 'Where there is trust, the record should be clear too.',
    subheadline: 'Pavti + Collection + Expense + Balance = One transparent record.',
    devanagari: 'श्रद्धा जिथे आहे, तिथे हिशोबही स्पष्ट असावा.',
    hindi: 'जहाँ श्रद्धा है, वहाँ हिसाब भी स्पष्ट होना चाहिए।',
  },
  mr: {
    eyebrow: '०६ — पारदर्शक हिशोब',
    headline: 'श्रद्धा जिथे आहे, तिथे हिशोबही स्पष्ट असावा.',
    subheadline: 'पावती + वर्गणी + खर्च + शिल्लक = एक पारदर्शक हिशोब.',
    devanagari: 'श्रद्धा जिथे आहे, तिथे हिशोबही स्पष्ट असावा.',
    hindi: 'जहाँ श्रद्धा है, वहाँ हिसाब भी स्पष्ट होना चाहिए।',
  },
  hi: {
    eyebrow: '०६ — पारदर्शक रिकॉर्ड',
    headline: 'जहाँ श्रद्धा है, वहाँ हिसाब भी स्पष्ट होना चाहिए।',
    subheadline: 'पावती + वर्गणी + खर्च + बैलेंस = एक पारदर्शक रिकॉर्ड।',
    devanagari: 'श्रद्धा जिथे आहे, तिथे हिशोबही स्पष्ट असावा।',
    hindi: 'जहाँ श्रद्धा है, वहाँ हिसाब भी स्पष्ट होना चाहिए।',
  },
};

const BenefitTransparency = forwardRef<HTMLElement, BenefitTransparencyProps>(
  ({ language = 'en', className = '', style, index = 5 }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [pillarStates, setPillarStates] = useState<{ [key: string]: boolean }>({});
    const content = CONTENT[language];

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(sectionRef.current);
        } else {
          ref.current = sectionRef.current;
        }
      }
    }, [ref, sectionRef.current]);

    const pillars = [
      { id: 'pavti', label: { en: 'Digital Pavti', mr: 'डिजिटल पावती', hi: 'डिजिटल पावती' }, desc: { en: 'Instant receipt for every contribution', mr: 'प्रत्येक वर्गणीसाठी तात्काळ रसीद', hi: 'हर योगदान के लिए तत्काल रसीद' }, icon: 'pavti' },
      { id: 'collection', label: { en: 'Vargani Record', mr: 'वर्गणी रेकॉर्ड', hi: 'वर्गणी रिकॉर्ड' }, desc: { en: 'Real-time collection tracking', mr: 'रीयल-टाइम संकलन तपशील', hi: 'रीयल-टाइम संग्रह ट्रैकिंग' }, icon: 'collection' },
      { id: 'expense', label: { en: 'Expense Log', mr: 'खर्च लॉग', hi: 'खर्च लॉग' }, desc: { en: 'Every rupee spent recorded', mr: 'प्रत्येक रुपये खर्च नोंदलेले', hi: 'हर रुपया खर्च रिकॉर्डेड' }, icon: 'expense' },
      { id: 'balance', label: { en: 'Live Balance', mr: 'लाइव्ह शिल्लक', hi: 'लाइव बैलेंस' }, desc: { en: 'Collection minus expense, always', mr: 'संकलन वजा खर्च, नेहमी', hi: 'संग्रह घटा खर्च, हमेशा' }, icon: 'balance' },
    ];

    useEffect(() => {
      if (!sectionRef.current || prefersReducedMotion) {
        setIsVisible(true);
        setPillarStates({ pavti: true, collection: true, expense: true, balance: true });
        return;
      }

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 75%',
          onEnter: () => {
            setIsVisible(true);
            pillars.forEach((pillar, idx) => {
              setTimeout(() => setPillarStates(prev => ({ ...prev, [pillar.id]: true })), idx * 200);
            });
          },
          once: true,
        });
      }, sectionRef);

      return () => ctx.revert();
    }, [prefersReducedMotion]);

    const getIcon = (name: string) => {
      switch (name) {
        case 'pavti':
          return <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />;
        case 'collection':
          return <path d="M12 20V10M18 20V10M6 20v-10" />;
        case 'expense':
          return <path d="M21 12V7H12v5M12 7v10" />;
        case 'balance':
          return <path d="M5 12h14M5 12h14" />;
        default:
          return null;
      }
    };

    return (
      <section
        ref={sectionRef}
        id="benefit-transparency"
        className={`benefit-transparency ${className}`}
        style={{
          position: 'relative',
          padding: '6rem 2rem',
          background: `
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(167, 54, 40, 0.08) 0%, transparent 70%),
            linear-gradient(180deg, #FFFBF3 0%, #F7EFDD 100%)
          `,
          ...style,
        }}
        aria-labelledby={`benefit-transparency-heading-${index}`}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            className="transparency-header"
            style={{
              textAlign: 'center',
              marginBottom: '4rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <p
              id={`benefit-transparency-eyebrow-${index}`}
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
              id={`benefit-transparency-heading-${index}`}
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
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              {content.subheadline}
            </p>
          </div>

          <div
            className="transparency-pillars"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              marginBottom: '4rem',
            }}
          >
            {pillars.map((pillar, idx) => (
              <TransparencyPillar
                key={pillar.id}
                pillar={pillar}
                icon={getIcon(pillar.icon)}
                isVisible={isVisible && pillarStates[pillar.id]}
                prefersReducedMotion={prefersReducedMotion}
                delay={idx * 200}
                language={language}
              />
            ))}
          </div>

          <div
            className="transparency-unified"
            style={{
              position: 'relative',
              padding: '3rem 2rem',
              background: 'var(--color-paper-card)',
              borderRadius: '20px',
              border: '1px solid rgba(201, 162, 39, 0.2)',
              boxShadow: `
                0 20px 40px rgba(42, 30, 23, 0.08),
                0 8px 16px rgba(42, 30, 23, 0.05),
                inset 0 1px 0 rgba(255, 251, 243, 0.5)
              `,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p
                className="transparency-devanagari"
                style={{
                  fontFamily: 'var(--font-devanagari)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'var(--color-sindoor)',
                  marginBottom: '1rem',
                }}
              >
                {content.devanagari}
              </p>
              <p
                className="transparency-hindi"
                style={{
                  fontFamily: 'var(--font-devanagari)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'var(--color-brass)',
                }}
              >
                {content.hindi}
              </p>
            </div>

            <UnifiedRecord />
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .transparency-pillars {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .benefit-transparency {
              padding: 2.75rem 1.25rem !important;
            }
            .transparency-pillars {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.875rem !important;
            }
            .transparency-pillar {
              padding: 1rem 0.875rem !important;
            }
            .unified-record {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .transparency-pillar,
            .unified-record {
              transition: none !important;
            }
          }
        `}</style>
      </section>
    );
  }
);

BenefitTransparency.displayName = 'BenefitTransparency';

interface BenefitTransparencyProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

function TransparencyPillar({
  pillar,
  icon,
  isVisible,
  prefersReducedMotion,
  delay,
  language,
}: {
  pillar: { id: string; label: { en: string; mr: string; hi: string }; desc: { en: string; mr: string; hi: string }; icon: string };
  icon: React.ReactNode;
  isVisible: boolean;
  prefersReducedMotion: boolean;
  delay: number;
  language: 'en' | 'mr' | 'hi';
}) {
  return (
    <div
      className="transparency-pillar"
      style={{
        padding: '2rem',
        background: 'var(--color-paper-card)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: '0 4px 16px rgba(42, 30, 23, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: prefersReducedMotion
          ? 'opacity 0.3s ease, transform 0.3s ease'
          : `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(201, 162, 39, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-brass)" strokeWidth="2">
          {icon}
        </svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-ink)' }}>
        {pillar.label[language]}
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
        {pillar.desc[language]}
      </p>
    </div>
  );
}

function UnifiedRecord() {
  return (
    <div
      className="unified-record"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        background: 'rgba(201, 162, 39, 0.2)',
        borderRadius: '12px',
        padding: '1px',
      }}
      role="img"
      aria-label="Unified E-PavtiBook record showing all four components"
    >
      <UnifiedCell label="PAVTI" value="EP-2026-001247" icon="pavti" color="sindoor" />
      <UnifiedCell label="COLLECTION" value="₹2,56,850" icon="collection" color="brass" />
      <UnifiedCell label="EXPENSE" value="₹27,200" icon="expense" color="sindoor" />
      <UnifiedCell label="BALANCE" value="₹2,29,650" icon="balance" color="marigold" />
    </div>
  );
}

function UnifiedCell({
  label,
  value,
  icon,
  color,
}: { label: string; value: string; icon: string; color: string }) {
  const colorMap = {
    sindoor: 'var(--color-sindoor)',
    brass: 'var(--color-brass)',
    marigold: 'var(--color-marigold)',
  };

  const iconMap: { [key: string]: React.ReactNode } = {
    pavti: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
    collection: <path d="M12 20V10M18 20V10M6 20v-10" />,
    expense: <path d="M21 12V7H12v5M12 7v10" />,
    balance: <path d="M5 12h14M5 12h14" />,
  };

  return (
    <div
      style={{
        background: 'var(--color-paper-card)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${colorMap[color as keyof typeof colorMap]}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colorMap[color as keyof typeof colorMap]} strokeWidth="2">
          {iconMap[icon]}
        </svg>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-brass)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-ink)' }}>
        {value}
      </p>
    </div>
  );
}

export { BenefitTransparency };
export type { BenefitTransparencyProps };