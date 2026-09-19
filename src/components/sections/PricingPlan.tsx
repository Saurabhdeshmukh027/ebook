import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../cinematic/InteractionLayer';

gsap.registerPlugin(ScrollTrigger);

interface PricingPlanProps {
  language?: 'en' | 'mr' | 'hi';
  className?: string;
  style?: React.CSSProperties;
  tier: PlanTier;
}

type PlanTier = 'silver' | 'gold' | 'platinum';

const PLANS = {
  en: {
    silver: {
      name: 'Silver',
      price: '499',
      period: '/ season',
      features: [
        '100 digital pavtis',
        'Expense log & balance tracking',
        'Vargani & interest collection management',
      ],
      cta: 'Choose Silver',
    },
    gold: {
      name: 'Gold',
      price: '799',
      period: '/ season',
      features: [
        'Unlimited digital pavtis',
        '4 receipt templates',
        'Personalized receipts with blessings',
        'Online payments direct to cashier\'s account',
      ],
      cta: 'Choose Gold',
    },
    platinum: {
      name: 'Platinum',
      price: '2,100',
      period: '/ season',
      features: [
        'Unlimited digital pavtis',
        '4 receipt templates',
        'Online payments direct to cashier\'s account',
        'Customized mandal webpage with:',
        '  Mandal history',
        '  Bhandara invitations',
        '  Daily dress code',
      ],
      cta: 'Choose Platinum',
    },
  },
  mr: {
    silver: {
      name: 'सिल्वर',
      price: '499',
      period: '/ हंगाम',
      features: [
        '१०० डिजिटल पावती',
        'खर्च लॉग आणि शिल्लक तपशील',
        'वर्गणी आणि व्याज संकलन व्यवस्थापन',
      ],
      cta: 'सिल्वर निवडा',
    },
    gold: {
      name: 'गोल्ड',
      price: '799',
      period: '/ हंगाम',
      features: [
        'अमर्याद डिजिटल पावती',
        '४ रसीद टेम्पलेट्स',
        'आशीर्वादासह वैयक्तिक रसीद',
        'कॅशियरच्या खातेत ऑनलाइन पेमेंट',
      ],
      cta: 'गोल्ड निवडा',
    },
    platinum: {
      name: 'प्लॅटिनम',
      price: '2,100',
      period: '/ हंगाम',
      features: [
        'अमर्याद डिजिटल पावती',
        '४ रसीद टेम्पलेट्स',
        'कॅशियरच्या खातेत ऑनलाइन पेमेंट',
        'सादरीकृत मंडळ वेबपेज:',
        '  मंडळ इतिहास',
        '  भंडारा आमंत्रण',
        '  दैनंदिन ड्रेस कोड',
      ],
      cta: 'प्लॅटिनम निवडा',
    },
  },
  hi: {
    silver: {
      name: 'सिल्वर',
      price: '499',
      period: '/ सीजन',
      features: [
        '१०० डिजिटल पावती',
        'खर्च लॉग और बैलेंस ट्रैकिंग',
        'वर्गणी और ब्याज संग्रह प्रबंधन',
      ],
      cta: 'सिल्वर चुनें',
    },
    gold: {
      name: 'गोल्ड',
      price: '799',
      period: '/ सीजन',
      features: [
        'असीमित डिजिटल पावती',
        '४ रसीद टेम्पलेट्स',
        'आशीर्वाद के साथ व्यक्तिगत रसीद',
        'कैशियर के खाते में ऑनलाइन भुगतान',
      ],
      cta: 'गोल्ड चुनें',
    },
    platinum: {
      name: 'प्लॅटिनम',
      price: '2,100',
      period: '/ सीजन',
      features: [
        'असीमित डिजिटल पावती',
        '४ रसीद टेम्पलेट्स',
        'कैशियर के खाते में ऑनलाइन भुगतान',
        'अनुकूलित मंडल वेबपेज:',
        '  मंडल इतिहास',
        '  भंडारा आमंत्रण',
        '  दैनिक ड्रेस कोड',
      ],
      cta: 'प्लॅटिनम चुनें',
    },
  },
};

