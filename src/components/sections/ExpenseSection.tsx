import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface ExpenseSectionProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    eyebrow: 'EXPENSE RECORDING',
    headline: 'Contributions come in. Expenses go out.',
    subheadline: 'Every rupee spent is recorded. The balance stays honest.',
    steps: [
      { label: 'Decoration', value: '₹8,500' },
      { label: 'Sound System', value: '₹6,000' },
      { label: 'Prasad', value: '₹4,200' },
      { label: 'Lighting', value: '₹3,500' },
      { label: 'Venue Setup', value: '₹5,000' },
    ],
    marathi: 'वर्गणी आली. खर्च झाला. हिशोब राहिला.',
    hindi: 'वर्गणी आयी। खर्च हुआ। हिसाब रहा।',
  },
  mr: {
    eyebrow: 'खर्च नोंदणी',
    headline: 'वर्गणी आली. खर्च झाला.',
    subheadline: 'प्रत्येक रुपये खर्च नोंदले जाते. शिल्लक साफ राहते.',
    steps: [
      { label: 'सजावट', value: '₹८,५००' },
      { label: 'ध्वनी प्रणाली', value: '₹६,०००' },
      { label: 'प्रसाद', value: '₹४,२००' },
      { label: 'प्रकाश व्यवस्था', value: '₹३,५००' },
      { label: 'स्थल तयारी', value: '₹५,०००' },
    ],
    marathi: 'वर्गणी आली. खर्च झाला. हिशोब राहिला.',
    hindi: 'वर्गणी आयी। खर्च हुआ। हिसाब रहा।',
  },
  hi: {
    eyebrow: 'खर्च रिकॉर्डिंग',
    headline: 'वर्गणी आयी। खर्च हुआ।',
    subheadline: 'हर रुपया खर्च रिकॉर्ड होता है। बैलेंस साफ रहता है।',
    steps: [
      { label: 'सजावट', value: '₹८,५००' },
      { label: 'ध्वनि प्रणाली', value: '₹६,०००' },
      { label: 'प्रसाद', value: '₹४,२००' },
      { label: 'रोशनी', value: '₹३,५००' },
      { label: 'स्थल तैयारी', value: '₹५,०००' },
    ],
    marathi: 'वर्गणी आली. खर्च झाला. हिशोब राहिला।',
    hindi: 'वर्गणी आयी। खर्च हुआ। हिसाब रहा।',
  },
};

