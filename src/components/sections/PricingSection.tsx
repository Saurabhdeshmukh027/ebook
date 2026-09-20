import { PricingTransition } from './PricingTransition';
import { PricingPlan } from './PricingPlan';
import type { Language } from '../../types';

export interface PricingSectionProps {
  language?: Language;
  className?: string;
}

export function PricingSection({ language = 'en', className = '' }: PricingSectionProps) {
  return (
    <div className={`pricing-section ${className}`} style={{ position: 'relative' }}>
      <PricingTransition language={language} />

      <section
        id="pricing"
        className="pricing-cards"
        style={{
          position: 'relative',
          padding: '4rem 2rem 6rem',
          background: `
            linear-gradient(180deg, #F7EFDD 0%, #FFFBF3 50%, #F7EFDD 100%)
          `,
        }}
        aria-labelledby="pricing-heading"
      >
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            className="pricing-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              alignItems: 'stretch',
            }}
          >
            <PricingPlan language={language} tier="silver" />
            <PricingPlan language={language} tier="gold" />
            <PricingPlan language={language} tier="platinum" />
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .pricing-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 0.75rem !important;
              max-width: 100% !important;
            }
            .pricing-plan {
              padding: 1.5rem 0.875rem !important;
              gap: 1rem !important;
            }
            .plan-header p {
              font-size: 0.875rem !important;
            }
            .plan-price span:first-child {
              font-size: 2.25rem !important;
            }
            .plan-features li {
              font-size: 0.8125rem !important;
            }
          }
          @media (max-width: 768px) {
            .pricing-cards {
              padding: 2.5rem 0.5rem 3.5rem !important;
            }
            .pricing-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 6px !important;
              max-width: 100% !important;
            }
            .pricing-plan {
              padding: 0.875rem 0.35rem !important;
              gap: 0.625rem !important;
              border-radius: 8px !important;
            }
            .plan-header p {
              font-size: 0.7rem !important;
              letter-spacing: 0.05em !important;
            }
            .plan-price {
              gap: 2px !important;
            }
            .plan-price span:first-child {
              font-size: clamp(1.15rem, 3.5vw, 1.625rem) !important;
            }
            .plan-price span:last-child {
              font-size: 0.5625rem !important;
              margin-bottom: 2px !important;
            }
            .plan-features {
              gap: 0.35rem !important;
              padding: 0 !important;
            }
            .plan-features li {
              gap: 0.25rem !important;
              font-size: 0.625rem !important;
              line-height: 1.25 !important;
            }
            .plan-features svg {
              width: 11px !important;
              height: 11px !important;
              min-width: 11px !important;
            }
            .plan-note {
              font-size: 0.55rem !important;
              padding: 0.35rem 0.25rem !important;
              margin-top: 0.25rem !important;
              line-height: 1.3 !important;
            }
            .plan-cta {
              padding: 0.45rem 0.2rem !important;
              font-size: 0.65rem !important;
              margin-top: auto !important;
              border-radius: 4px !important;
            }
          }
          @media (max-width: 360px) {
            .pricing-cards {
              padding: 2rem 0.25rem 3rem !important;
            }
            .pricing-grid {
              gap: 4px !important;
            }
            .pricing-plan {
              padding: 0.75rem 0.2rem !important;
              gap: 0.5rem !important;
            }
            .plan-price span:first-child {
              font-size: 1.1rem !important;
            }
            .plan-features li {
              font-size: 0.5625rem !important;
            }
            .plan-features svg {
              width: 9px !important;
              height: 9px !important;
              min-width: 9px !important;
            }
            .plan-cta {
              font-size: 0.6rem !important;
              padding: 0.4rem 0.15rem !important;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .pricing-plan {
              transition: none !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}