const TIER_STYLES: Record<PlanTier, {
  bg: string;
  border: string;
  shadow: string;
  nameColor: string;
  priceColor: string;
  featureColor: string;
  ctaBg: string;
  ctaColor: string;
  ctaHoverBg: string;
}> = {
  silver: {
    bg: 'var(--color-paper-card)',
    border: '1px solid rgba(201, 162, 39, 0.2)',
    shadow: '0 12px 32px rgba(42, 30, 23, 0.08)',
    nameColor: 'var(--color-brass)',
    priceColor: 'var(--color-ink)',
    featureColor: 'var(--color-ink-soft)',
    ctaBg: 'rgba(201, 162, 39, 0.12)',
    ctaColor: 'var(--color-brass)',
    ctaHoverBg: 'var(--color-brass)',
  },
  gold: {
    bg: 'var(--color-paper-card)',
    border: '2px solid var(--color-marigold)',
    shadow: '0 16px 40px rgba(232, 149, 30, 0.15)',
    nameColor: 'var(--color-marigold)',
    priceColor: 'var(--color-ink)',
    featureColor: 'var(--color-ink-soft)',
    ctaBg: 'var(--color-marigold)',
    ctaColor: 'var(--color-paper)',
    ctaHoverBg: 'var(--color-marigold)',
  },
  platinum: {
    bg: 'linear-gradient(135deg, var(--color-sindoor) 0%, var(--color-sindoor-dark) 100%)',
    border: 'none',
    shadow: '0 20px 48px rgba(167, 54, 40, 0.35)',
    nameColor: 'var(--color-paper)',
    priceColor: 'var(--color-paper)',
    featureColor: 'rgba(247, 239, 221, 0.9)',
    ctaBg: 'var(--color-paper)',
    ctaColor: 'var(--color-sindoor)',
    ctaHoverBg: 'rgba(247, 239, 221, 0.2)',
  },
};

interface PlanData {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
}

