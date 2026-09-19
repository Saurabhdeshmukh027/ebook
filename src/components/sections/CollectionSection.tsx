import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface CollectionSectionProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    eyebrow: 'VARGANI / COLLECTION',
    headline: 'A contribution arrives. A digital pavti is issued.',
    subheadline: 'Every donor gets an instant record. The mandal sees every entry.',
    steps: [
      { label: 'Donor contributes', value: '₹1,100 via UPI' },
      { label: 'System records', value: 'Instant entry' },
      { label: 'Digital pavti generated', value: 'EP-2026-001247' },
      { label: 'Mandal notified', value: 'Real-time update' },
      { label: 'Collection total updates', value: '₹2,47,850' },
    ],
  },
  mr: {
    eyebrow: 'वर्गणी / संकलन',
    headline: 'वर्गणी येते. डिजिटल पावती निर्माण होते.',
    subheadline: 'प्रत्येक देणीदाराला तात्काळ रेकॉर्ड. मंडळाला प्रत्येक नोंद दिसते.',
    steps: [
      { label: 'देणीदार वर्गणी देतो', value: '₹१,१०० यूपीआयमार्फत' },
      { label: 'प्रणाली नोंदवते', value: 'तात्काळ एंट्री' },
      { label: 'डिजिटल पावती निर्माण', value: 'EP-2026-001247' },
      { label: 'मंडळाला सूचना', value: 'रीयल-टाइम अपडेट' },
      { label: 'संकलन एकूण अद्ययावत', value: '₹२,४७,८५०' },
    ],
  },
  hi: {
    eyebrow: 'वर्गणी / संग्रह',
    headline: 'योगदान आता है। डिजिटल पावती बनती है।',
    subheadline: 'हर दाता को तत्काल रिकॉर्ड। मंडल को हर एंट्री दिखती है।',
    steps: [
      { label: 'दाता योगदान देता है', value: '₹१,१०० यूपीआई से' },
      { label: 'सिस्टम रिकॉर्ड करता है', value: 'तात्कालिक एंट्री' },
      { label: 'डिजिटल पावती बनती है', value: 'EP-2026-001247' },
      { label: 'मंडल को सूचना', value: 'रीयल-टाइम अपडेट' },
      { label: 'संग्रह कुल अपडेट होता है', value: '₹२,४७,८५०' },
    ],
  },
};

