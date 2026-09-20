import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { formatAmount } from '../../lib/formatters';
import { MANDAL_FINANCES } from '../../data/mandalData';
import type { Language } from '../../types';

interface BenefitBalanceProps {
  language?: Language;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const CONTENT = {
  en: {
    eyebrow: '05 — BALANCE TRACKING',
    headline: 'See collection, expenses and balance together.',
    subheadline: 'Three numbers tell the complete financial story.',
  },
  mr: {
    eyebrow: '०५ — शिल्लक तपशील',
    headline: 'संकलन, खर्च आणि शिल्लक एकत्र पहा.',
    subheadline: 'तीन संख्या संपूर्ण आर्थिक कथा सांगतात.',
  },
  hi: {
    eyebrow: '०५ — बैलेंस ट्रैकिंग',
    headline: 'संग्रह, खर्च और बैलेंस को एक साथ देखें।',
    subheadline: 'तीन संख्या पूरी वित्तीय कहानी बताती हैं।',
  },
};

export function BenefitBalance({
  language = 'en',
  className = '',
  style,
  index = 4,
}: BenefitBalanceProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({ collection: 0, expense: 0, balance: 0 });
  const content = CONTENT[language];

  const finalCollection = MANDAL_FINANCES.finalCollection;
  const finalExpense = MANDAL_FINANCES.finalExpense;
  const finalBalance = MANDAL_FINANCES.finalBalance;

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      setAnimatedValues({ collection: finalCollection, expense: finalExpense, balance: finalBalance });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          setIsVisible(true);
          const targets = { collection: finalCollection, expense: finalExpense, balance: finalBalance };
          const duration = 1200;
          const startTime = Date.now();

          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setAnimatedValues({
              collection: Math.round(targets.collection * eased),
              expense: Math.round(targets.expense * eased),
              balance: Math.round(targets.balance * eased),
            });

            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="benefit-balance"
      className={`benefit-balance ${className}`}
      style={{
        position: 'relative',
        padding: '6rem 2rem',
        background: index % 2 === 0 ? '#FFFBF3' : '#F7EFDD',
        ...style,
      }}
      aria-labelledby={`benefit-balance-heading-${index}`}
    >
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div
          className="benefit-header"
          style={{
            marginBottom: '4rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <p
            id={`benefit-balance-eyebrow-${index}`}
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
            id={`benefit-balance-heading-${index}`}
            className="benefit-headline"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 500,
              lineHeight: 1.25,
              color: 'var(--color-ink)',
              letterSpacing: '-0.01em',
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
          className="balance-cards"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          <BalanceCard
            label="COLLECTION"
            amount={animatedValues.collection}
            formatAmount={formatAmount}
            isVisible={isVisible}
            delay={0}
            prefersReducedMotion={prefersReducedMotion}
            variant="collection"
          />

          <div
            className="balance-operator"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(201, 162, 39, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.5rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-90deg)',
              transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s',
            }}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brass)" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <BalanceCard
            label="EXPENSES"
            amount={animatedValues.expense}
            formatAmount={formatAmount}
            isVisible={isVisible}
            delay={200}
            prefersReducedMotion={prefersReducedMotion}
            variant="expense"
          />

          <div
            className="balance-equals"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(167, 54, 40, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.8)',
              transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s',
            }}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-sindoor)" strokeWidth="2.5">
              <path d="M5 12h14M5 12h14" />
            </svg>
          </div>

          <BalanceCard
            label="BALANCE"
            amount={animatedValues.balance}
            formatAmount={formatAmount}
            isVisible={isVisible}
            delay={400}
            prefersReducedMotion={prefersReducedMotion}
            variant="balance"
          />

          <div
            className="balance-note"
            style={{
              marginTop: '2rem',
              padding: '1.5rem 2rem',
              background: 'rgba(167, 54, 40, 0.06)',
              borderRadius: '12px',
              border: '1px solid rgba(201, 162, 39, 0.15)',
              maxWidth: '600px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s',
            }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.6, color: 'var(--color-ink-soft)' }}>
              Every rupee accounted for. Every donor can verify. Every committee member can trust.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .benefit-balance {
            padding: 2.75rem 1.25rem !important;
          }
          .balance-visual {
            gap: 0.75rem !important;
          }
          .balance-card {
            padding: 1.25rem 1rem !important;
            width: min(320px, 92vw) !important;
          }
          .balance-operator,
          .balance-equals {
            width: 44px !important;
            height: 44px !important;
          }
          .balance-note {
            margin-top: 1.25rem !important;
            padding: 1rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .balance-card,
          .balance-operator,
          .balance-equals,
          .balance-note {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function BalanceCard({
  label,
  amount,
  formatAmount,
  isVisible,
  delay,
  prefersReducedMotion,
  variant,
}: {
  label: string;
  amount: number;
  formatAmount: (amount: number) => string;
  isVisible: boolean;
  delay: number;
  prefersReducedMotion: boolean;
  variant: 'collection' | 'expense' | 'balance';
}) {
  const bgStyles = {
    collection: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(167, 54, 40, 0.1) 100%)',
    expense: 'linear-gradient(135deg, rgba(167, 54, 40, 0.1) 0%, rgba(201, 162, 39, 0.1) 100%)',
    balance: 'linear-gradient(135deg, var(--color-sindoor) 0%, var(--color-sindoor-dark) 100%)',
  };

  const labelColor = variant === 'balance' ? 'rgba(247, 239, 221, 0.9)' : 'var(--color-brass)';
  const amountColor = variant === 'balance' ? 'var(--color-paper)' : variant === 'expense' ? 'var(--color-sindoor)' : 'var(--color-ink)';
  const borderColor = variant === 'balance' ? 'rgba(247, 239, 221, 0.2)' : 'rgba(201, 162, 39, 0.3)';
  const shadow = variant === 'balance' ? '0 16px 40px rgba(167, 54, 40, 0.3)' : '0 8px 24px rgba(42, 30, 23, 0.08)';

  return (
    <div
      className="balance-card"
      style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem 2rem',
        background: bgStyles[variant],
        borderRadius: '16px',
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
        transition: prefersReducedMotion
          ? 'opacity 0.3s ease, transform 0.3s ease'
          : `opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: labelColor,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: 500,
          lineHeight: 1.1,
          color: amountColor,
        }}
      >
        {formatAmount(amount)}
      </p>
    </div>
  );
}

