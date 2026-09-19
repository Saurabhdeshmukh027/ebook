import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealOptions {
  trigger?: HTMLElement | null;
  start?: string;
  once?: boolean;
  onEnter?: () => void;
  prefersReducedMotion?: boolean;
}

export interface RevealState {
  isVisible: boolean;
  ref: React.RefObject<HTMLElement | null>;
}

export function useScrollReveal(options: ScrollRevealOptions): RevealState {
  const {
    trigger = null,
    start = 'top 80%',
    once = true,
    onEnter,
    prefersReducedMotion = false,
  } = options;

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const effectiveTrigger = trigger || sectionRef.current;

  useEffect(() => {
    if (!effectiveTrigger || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: effectiveTrigger,
        start,
        onEnter: () => {
          setIsVisible(true);
          onEnter?.();
        },
        once,
      });
    }, effectiveTrigger);

    return () => ctx.revert();
  }, [effectiveTrigger, start, once, onEnter, prefersReducedMotion]);

  return { isVisible, ref: sectionRef };
}

export interface StaggeredRevealOptions extends ScrollRevealOptions {
  itemCount: number;
  staggerDelay?: number;
  baseDelay?: number;
}

export function useStaggeredReveal(options: StaggeredRevealOptions) {
  const { itemCount, staggerDelay = 120, baseDelay = 0, ...rest } = options;
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const { isVisible, ref } = useScrollReveal({
    ...rest,
    onEnter: () => {
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => setVisibleItems(prev => [...prev, i]), baseDelay + i * staggerDelay);
      }
      rest.onEnter?.();
    },
    prefersReducedMotion: rest.prefersReducedMotion,
  });

  return { isVisible, visibleItems, ref };
}

export function useSectionReveal(
  start: string = 'top 80%',
  once: boolean = true
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start,
        onEnter: () => setIsVisible(true),
        once,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [start, once, prefersReducedMotion]);

  return { isVisible, ref: sectionRef };
}