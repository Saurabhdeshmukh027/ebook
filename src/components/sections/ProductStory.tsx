import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StatementSection } from './StatementSection';
import { ProblemSection } from './ProblemSection';
import { DigitalPavtiTransform } from './DigitalPavtiTransform';
import type { Language } from '../../types';

export interface ProductStoryProps {
  language?: Language;
  className?: string;
  onComplete?: () => void;
}

export function ProductStory({ language = 'en', className = '', onComplete }: ProductStoryProps) {
  const storyEndRef = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!storyEndRef.current || completed) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: storyEndRef.current,
        start: 'bottom 80%',
        onEnter: () => {
          if (!completed) {
            setCompleted(true);
            onComplete?.();
          }
        },
        once: true,
      });
    }, storyEndRef);

    return () => ctx.revert();
  }, [completed, onComplete]);

  return (
    <section id="product" className={`product-story ${className}`} style={{ position: 'relative' }}>
      <StatementSection language={language} />
      <ProblemSection language={language} />
      <div ref={storyEndRef}>
        <DigitalPavtiTransform language={language} />
      </div>
    </section>
  );
}