import { useEffect, useRef, useState } from 'react';

export interface PointerPosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function usePointerInteraction(options: {
  enabled?: boolean;
  reduceMotion?: boolean;
  sensitivity?: number;
} = {}) {
  const { enabled = true, reduceMotion = false, sensitivity = 1 } = options;
  const [position, setPosition] = useState<PointerPosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  const [isInside, setIsInside] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);
  const targetRef = useRef<PointerPosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    if (!enabled || reduceMotion) return;

    const handleMove = (e: MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normalizedX = (x / rect.width) * 2 - 1;
      const normalizedY = (y / rect.height) * 2 - 1;

      targetRef.current = {
        x,
        y,
        normalizedX: normalizedX * sensitivity,
        normalizedY: normalizedY * sensitivity,
      };
    };

    const handleEnter = () => setIsInside(true);
    const handleLeave = () => setIsInside(false);

    const element = document.querySelector('[data-cinematic-hero]') as HTMLElement;
    if (!element) return;

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseenter', handleEnter);
    element.addEventListener('mouseleave', handleLeave);

    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.1,
        y: prev.y + (targetRef.current.y - prev.y) * 0.1,
        normalizedX: prev.normalizedX + (targetRef.current.normalizedX - prev.normalizedX) * 0.1,
        normalizedY: prev.normalizedY + (targetRef.current.normalizedY - prev.normalizedY) * 0.1,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseenter', handleEnter);
      element.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, reduceMotion, sensitivity]);

  return { position, isInside };
}

export function InteractionLayer({
  children,
  className = '',
  style,
  sensitivity = 1,
  enabled = true,
}: {
  children: (position: PointerPosition, isInside: boolean) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sensitivity?: number;
  enabled?: boolean;
}) {
  const { position, isInside } = usePointerInteraction({ sensitivity, enabled });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={`interaction-layer ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
        ...style,
      }}
      data-cinematic-hero
      aria-hidden="true"
    >
      {!prefersReducedMotion && children(position, isInside)}
    </div>
  );
}

export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefers;
}