import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { Language } from '../../types';

interface PricingPlanProps {
  language?: Language;
  className?: string;
  style?: React.CSSProperties;
  tier: PlanTier;
}

type PlanTier = 'silver' | 'gold' | 'platinum';

const PLAN_LINKS: Record<PlanTier, string> = {
  silver: 'https://our.epavtibook.com/register?plan=basic',
  gold: 'https://our.epavtibook.com/register?plan=standard',
  platinum: 'https://our.epavtibook.com/register?plan=premium',
};

const PLANS = {
  en: {
    silver: {
      name: 'Silver',
      price: '499',
      period: '/ season',
      features: [
        'Unlimited digital pavtis',
        'Up to 5 collectors',
        '1 active festival or drive',
        'PDF download & print',
      ],
      cta: 'Get Started',
    },
    gold: {
      name: 'Gold',
      price: '799',
      period: '/ season',
      features: [
        'Unlimited digital pavtis',
        'Up to 10 collectors',
        'Run 2 festivals at once',
        'Your branding on every pavti',
        'Dynamic UPI QR for instant collection',
        'Shareable payment link for unpaid pavtis',
        'Cinematic 4-slide pavti experience',
        'PDF download & print',
      ],
      cta: 'Get Started',
    },
    platinum: {
      name: 'Platinum',
      price: '1,999',
      period: '/ season',
      features: [
        'Unlimited digital pavtis',
        'Unlimited collectors',
        'Run up to 5 festivals at once',
        'Your branding on every pavti',
        'Dynamic UPI QR for instant collection',
        'Shareable payment link for unpaid pavtis',
        'Cinematic 4-slide pavti experience',
        'Full activity log',
      ],
      cta: 'Get Started',
    },
  },
  mr: {
    silver: {
      name: 'सिल्वर',
      price: '499',
      period: '/ हंगाम',
      features: [
        'अमर्याद डिजिटल पावती',
        '५ पर्यंत संग्राहक',
        '१ सक्रिय उत्सव किंवा मोहीम',
        'PDF डाउनलोड आणि प्रिंट',
      ],
      cta: 'सुरू करा',
    },
    gold: {
      name: 'गोल्ड',
      price: '799',
      period: '/ हंगाम',
      features: [
        'अमर्याद डिजिटल पावती',
        '१० पर्यंत संग्राहक',
        'एकाच वेळी २ उत्सव चालवा',
        'प्रत्येक पावतीवर तुमचे ब्रँडिंग',
        'त्वरित वर्गणीसाठी डायनॅमिक UPI QR',
        'थकीत पावतीसाठी शेअर करण्यायोग्य पेमेंट लिंक',
        'सिनेमॅटिक ४-स्लाइड पावती अनुभव',
        'PDF डाउनलोड आणि प्रिंट',
      ],
      cta: 'सुरू करा',
    },
    platinum: {
      name: 'प्लॅटिनम',
      price: '1,999',
      period: '/ हंगाम',
      features: [
        'अमर्याद डिजिटल पावती',
        'अमर्याद संग्राहक',
        'एकाच वेळी ५ उत्सवांपर्यंत चालवा',
        'प्रत्येक पावतीवर तुमचे ब्रँडिंग',
        'त्वरित वर्गणीसाठी डायनॅमिक UPI QR',
        'थकीत पावतीसाठी शेअर करण्यायोग्य पेमेंट लिंक',
        'सिनेमॅटिक ४-स्लाइड पावती अनुभव',
        'संपूर्ण अ‍ॅक्टिव्हिटी लॉग',
      ],
      cta: 'सुरू करा',
    },
  },
  hi: {
    silver: {
      name: 'सिल्वर',
      price: '499',
      period: '/ सीजन',
      features: [
        'असीमित डिजिटल पावती',
        '५ तक संग्रहकर्ता',
        '१ सक्रिय उत्सव या अभियान',
        'PDF डाउनलोड और प्रिंट',
      ],
      cta: 'शुरू करें',
    },
    gold: {
      name: 'गोल्ड',
      price: '799',
      period: '/ सीजन',
      features: [
        'असीमित डिजिटल पावती',
        '१० तक संग्रहकर्ता',
        'एक साथ २ उत्सव चलाएं',
        'हर पावती पर आपकी ब्रांडिंग',
        'तत्काल संग्रह के लिए डायनामिक UPI QR',
        'बकाया पावती के लिए शेयर करने योग्य भुगतान लिंक',
        'सिनेमैटिक ४-स्लाइड पावती अनुभव',
        'PDF डाउनलोड और प्रिंट',
      ],
      cta: 'शुरू करें',
    },
    platinum: {
      name: 'प्लॅटिनम',
      price: '1,999',
      period: '/ सीजन',
      features: [
        'असीमित डिजिटल पावती',
        'असीमित संग्रहकर्ता',
        'एक साथ ५ उत्सवों तक चलाएं',
        'हर पावती पर आपकी ब्रांडिंग',
        'तत्काल संग्रह के लिए डायनामिक UPI QR',
        'बकाया पावती के लिए शेयर करने योग्य भुगतान लिंक',
        'सिनेमैटिक ४-स्लाइड पावती अनुभव',
        'पूरा एक्टिविटी लॉग',
      ],
      cta: 'शुरू करें',
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
              alignItems: 'flex-start',
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
                marginTop: '0.2rem',
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
          {language === 'en'
            ? 'Online payments available with Gold and Platinum. Funds settle directly to the cashier\'s account.'
            : language === 'mr'
            ? 'गोल्ड आणि प्लॅटिनममध्ये ऑनलाइन पेमेंट उपलब्ध. रक्कम कॅशियरच्या खातेत येते.'
            : 'गोल्ड और प्लॅटिनम में ऑनलाइन भुगतान उपलब्ध। राशि कैशियर के खाते में जाती है।'}
        </p>
      ) : null}

      <a
        id={`plan-cta-${tier}`}
        href={PLAN_LINKS[tier]}
        className="plan-cta"
        aria-label={
          language === 'en'
            ? `Get started with ${plan.name}`
            : language === 'mr'
            ? `${plan.name} सह सुरू करा`
            : `${plan.name} के साथ शुरू करें`
        }
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          textAlign: 'center',
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
      </a>
    </div>
  );
}

export { PLAN_LINKS };
export type { PricingPlanProps, PlanTier };
