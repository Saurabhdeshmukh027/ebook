import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface BalanceSectionProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
}

const CONTENT = {
  en: {
    eyebrow: 'BALANCE',
    headline: 'Total collection. Total expense. Clear balance.',
    subheadline: 'Three numbers tell the complete financial story.',
    labels: {
      collection: 'TOTAL COLLECTION',
      expense: 'TOTAL EXPENSE',
      balance: 'BALANCE',
    },
  },
  mr: {
    eyebrow: 'शिल्लक',
    headline: 'एकूण संकलन. एकूण खर्च. स्पष्ट शिल्लक.',
    subheadline: 'तीन संख्या संपूर्ण आर्थिक कथा सांगतात.',
    labels: {
      collection: 'एकूण संकलन',
      expense: 'एकूण खर्च',
      balance: 'शिल्लक',
    },
  },
  hi: {
    eyebrow: 'बैलेंस',
    headline: 'कुल संग्रह। कुल खर्च। स्पष्ट बैलेंस।',
    subheadline: 'तीन संख्या पूरी वित्तीय कहानी बताती हैं।',
    labels: {
      collection: 'कुल संग्रह',
      expense: 'कुल खर्च',
      balance: 'बैलेंस',
    },
  },
};

export function BalanceSection({
  language = 'en',
  className = '',
  style,
}: BalanceSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({ collection: 0, expense: 0, balance: 0 });
  const content = CONTENT[language];

  const finalCollection = 256850;
  const finalExpense = 27200;
  const finalBalance = finalCollection - finalExpense;

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
          animateBalance();
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const animateBalance = () => {
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
  };

  const formatAmount = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  return (
    <section
      ref={sectionRef}
      id="balance"
      className={`balance-section ${className}`}
      style={{
        position: 'relative',
        padding: '8rem 2rem',
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(167, 54, 40, 0.05) 0%, transparent 70%),
          linear-gradient(180deg, #F7EFDD 0%, #FFFBF3 100%)
        `,
        ...style,
      }}
      aria-labelledby="balance-heading"
    >
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div
          className="balance-header"
          style={{
            marginBottom: '5rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <p
            className="balance-eyebrow"
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
            id="balance-heading"
            className="balance-headline"
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
            className="balance-subheadline"
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
          className="balance-visual"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          <BalanceCard
            label={content.labels.collection}
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
              width: '60px',
              height: '60px',
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-brass)" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <BalanceCard
            label={content.labels.expense}
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
              width: '60px',
              height: '60px',
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-sindoor)" strokeWidth="2.5">
              <path d="M5 12h14M5 12h14" />
            </svg>
          </div>

          <BalanceCard
            label={content.labels.balance}
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
          .balance-section {
            padding: 3.5rem 1.25rem !important;
          }
          .balance-visual {
            gap: 0.75rem !important;
          }
          .balance-card {
            padding: 1.25rem 1.25rem !important;
            min-width: auto !important;
            width: min(340px, 92vw) !important;
          }
          .balance-operator,
          .balance-equals {
            width: 44px !important;
            height: 44px !important;
            margin-top: 0.25rem !important;
          }
          .balance-note {
            margin-top: 1.25rem !important;
            padding: 1rem 1.25rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .balance-card,
          .balance-operator,
          .balance-equals,
          .balance-note {
            transition: none !important;
            animation: none !important;
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