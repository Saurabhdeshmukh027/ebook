import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface BenefitExpensesProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const CONTENT = {
  en: {
    eyebrow: '04 — EXPENSE RECORDING',
    headline: 'Record where the mandal\'s money goes.',
    subheadline: 'Every rupee spent is logged. The balance stays honest.',
  },
  mr: {
    eyebrow: '०४ — खर्च नोंदणी',
    headline: 'मंडळाचे पैसे कुठे जाले ते नोंदवा.',
    subheadline: 'प्रत्येक खर्च रुपया नोंदलेले. शिल्लक साफ राहते.',
  },
  hi: {
    eyebrow: '०४ — खर्च रिकॉर्डिंग',
    headline: 'मंडल का पैसा कहाँ गया, यह रिकॉर्ड करें।',
    subheadline: 'हर खर्च रुपया दर्ज होता है। बैलेंस साफ रहता है।',
  },
};

const EXPENSES = {
  en: [
    { label: 'Decoration', value: 8500 },
    { label: 'Sound System', value: 6000 },
    { label: 'Prasad', value: 4200 },
    { label: 'Lighting', value: 3500 },
    { label: 'Venue Setup', value: 5000 },
  ],
  mr: [
    { label: 'सजावट', value: 8500 },
    { label: 'ध्वनी प्रणाली', value: 6000 },
    { label: 'प्रसाद', value: 4200 },
    { label: 'प्रकाश व्यवस्था', value: 3500 },
    { label: 'स्थल तयारी', value: 5000 },
  ],
  hi: [
    { label: 'सजावट', value: 8500 },
    { label: 'ध्वनि प्रणाली', value: 6000 },
    { label: 'प्रसाद', value: 4200 },
    { label: 'रोशनी', value: 3500 },
    { label: 'स्थल तैयारी', value: 5000 },
  ],
};

export function BenefitExpenses({
  language = 'en',
  className = '',
  style,
  index = 3,
}: BenefitExpensesProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const content = CONTENT[language];
  const expenses = EXPENSES[language];

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      setAnimatedItems(expenses.map((_, i) => i));
      setTotalExpense(expenses.reduce((sum, e) => sum + e.value, 0));
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          setIsVisible(true);
          let cumulative = 0;
          expenses.forEach((expense, idx) => {
            setTimeout(() => {
              cumulative += expense.value;
              setTotalExpense(cumulative);
              setAnimatedItems(prev => [...prev, idx]);
            }, idx * 300);
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const formatAmount = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  return (
    <section
      ref={sectionRef}
      id="benefit-expenses"
      className={`benefit-expenses ${className}`}
      style={{
        position: 'relative',
        padding: '6rem 2rem',
        background: index % 2 === 0 ? '#FFFBF3' : '#F7EFDD',
        ...style,
      }}
      aria-labelledby={`benefit-expenses-heading-${index}`}
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
              id={`benefit-expenses-eyebrow-${index}`}
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
              id={`benefit-expenses-heading-${index}`}
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
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <div className="expense-entries" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {expenses.map((expense, idx) => (
                <div
                  key={idx}
                  className="expense-entry"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1rem 1.5rem',
                    background: 'var(--color-paper-card)',
                    borderRadius: '10px',
                    border: '1px solid rgba(201, 162, 39, 0.15)',
                    boxShadow: '0 2px 8px rgba(42, 30, 23, 0.04)',
                    opacity: animatedItems.includes(idx) ? 1 : 0,
                    transform: animatedItems.includes(idx) ? 'translateX(0)' : 'translateX(-20px)',
                    transition: prefersReducedMotion
                      ? 'opacity 0.3s ease, transform 0.3s ease'
                      : `opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 150}ms`,
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(167, 54, 40, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-sindoor)" strokeWidth="2">
                      <path d="M21 12V7H12v5M12 7v10" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
                      {expense.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 400, color: 'var(--color-ink-soft)' }}>
                      Recorded in E-PavtiBook
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-sindoor)' }}>
                    {formatAmount(expense.value)}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="expense-total"
              style={{
                marginTop: '1rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(167, 54, 40, 0.1) 0%, rgba(201, 162, 39, 0.1) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: animatedItems.length === expenses.length ? 1 : 0.4,
                transform: animatedItems.length === expenses.length ? 'scale(1)' : 'scale(0.98)',
                transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s',
              }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                TOTAL EXPENSE
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: 'var(--color-sindoor)' }}>
                {formatAmount(totalExpense)}
              </p>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-ink-soft)', textAlign: 'center', marginTop: '0.75rem' }}>
              Sample data — illustrative only
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .benefit-grid {
          @media (max-width: 1024px) {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          @media (max-width: 768px) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .benefit-text,
          .expense-entry {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

