import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MandalBenefitsIntro } from './MandalBenefitsIntro';
import { BenefitPavti } from './BenefitPavti';
import { BenefitCollection } from './BenefitCollection';
import { BenefitPayments } from './BenefitPayments';
import { BenefitExpenses } from './BenefitExpenses';
import { BenefitBalance } from './BenefitBalance';
import { BenefitTransparency } from './BenefitTransparency';
import type { Language } from '../../types';

export interface MandalBenefitsProps {
  language?: Language;
  className?: string;
  onComplete?: () => void;
}

export function MandalBenefits({ language = 'en', className = '', onComplete }: MandalBenefitsProps) {
  const transparencyRef = useRef<HTMLElement>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!transparencyRef.current || completed) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: transparencyRef.current,
        start: 'bottom 80%',
        onEnter: () => {
          if (!completed) {
            setCompleted(true);
            onComplete?.();
          }
        },
        once: true,
      });
    }, transparencyRef);

    return () => ctx.revert();
  }, [completed, onComplete]);

  return (
    <section id="features" className={`mandal-benefits ${className}`} style={{ position: 'relative' }}>
      <MandalBenefitsIntro language={language} />
      <BenefitPavti language={language} index={0} />
      <BenefitCollection language={language} index={1} />
      <BenefitPayments language={language} index={2} />
      <BenefitExpenses language={language} index={3} />
      <BenefitBalance language={language} index={4} />
      <BenefitTransparency ref={transparencyRef} language={language} index={5} />
    </section>
  );
}