export function PricingPlan({
  language = 'en',
  className = '',
  style,
  tier,
}: PricingPlanProps & { tier: PlanTier }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const planRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [priceRevealed, setPriceRevealed] = useState(false);
  const [featuresRevealed, setFeaturesRevealed] = useState(false);
  const [ctaRevealed, setCtaRevealed] = useState(false);

  const plan = PLANS[language][tier] as PlanData;
  const tierStyles = TIER_STYLES[tier];

  useEffect(() => {
    if (!planRef.current || prefersReducedMotion) {
      setIsVisible(true);
      setPriceRevealed(true);
      setFeaturesRevealed(true);
      setCtaRevealed(true);
      return;
    }

    const revealAll = () => {
      setIsVisible(true);
      setTimeout(() => setPriceRevealed(true), 150);
      setTimeout(() => setFeaturesRevealed(true), 350);
      setTimeout(() => setCtaRevealed(true), 550);
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            revealAll();
            observer.disconnect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(planRef.current);
      return () => observer.disconnect();
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: planRef.current,
        start: 'top 85%',
        onEnter: revealAll,
        once: true,
      });
    }, planRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const cardTransform = isVisible && isHovered
    ? 'translateY(-4px) scale(1.01)'
    : isVisible ? 'translateY(0)' : 'translateY(30px)';

  return (
    <div
      ref={planRef}
      className={`pricing-plan ${className}`}
      style={{
        position: 'relative',
        padding: '2.5rem 2rem',
        background: tierStyles.bg,
        borderRadius: '16px',
        border: tierStyles.border,
        boxShadow: tierStyles.shadow,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        opacity: isVisible ? 1 : 0,
        transform: cardTransform,
        transition: prefersReducedMotion
          ? 'opacity 0.3s ease, transform 0.3s ease'
          : 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease',
        transformOrigin: 'center bottom',
        willChange: 'transform, box-shadow',
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="plan-header"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: prefersReducedMotion ? 'opacity 0.3s ease, transform 0.3s ease' : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: tierStyles.nameColor,
          }}
        >
          {plan.name}
        </p>
      </div>

      <div
        className="plan-price"
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '0.25rem',
          opacity: priceRevealed ? 1 : 0,
          transform: priceRevealed ? 'scale(1)' : 'scale(0.9)',
          transition: prefersReducedMotion
            ? 'opacity 0.3s ease, transform 0.3s ease'
            : 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: 500,
            lineHeight: 1,
            color: tierStyles.priceColor,
          }}
        >
          ₹{plan.price}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            fontWeight: 400,
            color: tierStyles.featureColor,
            marginBottom: '0.5rem',
          }}
        >
          {plan.period}
        </span>
      </div>

      <ul
        className="plan-features"
        style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          padding: '0 0.5rem',
          opacity: featuresRevealed ? 1 : 0,
          transform: featuresRevealed ? 'translateY(0)' : 'translateY(16px)',
          transition: prefersReducedMotion
            ? 'opacity 0.3s ease, transform 0.3s ease'
            : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s',
        }}
      >
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            style={{
              display: 'flex',
              alignItems: idx === 0 ? 'flex-start' : 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: tierStyles.featureColor,
              opacity: 1,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                flexShrink: 0,
                color: tierStyles.nameColor,
                marginTop: idx === 0 && feature.includes('\n') ? '0.25rem' : 0,
              }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {tier === 'gold' || tier === 'platinum' ? (
        <p
          className="plan-note"
          style={{
            marginTop: '1rem',
            padding: '0.875rem 1rem',
            background: tier === 'platinum'
              ? 'rgba(247, 239, 221, 0.1)'
              : 'rgba(167, 54, 40, 0.06)',
            borderRadius: '8px',
            border: tier === 'platinum'
              ? '1px solid rgba(247, 239, 221, 0.15)'
              : '1px solid rgba(167, 54, 40, 0.15)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 400,
            lineHeight: 1.5,
            color: tierStyles.featureColor,
            opacity: featuresRevealed ? 1 : 0,
          }}
        >
          {tier === 'gold'
            ? (language === 'en'
                ? 'Online payments available with Gold and Platinum. Funds settle directly to the cashier\'s account.'
                : language === 'mr'
                ? 'गोल्ड आणि प्लॅटिनममध्ये ऑनलाइन पेमेंट उपलब्ध. रक्कम कॅशियरच्या खातेत येते.'
                : 'गोल्ड और प्लॅटिनम में ऑनलाइन भुगतान उपलब्ध। राशि कैशियर के खाते में जाती है।')
            : (language === 'en'
                ? 'Online payments available with Gold and Platinum. Funds settle directly to the cashier\'s account.'
                : language === 'mr'
                ? 'गोल्ड आणि प्लॅटिनममध्ये ऑनलाइन पेमेंट उपलब्ध. रक्कम कॅशियरच्या खातेत येते.'
                : 'गोल्ड और प्लॅटिनम में ऑनलाइन भुगतान उपलब्ध। राशि कैशियर के खाते में जाती है।')}
        </p>
      ) : null}

      <button
        className="plan-cta"
        style={{
          marginTop: '0.5rem',
          padding: '1rem 2rem',
          background: isHovered ? tierStyles.ctaHoverBg : tierStyles.ctaBg,
          color: isHovered ? (tier === 'platinum' ? 'var(--color-sindoor)' : 'var(--color-paper)') : tierStyles.ctaColor,
          border: tier === 'platinum' ? '1px solid rgba(247, 239, 221, 0.3)' : 'none',
          borderRadius: '8px',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
          fontWeight: 600,
          cursor: 'pointer',
          opacity: ctaRevealed ? 1 : 0,
          transform: ctaRevealed ? 'translateY(0)' : 'translateY(16px)',
          transition: prefersReducedMotion
            ? 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, color 0.2s ease'
            : 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s, background-color 0.2s ease, color 0.2s ease',
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = isHovered ? 'translateY(-4px) scale(1.01)' : 'scale(1)'; }}
      >
        {plan.cta}
      </button>

      <style>{`
        @media (max-width: 1024px) {
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
    </div>
  );
}

export type { PricingPlanProps };