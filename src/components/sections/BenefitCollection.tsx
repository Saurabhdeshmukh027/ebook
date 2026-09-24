import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { t } from '../../data/translations';
import type { Language } from '../../types';

interface BenefitCollectionProps {
  language?: Language;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const CONTENT = {
  en: {
    eyebrow: '02 — VARGANI / COLLECTION',
    headline: 'Keep contributions organized from donor to record.',
    subheadline: 'Every contribution flows into a clear, traceable collection record.',
  },
  mr: {
    eyebrow: '०२ — वर्गणी / संकलन',
    headline: 'देणीदारापासून रेकॉर्डपर्यंत वर्गणी सुव्यवस्थित राखा.',
    subheadline: 'प्रत्येक वर्गणी स्पष्ट, शोधण्यायोग्य संकलन रेकॉर्डमध्ये येते.',
  },
  hi: {
    eyebrow: '०२ — वर्गणी / संग्रह',
    headline: 'दाता से रिकॉर्ड तक योगदान को व्यवस्थित रखें।',
    subheadline: 'हर योगदान एक स्पष्ट, पता लगाने योग्य संग्रह रिकॉर्ड में जाता है।',
  },
};

const FLOW_STEPS = {
  en: [
    { icon: 'donor', label: 'Donor', detail: 'Contributes' },
    { icon: 'upi', label: 'UPI / Cash', detail: 'Payment' },
    { icon: 'pavti', label: 'Digital Pavti', detail: 'Issued' },
    { icon: 'record', label: 'Collection', detail: 'Recorded' },
  ],
  mr: [
    { icon: 'donor', label: 'देणीदार', detail: 'वर्गणी देतो' },
    { icon: 'upi', label: 'यूपीआय / रोख', detail: 'पेमेंट' },
    { icon: 'pavti', label: 'डिजिटल पावती', detail: 'जारी' },
    { icon: 'record', label: 'संकलन', detail: 'नोंदले' },
  ],
  hi: [
    { icon: 'donor', label: 'दाता', detail: 'योगदान देता है' },
    { icon: 'upi', label: 'यूपीआई / नकद', detail: 'भुगतान' },
    { icon: 'pavti', label: 'डिजिटल पावती', detail: 'जारी' },
    { icon: 'record', label: 'संग्रह', detail: 'रिकॉर्ड' },
  ],
};

export function BenefitCollection({
  language = 'en',
  className = '',
  style,
  index = 1,
}: BenefitCollectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const content = CONTENT[language];
  const steps = FLOW_STEPS[language];
  const common = t(language);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      setActiveStep(steps.length - 1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          setIsVisible(true);
          steps.forEach((_, idx) => {
            setTimeout(() => setActiveStep(idx), idx * 500);
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'donor':
        return <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
      case 'upi':
        return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />;
      case 'pavti':
        return <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />;
      case 'record':
        return <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />;
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="benefit-collection"
      className={`benefit-collection ${className}`}
      style={{
        position: 'relative',
        padding: '6rem 2rem',
        background: index % 2 === 0 ? '#FFFBF3' : '#F7EFDD',
        ...style,
      }}
      aria-labelledby={`benefit-collection-heading-${index}`}
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
              id={`benefit-collection-eyebrow-${index}`}
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
              id={`benefit-collection-heading-${index}`}
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
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <div
              className="collection-flow"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {steps.map((step, stepIndex) => (
                <div
                  key={step.icon}
                  className="flow-step"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    opacity: stepIndex <= activeStep ? 1 : 0.3,
                    transform: stepIndex <= activeStep ? 'translateY(0)' : 'translateY(20px)',
                    transition: prefersReducedMotion
                      ? 'opacity 0.3s ease, transform 0.3s ease'
                      : `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${stepIndex * 200}ms`,
                  }}
                >
                  <div
                    className="flow-icon"
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '16px',
                      background: stepIndex <= activeStep
                        ? 'rgba(167, 54, 40, 0.12)'
                        : 'rgba(201, 162, 39, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: stepIndex <= activeStep ? '2px solid var(--color-sindoor)' : '1px solid rgba(201, 162, 39, 0.2)',
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={stepIndex <= activeStep ? 'var(--color-sindoor)' : 'var(--color-brass)'} strokeWidth="2">
                      {getIcon(step.icon)}
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                      {step.label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 400, color: 'var(--color-ink-soft)' }}>
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
              {steps.length > 0 && steps.map((_, i) => i < steps.length - 1 && (
                <div
                  key={`arrow-${i}`}
                  className="flow-arrow"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    color: i < activeStep ? 'var(--color-sindoor)' : 'var(--color-ink-soft)',
                    opacity: i < activeStep ? 1 : 0.3,
                    transition: prefersReducedMotion ? 'opacity 0.3s ease' : `opacity 0.6s ease ${(i + 1) * 200}ms`,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>

            <div
              className="collection-total"
              style={{
                marginTop: '2rem',
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(167, 54, 40, 0.08) 0%, rgba(201, 162, 39, 0.08) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                textAlign: 'center',
                opacity: activeStep === steps.length - 1 ? 1 : 0.4,
                transform: activeStep === steps.length - 1 ? 'scale(1)' : 'scale(0.98)',
                transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.5s',
              }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-brass)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {common.collectionTotal}
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 500, color: 'var(--color-ink)' }}>
                ₹2,56,850
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginTop: '0.5rem' }}>
                {common.sampleDataNote}
              </p>
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
          .benefit-collection {
            padding: 2.75rem 1.25rem !important;
          }
          .benefit-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .flow-icon {
            width: 54px !important;
            height: 54px !important;
          }
          .collection-total {
            margin-top: 1.25rem !important;
            padding: 1.25rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .benefit-text,
          .flow-step {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}