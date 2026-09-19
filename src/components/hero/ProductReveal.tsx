import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

export interface ProductRevealProps {
  progress: number;
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
}

const MESSAGES = {
  en: {
    devotional: 'Where devotion meets trust.',
    product: 'E-PavtiBook',
    tagline: 'Digital pavti. Transparent accounts. Sacred trust.',
  },
  mr: {
    devotional: 'श्रद्धेचा उत्सव. विश्वासाचा हिशोब.',
    product: 'ई-पावतीबुक',
    tagline: 'डिजिटल पावती. पारदर्शक खाते. पवित्र विश्वास.',
  },
  hi: {
    devotional: 'श्रद्धा का उत्सव. विश्वास का हिसाब।',
    product: 'ई-पावतीबुक',
    tagline: 'डिजिटल पावती. पारदर्शक खाते. पवित्र विश्वास।',
  },
};

export function ProductReveal({
  progress,
  language = 'en',
  className = '',
  style,
}: ProductRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const content = MESSAGES[language];

  const phaseProgress = (progress - 0.68) / 0.32;
  const clampedProgress = Math.max(0, Math.min(1, phaseProgress));

  const messageProgress = Math.max(0, Math.min(1, (progress - 0.68) / 0.12));
  const transitionProgress = Math.max(0, Math.min(1, (progress - 0.80) / 0.12));
  const productProgress = Math.max(0, Math.min(1, (progress - 0.88) / 0.12));

  useEffect(() => {
    if (clampedProgress > 0.05) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [clampedProgress]);

  if (!isVisible && prefersReducedMotion) {
    return null;
  }

  const bgOpacity = transitionProgress;
  const textOpacity = messageProgress;
  const productOpacity = productProgress;

  return (
    <div
      ref={containerRef}
      className={`product-reveal ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease',
        ...style,
      }}
      aria-hidden={!isVisible}
    >
      <div
        className="product-reveal-bg"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at center, var(--color-paper-card) 0%, transparent 70%),
            linear-gradient(180deg, var(--color-very-deep-maroon) 0%, var(--color-deep-maroon) 50%, var(--color-paper-card) 100%)
          `,
          opacity: bgOpacity,
          pointerEvents: 'none',
        }}
      />

      <div
        className="product-reveal-content"
        style={{
          position: 'relative',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '2rem',
          textAlign: 'center',
          opacity: textOpacity,
          transform: `translateY(${20 * (1 - messageProgress)}px)`,
          transition: prefersReducedMotion ? 'none' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pointerEvents: 'auto',
        }}
      >
        <p
          className="product-reveal-devotional"
          style={{
            fontFamily: 'var(--font-devanagari)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--color-marigold)',
            marginBottom: '2rem',
            letterSpacing: '0.05em',
            opacity: messageProgress,
            transform: `translateY(${16 * (1 - messageProgress)}px)`,
          }}
        >
          {content.devotional}
        </p>

        <h2
          className="product-reveal-product"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'var(--color-ink)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
            opacity: productOpacity,
            transform: `translateY(${24 * (1 - productOpacity)}px) scale(${0.95 + 0.05 * productOpacity})`,
            transition: prefersReducedMotion ? 'none' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {content.product}
        </h2>

        <p
          className="product-reveal-tagline"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.375rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--color-ink-soft)',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: productOpacity,
            transform: `translateY(${16 * (1 - productOpacity)}px)`,
          }}
        >
          {content.tagline}
        </p>

        <DigitalPavtiPreview
          progress={productProgress}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .product-reveal-content,
          .product-reveal-product,
          .product-reveal-tagline,
          .digital-pavti-preview {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function DigitalPavtiPreview({
  progress,
  prefersReducedMotion,
}: { progress: number; prefersReducedMotion: boolean }) {
  if (progress < 0.3) return null;

  const clampedProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.7));

  return (
    <div
      className="digital-pavti-preview"
      style={{
        marginTop: '3rem',
        opacity: clampedProgress,
        transform: `translateY(${20 * (1 - clampedProgress)}px) scale(${0.9 + 0.1 * clampedProgress})`,
        transition: prefersReducedMotion ? 'none' : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: 'auto',
      }}
      aria-label="Digital Pavti preview"
    >
      <div
        style={{
          width: 'min(400px, 90vw)',
          aspectRatio: '3 / 4',
          background: 'var(--color-paper-card)',
          borderRadius: '8px',
          boxShadow: `
            0 4px 24px rgba(42, 30, 23, 0.15),
            0 1px 3px rgba(42, 30, 23, 0.1),
            inset 0 1px 0 rgba(255, 251, 243, 0.5)
          `,
          border: '1px solid rgba(201, 162, 39, 0.2)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'var(--color-ink)',
            }}
          >
            डिजिटल पावती
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-sindoor)',
              background: 'rgba(167, 54, 40, 0.1)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
            }}
          >
            नवरात्रि २०२६
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          <PavtiField label="वर्गणी" value="₹ २,५०,०००" />
          <PavtiField label="पावती" value="१,२४७" />
          <PavtiField label="खर्च" value="₹ ८७,५००" />
          <PavtiField label="शिल्लक" value="₹ १,६२,५००" />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          <button
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'var(--color-sindoor)',
              color: 'var(--color-paper)',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            नवीन प्रविष्टि
          </button>
          <button
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: 'var(--color-ink)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            रिपोर्ट डाउनलोड
          </button>
        </div>
      </div>
    </div>
  );
}

function PavtiField({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(201, 162, 39, 0.08)',
        borderRadius: '6px',
        padding: '1rem',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--color-brass)',
          marginBottom: '0.25rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          fontWeight: 500,
          color: 'var(--color-ink)',
        }}
      >
        {value}
      </p>
    </div>
  );
}