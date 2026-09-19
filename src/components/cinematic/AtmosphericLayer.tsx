import { useEffect, useRef } from 'react';
import { useCinematicVideo } from './CinematicVideo';

interface AtmosphericLayerProps {
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  enableVignette?: boolean;
  enableHaze?: boolean;
  enableDepth?: boolean;
}

export function AtmosphericLayer({
  videoSrc,
  className = '',
  style,
  intensity = 1,
  enableVignette = true,
  enableHaze = true,
  enableDepth = true,
}: AtmosphericLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useCinematicVideo(videoSrc, { autoplay: false });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const vignette = document.createElement('div');
    vignette.className = 'atmospheric-vignette';
    vignette.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,${0.6 * intensity}) 100%);
      z-index: 1;
    `;

    const haze = document.createElement('div');
    haze.className = 'atmospheric-haze';
    haze.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: 
        radial-gradient(ellipse 80% 50% at 50% 20%, rgba(167, 54, 40, ${0.03 * intensity}) 0%, transparent 70%),
        radial-gradient(ellipse 60% 40% at 50% 80%, rgba(232, 149, 30, ${0.02 * intensity}) 0%, transparent 70%);
      z-index: 2;
      opacity: 0;
      transition: opacity 2s ease;
    `;

    const depthOverlay = document.createElement('div');
    depthOverlay.className = 'atmospheric-depth';
    depthOverlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(180deg, 
        rgba(10,10,10,${0.3 * intensity}) 0%, 
        transparent 40%, 
        transparent 60%, 
        rgba(10,10,10,${0.5 * intensity}) 100%);
      z-index: 3;
    `;

    container.appendChild(vignette);
    container.appendChild(haze);
    container.appendChild(depthOverlay);

    requestAnimationFrame(() => {
      haze.style.opacity = '1';
    });

    return () => {
      vignette.remove();
      haze.remove();
      depthOverlay.remove();
    };
  }, [videoSrc, intensity, enableVignette, enableHaze, enableDepth, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`atmospheric-layer ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}