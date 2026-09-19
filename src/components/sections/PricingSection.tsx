import { PricingTransition } from './PricingTransition';
import { PricingPlan } from './PricingPlan';

export interface PricingSectionProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
}

export function PricingSection({ language = 'en', className = '' }: PricingSectionProps) {
  return (
    <main className={`pricing-section ${className}`} style={{ position: 'relative' }}>
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
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
              max-width: 420px;
              margin: 0 auto;
            }
          }
          @media (max-width: 640px) {
            .pricing-cards {
              padding: 3rem 1.5rem 5rem !important;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .pricing-plan {
              transition: none !important;
            }
          }
        `}</style>
      </section>
    </main>
  );
}