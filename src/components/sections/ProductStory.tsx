import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StatementSection } from './StatementSection';
import { ProblemSection } from './ProblemSection';
import { DigitalPavtiTransform } from './DigitalPavtiTransform';
import { CollectionSection } from './CollectionSection';
import { ExpenseSection } from './ExpenseSection';
import { BalanceSection } from './BalanceSection';
import { TransparencySection } from './TransparencySection';

gsap.registerPlugin(ScrollTrigger);

export interface ProductStoryProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  onComplete?: () => void;
}

export function ProductStory({ language = 'en', className = '', onComplete }: ProductStoryProps) {
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
    <section id="product" className={`product-story ${className}`} style={{ position: 'relative' }}>
      <StatementSection language={language} />
      <ProblemSection language={language} />
      <DigitalPavtiTransform language={language} />
      <CollectionSection language={language} />
      <ExpenseSection language={language} />
      <BalanceSection language={language} />
      <TransparencySection ref={transparencyRef} language={language} />
    </section>
  );
}