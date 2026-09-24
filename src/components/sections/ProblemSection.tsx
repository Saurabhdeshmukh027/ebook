import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { Language } from '../../types';

interface ProblemSectionProps {
  language?: Language;
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    eyebrow: 'THE CHALLENGE',
    headline: 'More contributions. More expenses. More records.',
    subheadline: 'As the mandal grows, the paper trail becomes harder to follow.',
    steps: [
      { label: 'Donor gives', value: 'Cash / UPI' },
      { label: 'Committee records', value: 'Paper pavti' },
      { label: 'Notebook entry', value: 'Manual ledger' },
      { label: 'Expense paid', value: 'Separate book' },
      { label: 'Balance checked', value: 'Manual calculation' },
      { label: 'Questions arise', value: 'Trust gaps' },
    ],
  },
  mr: {
    eyebrow: 'आह्वान',
    headline: 'अधिक वर्गणी. अधिक खर्च. अधिक हिशोब.',
    subheadline: 'मंडळ मोठे झाल्यावर, कागदी हिशोब ओळखणे कठीण होते.',
    steps: [
      { label: 'देणीदार देतो', value: 'रोख / यूपीआय' },
      { label: 'कमिटी नोंदवते', value: 'कागदी पावती' },
      { label: 'बहीखातात नोंद', value: 'हस्तचलित हिशोब' },
      { label: 'खर्च केले', value: 'अलग बही' },
      { label: 'शिल्लक तपासले', value: 'हस्तचलित गणना' },
      { label: 'प्रश्न येतात', value: 'विश्वासात फाटा' },
    ],
  },
  hi: {
    eyebrow: 'चुनौती',
    headline: 'अधिक योगदान. अधिक खर्च. अधिक रिकॉर्ड।',
    subheadline: 'जैसे-जैसे मंडल बढ़ता है, कागजी निशान का पालन करना कठिन होता है।',
    steps: [
      { label: 'दाता देता है', value: 'नकद / यूपीआई' },
      { label: 'कमेटी रिकॉर्ड करती है', value: 'कागजी पावती' },
      { label: 'नोटबुक में एंट्री', value: 'मैन्युअल लेजर' },
      { label: 'खर्च भुगतान', value: 'अलग किताब' },
      { label: 'बैलेंस जांचा', value: 'मैन्युअल गणना' },
      { label: 'सवाल उठते हैं', value: 'विश्वास की कमी' },
    ],
  },
};

export function ProblemSection({
  language = 'en',
  className = '',
  style,
}: ProblemSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pavtiRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stepVisible, setStepVisible] = useState<number[]>([]);
  const content = CONTENT[language];

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      setStepVisible([0, 1, 2, 3, 4, 5]);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          setIsVisible(true);
          [0, 1, 2, 3, 4, 5].forEach((i, idx) => {
            setTimeout(() => setStepVisible(prev => [...prev, i]), idx * 120);
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="problem"
      className={`problem-section ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: `
          linear-gradient(180deg, #F7EFDD 0%, #FFFBF3 100%)
        `,
        ...style,
      }}
      aria-labelledby="problem-heading"
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          className="problem-header"
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <p
            className="problem-eyebrow"
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
            id="problem-heading"
            className="problem-headline"
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
            className="problem-subheadline"
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
          className="problem-visual"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          <div
            className="paper-pavti-wrapper"
            ref={pavtiRef}
            style={{
              position: 'sticky',
              top: '4rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <PaperPavti
              isVisible={isVisible}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          <div className="problem-steps" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {content.steps.map((step, index) => (
              <ProblemStep
                key={index}
                step={step}
                index={index}
                isVisible={isVisible && stepVisible.includes(index)}
                prefersReducedMotion={prefersReducedMotion}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .problem-visual {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .paper-pavti-wrapper {
            position: static !important;
          }
        }
        @media (max-width: 768px) {
          .problem-section {
            padding: 3.5rem 1.25rem !important;
          }
          .problem-visual {
            gap: 1.75rem !important;
          }
          .problem-steps {
            gap: 0.625rem !important;
          }
          .problem-step {
            padding: 0.75rem 1rem !important;
          }
          .paper-pavti {
            width: min(320px, 92vw) !important;
            padding: 1.25rem 1rem !important;
            gap: 0.875rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .problem-eyebrow,
          .problem-headline,
          .problem-subheadline,
          .problem-step {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function PaperPavti({
  isVisible,
  prefersReducedMotion,
}: { isVisible: boolean; prefersReducedMotion: boolean }) {
  return (
    <div
      className="paper-pavti"
      style={{
        width: 'min(380px, 90vw)',
        aspectRatio: '3 / 4.5',
        background: `
          linear-gradient(135deg, #FDF8F0 0%, #F5E6D3 50%, #E8D5C0 100%)
        `,
        borderRadius: '8px',
        boxShadow: `
          0 20px 40px rgba(42, 30, 23, 0.15),
          0 8px 16px rgba(42, 30, 23, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(200, 180, 160, 0.2)
        `,
        border: '1px solid rgba(201, 162, 39, 0.3)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) rotate(-1deg)' : 'translateY(30px) rotate(-2deg)',
        transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      aria-label="Traditional paper pavti illustration"
      role="img"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1rem',
          borderBottom: '2px solid var(--color-sindoor)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-ink)' }}>
            पावती
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink-soft)', marginTop: '0.25rem' }}>
            श्री देवी मंडळ, नवरात्रि २०२६
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-sindoor)' }}>
            क्र. ००१२४७
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-ink-soft)', marginTop: '0.25rem' }}>
            दिनांक: १५ ऑक्टोबर २०२६
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
        <PavtiField label="नाम" value="श्री रमेश पाटील" />
        <PavtiField label="रक्कम" value="₹ ५,०००" />
        <PavtiField label="उद्देश" value="वर्गणी" />
        <PavtiField label="पद्धत" value="यूपीआय" />
      </div>

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
        <span>मूल प्रति: देणीदार</span>
        <span>प्रतिलिपी: मंडळ</span>
      </div>
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

function ProblemStep({
  step,
  index,
  isVisible,
  prefersReducedMotion,
  delay,
}: { step: { label: string; value: string }; index: number; isVisible: boolean; prefersReducedMotion: boolean; delay: number }) {
  return (
    <div
      className="problem-step"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.25rem 1.5rem',
        background: 'var(--color-paper-card)',
        borderRadius: '8px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: '0 2px 8px rgba(42, 30, 23, 0.04)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: prefersReducedMotion
          ? 'opacity 0.3s ease, transform 0.3s ease'
          : `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: index % 2 === 0
            ? 'rgba(167, 54, 40, 0.12)'
            : 'rgba(201, 162, 39, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: index % 2 === 0 ? 'var(--color-sindoor)' : 'var(--color-brass)' }}>
          {index === 0 && <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />}
          {index === 1 && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
          {index === 2 && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
          {index === 3 && <path d="M21 12V7H12v5" />}
          {index === 4 && <path d="M12 20V10M18 20V10M6 20v-10" />}
          {index === 5 && <path d="M12 9v4M12 17h.01" />}
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
          {step.label}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-ink-soft)' }}>
          {step.value}
        </p>
      </div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-soft)" strokeWidth="1.5" style={{ opacity: 0.3, flexShrink: 0 }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );
}