export function CollectionSection({
  language = 'en',
  className = '',
  style,
}: CollectionSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pavtiNumber, setPavtiNumber] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
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
          animateCollectionFlow();
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const animateCollectionFlow = () => {
    if (isAnimating || prefersReducedMotion) return;
    setIsAnimating(true);

    const sequence = [
      { donor: 'Ramesh Patil', amount: '₹1,100', pavti: 'EP-2026-001247', total: 247850, delay: 0 },
      { donor: 'Sunita Joshi', amount: '₹2,500', pavti: 'EP-2026-001248', total: 250350, delay: 800 },
      { donor: 'Vikram Shah', amount: '₹5,000', pavti: 'EP-2026-001249', total: 255350, delay: 1600 },
      { donor: 'Anjali Desai', amount: '₹1,500', pavti: 'EP-2026-001250', total: 256850, delay: 2400 },
      { donor: 'Community Total', amount: '', pavti: '', total: 256850, delay: 3200 },
    ];

    sequence.forEach((step) => {
      setTimeout(() => {
        setDonorName(step.donor);
        setPavtiNumber(step.pavti);
        if (step.amount) {
          animateAmount(step.total);
        }
      }, step.delay);
    });

    setTimeout(() => setIsAnimating(false), sequence[sequence.length - 1].delay + 500);
  };

  const animateAmount = (target: number) => {
    const start = totalAmount;
    const duration = 800;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setTotalAmount(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <section
      ref={sectionRef}
      id="collection"
      className={`collection-section ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: `
          linear-gradient(180deg, #F7EFDD 0%, #FFFBF3 50%, #F7EFDD 100%)
        `,
        ...style,
      }}
      aria-labelledby="collection-heading"
    >
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          className="collection-header"
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <p
            className="collection-eyebrow"
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
            id="collection-heading"
            className="collection-headline"
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
            className="collection-subheadline"
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
          className="collection-visual"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          <div className="collection-flow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {content.steps.map((step, index) => (
              <CollectionStep
                key={index}
                step={step}
                index={index}
                isActive={index === 0 && isAnimating}
                isComplete={!isAnimating && index < content.steps.length - 1}
                prefersReducedMotion={prefersReducedMotion}
                delay={index * 100}
              />
            ))}
          </div>

          <div
            className="collection-display"
            style={{
              position: 'sticky',
              top: '4rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <CollectionPavtiPreview
              donorName={donorName || '—'}
              pavtiNumber={pavtiNumber || '—'}
              prefersReducedMotion={prefersReducedMotion}
              isAnimating={isAnimating}
            />

            <CollectionTotal
              amount={totalAmount}
              label={content.eyebrow === 'VARGANI / COLLECTION' ? 'COLLECTION TOTAL' : 'संग्रह एकूण'}
              prefersReducedMotion={prefersReducedMotion}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .collection-visual {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .collection-display {
            position: static !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .collection-step,
          .collection-total-amount {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function CollectionStep({
  step,
  index,
  isActive,
  isComplete,
  prefersReducedMotion,
  delay,
}: {
  step: { label: string; value: string };
  index: number;
  isActive: boolean;
  isComplete: boolean;
  prefersReducedMotion: boolean;
  delay: number;
}) {
  return (
    <div
      className="collection-step"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
        background: isComplete ? 'var(--color-paper-card)' : 'rgba(255, 251, 243, 0.5)',
        borderRadius: '12px',
        border: isComplete
          ? '1px solid rgba(201, 162, 39, 0.3)'
          : isActive
          ? '2px solid var(--color-marigold)'
          : '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: isActive
          ? '0 8px 32px rgba(232, 149, 30, 0.15)'
          : '0 2px 8px rgba(42, 30, 23, 0.04)',
        opacity: isVisibleOrAnimating(isActive, isComplete) ? 1 : 0.4,
        transform: isVisibleOrAnimating(isActive, isComplete) ? 'translateX(0)' : 'translateX(-20px)',
        transition: prefersReducedMotion
          ? 'opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
          : `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isComplete
            ? 'rgba(167, 54, 40, 0.12)'
            : isActive
            ? 'var(--color-marigold)'
            : 'rgba(201, 162, 39, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width={isComplete ? 24 : 20}
          height={isComplete ? 24 : 20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isComplete ? 'var(--color-sindoor)' : isActive ? 'var(--color-paper)' : 'var(--color-brass)'}
          strokeWidth={2}
          style={{ flexShrink: 0 }}
        >
          {index === 0 && <path d="M21 12V7H12v5M12 7v10" />}
          {index === 1 && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
          {index === 2 && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
          {index === 3 && <path d="M18 8A6 6 0 0 1 24 14" />}
          {index === 4 && <path d="M12 20V10M18 20V10M6 20v-10" />}
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
          {step.label}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 400, color: 'var(--color-ink-soft)' }}>
          {step.value}
        </p>
      </div>
    </div>
  );
}

function isVisibleOrAnimating(isActive: boolean, isComplete: boolean) {
  return isActive || isComplete;
}

function CollectionPavtiPreview({
  donorName,
  pavtiNumber,
  prefersReducedMotion,
  isAnimating,
}: {
  donorName: string;
  pavtiNumber: string;
  prefersReducedMotion: boolean;
  isAnimating: boolean;
}) {
  return (
    <div
      style={{
        width: 'min(360px, 90vw)',
        aspectRatio: '3 / 4',
        background: 'var(--color-paper-card)',
        borderRadius: '12px',
        boxShadow: `
          0 20px 40px rgba(42, 30, 23, 0.12),
          0 8px 16px rgba(42, 30, 23, 0.08),
          inset 0 1px 0 rgba(255, 251, 243, 0.5),
          0 0 0 1px rgba(201, 162, 39, 0.2)
        `,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        opacity: isAnimating ? 1 : 0.6,
        transform: isAnimating ? 'scale(1.02)' : 'scale(1)',
        transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
      }}
      aria-label="Digital pavti preview"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201, 162, 39, 0.2)', paddingBottom: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-ink)' }}>डिजिटल पावती</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-ink-soft)' }}>E-PavtiBook · Navratri 2026</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-sindoor)' }}>{pavtiNumber}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-ink-soft)' }}>15 Oct 2026 · 14:32</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <PavtiField label="Donor" value={donorName} />
        <PavtiField label="Amount" value="₹ 1,100" />
        <PavtiField label="Purpose" value="Vargani" />
        <PavtiField label="Mode" value="UPI" />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button style={{ flex: 1, padding: '0.75rem', background: 'var(--color-sindoor)', color: 'var(--color-paper)', border: 'none', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Share</button>
        <button style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'var(--color-ink)', border: '1px solid rgba(201, 162, 39, 0.3)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Download</button>
      </div>
    </div>
  );
}

function CollectionTotal({
  amount,
  label,
  prefersReducedMotion,
  isAnimating,
}: {
  amount: number;
  label: string;
  prefersReducedMotion: boolean;
  isAnimating: boolean;
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(167, 54, 40, 0.08) 0%, rgba(201, 162, 39, 0.08) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        minWidth: '280px',
        opacity: isAnimating ? 1 : 0.6,
        transform: isAnimating ? 'scale(1.02)' : 'scale(1)',
        transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-brass)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </p>
      <p
        className="collection-total-amount"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 500,
          lineHeight: 1.1,
          color: 'var(--color-ink)',
        }}
      >
        ₹{amount.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

function PavtiField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-brass)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-ink)' }}>
        {value}
      </p>
    </div>
  );
}