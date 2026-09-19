import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

export interface HeroAtmosphereProps {
  intensity?: number;
  enableVignette?: boolean;
  enableHaze?: boolean;
  enableDepth?: boolean;
  enableGrain?: boolean;
  className?: string;
  style?: React.CSSProperties;
  isVideoReady?: boolean;
  velocity?: number;
}

export function HeroAtmosphere({
  intensity = 1,
  enableVignette = true,
  enableHaze = true,
  enableDepth = true,
  enableGrain = true,
  className = '',
  style,
  isVideoReady = false,
  velocity = 0,
}: HeroAtmosphereProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVideoReady) {
      setOpacity(1);
    }
  }, [isVideoReady]);

  if (prefersReducedMotion) {
    return null;
  }

  // Subtle velocity-aware haze shift: "felt, not noticed"
  // At rest: 0 extra. During scroll: very slight brightness increase
  const velocityFactor = Math.min(Math.abs(velocity) * 0.15, 0.08);

  return (
    <div
      className={`hero-atmosphere ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ...style,
      }}
      aria-hidden="true"
    >
      {enableVignette && (
        <div
          className="atmospheric-vignette"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, transparent 35%, rgba(10,10,10,${0.65 * intensity}) 100%)`,
            zIndex: 1,
          }}
        />
      )}

      {enableHaze && (
        <div
          className="atmospheric-haze"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 85% 55% at 50% 25%, rgba(167, 54, 40, ${(0.025 + velocityFactor * 0.5) * intensity}) 0%, transparent 70%),
              radial-gradient(ellipse 65% 45% at 50% 75%, rgba(232, 149, 30, ${(0.018 + velocityFactor * 0.3) * intensity}) 0%, transparent 70%)
            `,
            zIndex: 2,
          }}
        />
      )}

      {enableDepth && (
        <div
          className="atmospheric-depth"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(180deg, 
              rgba(10,10,10,${0.35 * intensity}) 0%, 
              transparent 35%, 
              transparent 65%, 
              rgba(10,10,10,${0.55 * intensity}) 100%)`,
            zIndex: 3,
          }}
        />
      )}

      {enableGrain && (
        <div
          className="atmospheric-grain"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.03,
            zIndex: 4,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px',
            animation: 'grain-shift 8s steps(10) infinite',
          }}
        />
      )}

      <style>{`
        @keyframes grain-shift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-2%, 1%); }
          20% { transform: translate(1%, -1%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(1%, 1%); }
          70% { transform: translate(-1%, -2%); }
          80% { transform: translate(2%, 1%); }
          90% { transform: translate(-1%, 2%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}