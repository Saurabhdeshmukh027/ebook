import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { t } from '../../data/translations';
import type { Language } from '../../types';

interface BenefitPaymentsProps {
  language?: Language;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const CONTENT = {
  en: {
    eyebrow: '03 — ONLINE PAYMENTS (GOLD & PLATINUM)',
    headline: 'Accept contributions directly to the cashier\'s account.',
    subheadline: 'Available in Gold (₹799/season) and Platinum (₹2,100/season) plans. Contributors pay online; funds reach the mandal directly.',
    note: 'Direct settlement to the mandal\'s bank account. No intermediate wallet. No payment gateway fees beyond standard UPI charges.',
  },
  mr: {
    eyebrow: '०३ — ऑनलाइन पेमेंट (गोल्ड आणि प्लॅटिनम)',
    headline: 'वर्गणी रोख ठेव यथार्थात स्वीकारा.',
    subheadline: 'गोल्ड (₹७९९/हंगाम) आणि प्लॅटिनम (₹२,१००/हंगाम) योजनांमध्ये उपलब्ध. देणीदार ऑनलाइन देतात; रक्कम मंडळात येते.',
    note: 'मंडळाच्या बँक खातेत थेट निर्धार. कोणतेही मध्यस्थ वॉलेट नाही. मानक यूपीआय शुल्कच परत.',
  },
  hi: {
    eyebrow: '०३ — ऑनलाइन भुगतान (गोल्ड और प्लॅटिनम)',
    headline: 'योगदान को सीधे कैशियर के खाते में स्वीकार करें।',
    subheadline: 'गोल्ड (₹७९९/सीजन) और प्लॅटिनम (₹२,१००/सीजन) योजनाओं में उपलब्ध। दाता ऑनलाइन देते हैं; राशि मंडल तक पहुँचती है।',
    note: 'मंडल के बैंक खाते में सीधा निपटान। कोई मध्यस्थ वॉलेट नहीं। केवल मानक यूपीआई शुल्क।',
  },
};

export function BenefitPayments({
  language = 'en',
  className = '',
  style,
  index = 2,
}: BenefitPaymentsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const content = CONTENT[language];
  const common = t(language);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      setAnimationPhase(2);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          setIsVisible(true);
          setTimeout(() => setAnimationPhase(1), 300);
          setTimeout(() => setAnimationPhase(2), 1000);
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'contribution':
        return <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
      case 'online':
        return <path d="M21 12V7H12v5M12 7v10" />;
      case 'cashier':
        return <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />;
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="benefit-payments"
      className={`benefit-payments ${className}`}
      style={{
        position: 'relative',
        padding: '6rem 2rem',
        background: index % 2 === 0 ? '#FFFBF3' : '#F7EFDD',
        ...style,
      }}
      aria-labelledby={`benefit-payments-heading-${index}`}
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
              id={`benefit-payments-eyebrow-${index}`}
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
              id={`benefit-payments-heading-${index}`}
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
                marginBottom: '2rem',
              }}
            >
              {content.subheadline}
            </p>

            <div
              className="benefit-note"
              style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(167, 54, 40, 0.06)',
                borderRadius: '10px',
                border: '1px solid rgba(167, 54, 40, 0.15)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-sindoor)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.6 }}>
                {content.note}
              </p>
            </div>
          </div>

          <div
            className="benefit-visual"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <div
              className="payment-flow"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                { icon: 'contribution', label: { en: 'Contribution', mr: 'वर्गणी', hi: 'योगदान' }, detail: { en: '₹1,100', mr: '₹१,१००', hi: '₹१,१००' } },
                { icon: 'online', label: { en: 'Online UPI', mr: 'ऑनलाइन यूपीआय', hi: 'ऑनलाइन यूपीआई' }, detail: { en: 'Secure', mr: 'सुरक्षित', hi: 'सुरक्षित' } },
                { icon: 'cashier', label: { en: 'Cashier Account', mr: 'कॅशियर खाते', hi: 'कैशियर खाता' }, detail: { en: 'Direct', mr: 'थेट', hi: 'सीधा' } },
              ].map((step, stepIndex) => (
                <div
                  key={step.icon}
                  className="payment-step"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    opacity: animationPhase >= stepIndex + 1 ? 1 : 0.3,
                    transform: animationPhase >= stepIndex + 1 ? 'translateY(0)' : 'translateY(20px)',
                    transition: prefersReducedMotion
                      ? 'opacity 0.3s ease, transform 0.3s ease'
                      : `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${stepIndex * 300}ms`,
                  }}
                >
                  <div
                    className="payment-icon"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '18px',
                      background: animationPhase >= stepIndex + 1
                        ? 'rgba(167, 54, 40, 0.12)'
                        : 'rgba(201, 162, 39, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: animationPhase >= stepIndex + 1 ? '2px solid var(--color-sindoor)' : '1px solid rgba(201, 162, 39, 0.2)',
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={animationPhase >= stepIndex + 1 ? 'var(--color-sindoor)' : 'var(--color-brass)'} strokeWidth="2">
                      {getIcon(step.icon)}
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                      {step.label[language]}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 400, color: 'var(--color-ink-soft)' }}>
                      {step.detail[language]}
                    </p>
                  </div>
                </div>
              ))}
              {[
                { icon: 'contribution', label: { en: 'Contribution', mr: 'वर्गणी', hi: 'योगदान' }, detail: { en: '₹1,100', mr: '₹१,१००', hi: '₹१,१००' } },
                { icon: 'online', label: { en: 'Online UPI', mr: 'ऑनलाइन यूपीआय', hi: 'ऑनलाइन यूपीआई' }, detail: { en: 'Secure', mr: 'सुरक्षित', hi: 'सुरक्षित' } },
                { icon: 'cashier', label: { en: 'Cashier Account', mr: 'कॅशियर खाते', hi: 'कैशियर खाता' }, detail: { en: 'Direct', mr: 'थेट', hi: 'सीधा' } },
              ].map((_, i) => i < 2 && (
                <div
                  key={`arrow-${i}`}
                  className="payment-arrow"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    color: animationPhase > i ? 'var(--color-sindoor)' : 'var(--color-ink-soft)',
                    opacity: animationPhase > i ? 1 : 0.3,
                    transition: prefersReducedMotion ? 'opacity 0.3s ease' : `opacity 0.6s ease ${(i + 1) * 300}ms`,
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>

            <div
              className="payment-plans"
              style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                opacity: animationPhase === 2 ? 1 : 0.5,
                transform: animationPhase === 2 ? 'translateY(0)' : 'translateY(16px)',
                transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.5s',
              }}
            >
              <div
                className="plan-card"
                style={{
                  padding: '1.5rem 2rem',
                  background: 'var(--color-paper-card)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  minWidth: '200px',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(42, 30, 23, 0.06)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-brass)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {common.gold}
                </p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
                  ₹799
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginBottom: '1rem' }}>
                  {common.perSeason}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 400, color: 'var(--color-ink-soft)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: common.goldFeatures }} />
              </div>
              <div
                className="plan-card"
                style={{
                  padding: '1.5rem 2rem',
                  background: 'linear-gradient(135deg, var(--color-sindoor) 0%, var(--color-sindoor-dark) 100%)',
                  borderRadius: '12px',
                  border: 'none',
                  minWidth: '200px',
                  textAlign: 'center',
                  boxShadow: '0 12px 32px rgba(167, 54, 40, 0.3)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(247, 239, 221, 0.9)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {common.platinum}
                </p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-paper)', marginBottom: '0.25rem' }}>
                  ₹2,100
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(247, 239, 221, 0.9)', marginBottom: '1rem' }}>
                  {common.perSeason}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 400, color: 'rgba(247, 239, 221, 0.9)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: common.platinumFeatures }} />
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
          .benefit-payments {
            padding: 2.75rem 1.25rem !important;
          }
          .benefit-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .payment-arrow {
            width: 28px !important;
          }
          .payment-plans {
            flex-direction: column !important;
            gap: 1rem !important;
            margin-top: 1.25rem !important;
          }
          .plan-card {
            min-width: auto !important;
            width: 100% !important;
            padding: 1rem 1.25rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .benefit-text,
          .payment-step,
          .payment-arrow {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}