export function ExpenseSection({
  language = 'en',
  className = '',
  style,
}: ExpenseSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expenseItems, setExpenseItems] = useState<number[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const content = CONTENT[language];

  const expenses = [
    { label: content.steps[0].label, value: 8500 },
    { label: content.steps[1].label, value: 6000 },
    { label: content.steps[2].label, value: 4200 },
    { label: content.steps[3].label, value: 3500 },
    { label: content.steps[4].label, value: 5000 },
  ];

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      const total = expenses.reduce((sum, e) => sum + e.value, 0);
      setTotalExpense(total);
      setExpenseItems(expenses.map(e => e.value));
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          setIsVisible(true);
          animateExpenses();
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const animateExpenses = () => {
    let cumulative = 0;
    expenses.forEach((expense, idx) => {
      setTimeout(() => {
        cumulative += expense.value;
        setTotalExpense(cumulative);
        setExpenseItems(prev => [...prev, expense.value]);
      }, idx * 400);
    });
  };

  const formatAmount = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <section
      ref={sectionRef}
      id="expense"
      className={`expense-section ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: `
          linear-gradient(180deg, #FFFBF3 0%, #F7EFDD 100%)
        `,
        ...style,
      }}
      aria-labelledby="expense-heading"
    >
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          className="expense-header"
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <p
            className="expense-eyebrow"
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
            id="expense-heading"
            className="expense-headline"
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
            className="expense-subheadline"
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

          <p
            className="expense-marathi"
            style={{
              fontFamily: 'var(--font-devanagari)',
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--color-marigold)',
              marginTop: '2rem',
              opacity: 0.9,
            }}
          >
            {content.marathi}
          </p>

          <p
            className="expense-hindi"
            style={{
              fontFamily: 'var(--font-devanagari)',
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--color-brass)',
              marginTop: '0.5rem',
              opacity: 0.7,
            }}
          >
            {content.hindi}
          </p>
        </div>

        <div
          className="expense-visual"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          <div className="expense-entries" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {expenses.map((expense, index) => (
              <ExpenseEntry
                key={index}
                expense={expense}
                isVisible={isVisible && expenseItems.includes(expense.value)}
                prefersReducedMotion={prefersReducedMotion}
                delay={index * 150}
              />
            ))}

            <div
              className="expense-total-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(167, 54, 40, 0.1) 0%, rgba(201, 162, 39, 0.1) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                marginTop: '1rem',
                opacity: isVisible && expenseItems.length === expenses.length ? 1 : 0,
                transform: isVisible && expenseItems.length === expenses.length ? 'translateY(0)' : 'translateY(16px)',
                transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s',
              }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                TOTAL EXPENSE
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 500,
                  color: 'var(--color-sindoor)',
                }}
              >
                {formatAmount(totalExpense)}
              </p>
            </div>
          </div>

          <div
            className="expense-summary"
            style={{
              position: 'sticky',
              top: '4rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <div
              style={{
                width: 'min(360px, 90vw)',
                background: 'var(--color-paper-card)',
                borderRadius: '12px',
                boxShadow: `
                  0 20px 40px rgba(42, 30, 23, 0.1),
                  0 8px 16px rgba(42, 30, 23, 0.06),
                  inset 0 1px 0 rgba(255, 251, 243, 0.5),
                  0 0 0 1px rgba(201, 162, 39, 0.15)
                `,
                padding: '1.5rem',
              }}
            >
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '1.5rem', textAlign: 'center' }}>
                खर्च तपशील
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {expenses.map((expense, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: index % 2 === 0 ? 'rgba(201, 162, 39, 0.05)' : 'transparent',
                      borderRadius: '8px',
                      opacity: isVisible && expenseItems.includes(expense.value) ? 1 : 0.3,
                      transform: isVisible && expenseItems.includes(expense.value) ? 'translateX(0)' : 'translateX(-10px)',
                      transition: prefersReducedMotion
                        ? 'opacity 0.3s ease, transform 0.3s ease'
                        : `opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 150}ms`,
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                      {expense.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-sindoor)' }}>
                      {formatAmount(expense.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--color-sindoor) 0%, var(--color-sindoor-dark) 100%)',
                borderRadius: '12px',
                minWidth: '280px',
                boxShadow: '0 12px 32px rgba(167, 54, 40, 0.3)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'rgba(247, 239, 221, 0.9)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                TOTAL EXPENSE
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 500,
                  color: 'var(--color-paper)',
                }}
              >
                {formatAmount(totalExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .expense-visual {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .expense-summary {
            position: static !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .expense-entry {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function ExpenseEntry({
  expense,
  isVisible,
  prefersReducedMotion,
  delay,
}: {
  expense: { label: string; value: number };
  isVisible: boolean;
  prefersReducedMotion: boolean;
  delay: number;
}) {
  const formatAmount = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  return (
    <div
      className="expense-entry"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.25rem 1.5rem',
        background: 'var(--color-paper-card)',
        borderRadius: '12px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: '0 2px 8px rgba(42, 30, 23, 0.04)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
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
          background: 'rgba(167, 54, 40, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-sindoor)" strokeWidth="2">
          <path d="M21 12V7H12v5M12 7v10" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
          {expense.label}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-ink-soft)' }}>
          Recorded in E-PavtiBook
        </p>
      </div>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-sindoor)' }}>
        {formatAmount(expense.value)}
      </p>
    </div>
  );
}