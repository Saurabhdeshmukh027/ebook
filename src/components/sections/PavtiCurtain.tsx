import { useEffect, useState } from 'react';
import type { Language } from '../../types';

interface PavtiCurtainProps {
  language?: Language;
  onOpen: () => void;
  onNext: () => void;
  opened: boolean;
}

const CURTAIN_CONTENT = {
  en: {
    tapHint: 'TOUCH TO OPEN',
    fest: '🪔 Shubh Navratrotsav 🪔',
    mandalName: 'Shivray Durga Utsav Mandal',
    nextBtn: 'View Darshan →',
  },
  mr: {
    tapHint: 'उघडण्यासाठी स्पर्श करा',
    fest: '🪔 शुभ नवरात्रोत्सव 🪔',
    mandalName: 'शिवराय दुर्गा उत्सव मंडळ',
    nextBtn: 'दर्शन पहा →',
  },
  hi: {
    tapHint: 'खोलने के लिए स्पर्श करें',
    fest: '🪔 शुभ नवरात्रोत्सव 🪔',
    mandalName: 'शिवराय दुर्गा उत्सव मंडल',
    nextBtn: 'दर्शन देखें →',
  },
};

/** Marigold toran SVG at the top */
function ToranSVG() {
  return (
    <svg className="pavti-toran" viewBox="0 0 400 64" aria-hidden="true" style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto', zIndex: 3,
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.45))', pointerEvents: 'none',
    }}>
      <defs>
        <linearGradient id="gRodW" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fce8a9" />
          <stop offset="1" stopColor="#a8801d" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="4" fill="url(#gRodW)" />
      {/* Garland curves */}
      <path d="M0 4 Q50 58 100 4" fill="none" stroke="#d4af37" strokeWidth="1" />
      <path d="M100 4 Q150 58 200 4" fill="none" stroke="#d4af37" strokeWidth="1" />
      <path d="M200 4 Q250 58 300 4" fill="none" stroke="#d4af37" strokeWidth="1" />
      <path d="M300 4 Q350 58 400 4" fill="none" stroke="#d4af37" strokeWidth="1" />
      {/* Vertical strings */}
      <line x1="0" y1="4" x2="0" y2="22" stroke="#d4af37" strokeWidth="1" />
      <line x1="100" y1="4" x2="100" y2="34" stroke="#d4af37" strokeWidth="1" />
      <line x1="200" y1="4" x2="200" y2="48" stroke="#d4af37" strokeWidth="1" />
      <line x1="300" y1="4" x2="300" y2="34" stroke="#d4af37" strokeWidth="1" />
      <line x1="400" y1="4" x2="400" y2="22" stroke="#d4af37" strokeWidth="1" />
      {/* Simplified marigold flowers along the garland */}
      {[0, 100, 200, 300, 400].map((cx) => {
        const offsets = cx === 0 || cx === 400 ? [9] : cx === 200 ? [9, 16, 24, 31, 38, 45] : [9, 16, 24, 31];
        return offsets.map((cy, j) => (
          <g key={`${cx}-${j}`}>
            <circle cx={cx} cy={cy} r={4 - j * 0.15} fill={j % 2 === 0 ? '#f77f00' : '#ffb703'} />
            <circle cx={cx} cy={cy} r={2.5 - j * 0.1} fill={j % 2 === 0 ? '#ffb703' : '#f77f00'} />
          </g>
        ));
      })}
      {/* Leaf shapes along each garland arc */}
      {[0, 1, 2, 3].map((arcIdx) => {
        const startX = arcIdx * 100;
        return Array.from({ length: 11 }, (_, i) => {
          const t = (i + 0.5) / 11;
          const cx = startX + t * 100;
          const cy = 4 + Math.sin(t * Math.PI) * 54;
          const angle = i % 2 === 0 ? 22 : -22;
          return (
            <ellipse
              key={`leaf-${arcIdx}-${i}`}
              cx={cx} cy={cy} rx={2.3} ry={6}
              fill="#1f7a4d"
              transform={`rotate(${angle} ${cx} ${cy})`}
            />
          );
        });
      })}
    </svg>
  );
}

/** Sparkle elements */
function Sparks() {
  const sparks = [
    { x: '12%', y: '24%', d: '0s' },
    { x: '86%', y: '30%', d: '.8s' },
    { x: '20%', y: '58%', d: '1.6s' },
    { x: '80%', y: '64%', d: '2.2s' },
    { x: '8%', y: '82%', d: '.4s' },
    { x: '90%', y: '88%', d: '1.2s' },
    { x: '34%', y: '18%', d: '2.6s' },
    { x: '68%', y: '14%', d: '1.9s' },
  ];
  return (
    <>
      {sparks.map((s, i) => (
        <i key={i} className="pavti-spark" style={{
          position: 'absolute',
          left: s.x,
          top: s.y,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#fce8a9',
          boxShadow: '0 0 8px 2px rgba(252,232,169,0.8)',
          opacity: 0,
          animation: `pavtiTwinkle 3.4s ease-in-out infinite ${s.d}`,
        }} />
      ))}
    </>
  );
}

/** Rotating halo SVG for the mandal logo */
function HaloSVG() {
  return (
    <svg className="pavti-halo" viewBox="0 0 200 200" aria-hidden="true" style={{
      position: 'absolute', left: '50%', top: '50%', width: '132%', aspectRatio: '1',
      transform: 'translate(-50%, -50%)', overflow: 'visible', pointerEvents: 'none',
    }}>
      <defs>
        <radialGradient id="gHaloW">
          <stop offset=".62" stopColor="#ffb703" stopOpacity="0" />
          <stop offset="1" stopColor="#ffb703" stopOpacity=".18" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="99" fill="url(#gHaloW)" />
      {/* Outer ring of petals */}
      <g className="pavti-ringB">
        {Array.from({ length: 16 }, (_, i) => (
          <path
            key={`b-${i}`}
            transform={`rotate(${i * 22.5} 100 100)`}
            d="M100 36 C113 25 112 12 100 2 C88 12 87 25 100 36Z"
            fill="rgba(212,175,55,.16)"
            stroke="#fce8a9"
            strokeWidth=".8"
          />
        ))}
        {/* Dots around the circle */}
        {Array.from({ length: 48 }, (_, i) => {
          const angle = (i / 48) * Math.PI * 2 - Math.PI / 2;
          const cx = 100 + 98.6 * Math.cos(angle);
          const cy = 100 + 98.6 * Math.sin(angle);
          return <circle key={`d-${i}`} cx={cx.toFixed(1)} cy={cy.toFixed(1)} r=".8" fill="#fce8a9" />;
        })}
      </g>
      {/* Inner ring of petals */}
      <g className="pavti-ringA">
        {Array.from({ length: 16 }, (_, i) => (
          <path
            key={`a-${i}`}
            transform={`rotate(${11.25 + i * 22.5} 100 100)`}
            d="M100 40 C108 32 107 22 100 14 C93 22 92 32 100 40Z"
            fill="rgba(247,127,0,.30)"
            stroke="#e9c15a"
            strokeWidth=".7"
          />
        ))}
      </g>
    </svg>
  );
}

export function PavtiCurtain({ language = 'en', onOpen, onNext, opened }: PavtiCurtainProps) {
  const content = CURTAIN_CONTENT[language];
  const [revealVisible, setRevealVisible] = useState(false);

  useEffect(() => {
    if (opened) {
      const timer = setTimeout(() => setRevealVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setRevealVisible(false);
    }
  }, [opened]);

  const handleCurtainClick = () => {
    if (!opened) {
      onOpen();
    }
  };

  const ribCount = 12;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#3d0c14',
      overflow: 'hidden',
    }}>
      {/* Stage behind curtain */}
      <div className="pavti-stage" style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(16vw + 10px) 24px 28px',
        overflow: 'hidden',
        textAlign: 'center',
        zIndex: 10,
        background: `
          radial-gradient(circle at 50% 46%, rgba(212,175,55,0.30), transparent 52%),
          radial-gradient(circle at 50% 112%, rgba(255,122,24,0.34), transparent 55%),
          linear-gradient(180deg, #2a0710 0%, #4a0f1a 48%, #1f0508 100%)
        `,
        fontFamily: "'Mukta', 'Noto Sans Devanagari', -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}>
        <ToranSVG />
        <Sparks />

        {/* Reveal content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(12px, 2.4vh, 22px)',
          opacity: revealVisible ? 1 : 0,
          transform: revealVisible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(16px)',
          transition: 'opacity 1.6s ease, transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <p style={{
            fontFamily: "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif",
            fontWeight: 400,
            fontSize: 'clamp(1.1rem, 5vw, 1.5rem)',
            lineHeight: 1.2,
            color: '#fce8a9',
            textShadow: '0 0 18px rgba(255,170,40,0.55)',
            margin: 0,
          }}>
            {content.fest}
          </p>

          {/* Mandal logo */}
          <div style={{
            position: 'relative',
            width: 'min(52vw, 35vh, 200px)',
            margin: 'calc(min(52vw, 35vh, 200px) * 0.15) 0',
          }}>
            <HaloSVG />
            <div style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              aspectRatio: '1',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#000',
              boxShadow: '0 0 0 2px rgba(252,232,169,0.35), 0 0 40px rgba(255,170,40,0.45), 0 0 90px rgba(212,175,55,0.25)',
            }}>
              <img
                src="/images/pavti/img0.jpeg"
                alt="Mandal Logo"
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                loading="eager"
              />
            </div>
          </div>

          <p style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#ded5c2',
            margin: 0,
          }}>
            {content.mandalName}
          </p>

          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            style={{
              marginTop: 'clamp(2px, 1vh, 8px)',
              padding: '11px 28px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#3d0c14',
              background: 'linear-gradient(135deg, #f6de8d, #d4af37 55%, #a8801d)',
              border: '1px solid #fce8a9',
              borderRadius: '99px',
              cursor: 'pointer',
              boxShadow: '0 6px 22px rgba(212,175,55,0.35), 0 0 0 4px rgba(212,175,55,0.12)',
            }}
          >
            {content.nextBtn}
          </button>
        </div>
      </div>

      {/* Curtain Viewport */}
      <div
        className={`pavti-curtain-viewport${opened ? ' pavti-curtain-opened' : ''}`}
        onClick={handleCurtainClick}
        onTouchStart={handleCurtainClick}
        role="button"
        tabIndex={0}
        aria-label="Open curtain"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCurtainClick(); }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          overflow: 'hidden',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          cursor: opened ? 'default' : 'pointer',
          background: opened ? 'transparent' : '#031009',
          pointerEvents: opened ? 'none' : 'auto',
        }}
      >
        {/* Left curtain */}
        <div className="pavti-curtain-half pavti-curtain-left" style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '50.5%',
          display: 'flex',
          transition: 'transform 4.2s cubic-bezier(0.45, 0, 0.2, 1)',
          transformOrigin: 'left center',
          transform: opened ? 'translateX(-68%) scaleX(0.4) skewY(-2.5deg)' : 'none',
        }}>
          {Array.from({ length: ribCount }, (_, i) => (
            <div key={`l-${i}`} className="pavti-velvet-rib" style={{
              flex: 1,
              height: '100%',
              position: 'relative',
              background: `
                repeating-linear-gradient(to right, rgba(255,230,150,0.12) 0px, rgba(255,230,150,0.12) 1px, transparent 1px, transparent 12px),
                linear-gradient(90deg, #020b06 0%, #072418 20%, #0e422c 50%, #16583d 62%, #0b3824 80%, #031009 100%)
              `,
              boxShadow: '-4px 0 10px rgba(0,0,0,0.65)',
              transition: 'transform 4.2s cubic-bezier(0.45, 0, 0.2, 1)',
              transformOrigin: 'center center',
              transform: opened ? 'rotateY(-36deg) scaleZ(1.3)' : 'none',
            }}>
              {/* Darkening overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#000',
                opacity: opened ? 0.3 : 0,
                pointerEvents: 'none',
                transition: 'opacity 4.2s cubic-bezier(0.45, 0, 0.2, 1)',
              }} />
              {/* Gold border on last rib */}
              {i === ribCount - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: '5px',
                  background: 'repeating-linear-gradient(180deg, #fce8a9 0px, #d4af37 8px, #785b14 16px, #d4af37 24px)',
                  boxShadow: '0 0 10px rgba(212,175,55,0.4)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Right curtain */}
        <div className="pavti-curtain-half pavti-curtain-right" style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '50.5%',
          display: 'flex',
          flexDirection: 'row-reverse',
          transition: 'transform 4.2s cubic-bezier(0.45, 0, 0.2, 1)',
          transformOrigin: 'right center',
          transform: opened ? 'translateX(68%) scaleX(0.4) skewY(2.5deg)' : 'none',
        }}>
          {Array.from({ length: ribCount }, (_, i) => (
            <div key={`r-${i}`} className="pavti-velvet-rib" style={{
              flex: 1,
              height: '100%',
              position: 'relative',
              background: `
                repeating-linear-gradient(to right, rgba(255,230,150,0.12) 0px, rgba(255,230,150,0.12) 1px, transparent 1px, transparent 12px),
                linear-gradient(90deg, #020b06 0%, #072418 20%, #0e422c 50%, #16583d 62%, #0b3824 80%, #031009 100%)
              `,
              boxShadow: '-4px 0 10px rgba(0,0,0,0.65)',
              transition: 'transform 4.2s cubic-bezier(0.45, 0, 0.2, 1)',
              transformOrigin: 'center center',
              transform: opened ? 'rotateY(36deg) scaleZ(1.3)' : 'none',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#000',
                opacity: opened ? 0.3 : 0,
                pointerEvents: 'none',
                transition: 'opacity 4.2s cubic-bezier(0.45, 0, 0.2, 1)',
              }} />
              {i === ribCount - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: '5px',
                  background: 'repeating-linear-gradient(180deg, #fce8a9 0px, #d4af37 8px, #785b14 16px, #d4af37 24px)',
                  boxShadow: '0 0 10px rgba(212,175,55,0.4)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Tap hint */}
        {!opened && (
          <div className="pavti-tap-hint" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 60,
            background: 'rgba(3, 17, 10, 0.82)',
            border: '1px solid rgba(212, 175, 55, 0.7)',
            boxShadow: '0 0 25px rgba(212, 175, 55, 0.25)',
            padding: '12px 24px',
            borderRadius: '99px',
            color: '#fce8a9',
            fontSize: '0.7rem',
            letterSpacing: '2.5px',
            pointerEvents: 'none',
            animation: 'pavtiPulse 2.4s infinite ease-in-out',
            whiteSpace: 'nowrap',
          }}>
            {content.tapHint}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pavtiTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes pavtiPulse {
          0%, 100% { opacity: 0.95; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.04); }
        }
        .pavti-ringA { transform-origin: 100px 100px; animation: pavtiSpin 80s linear infinite reverse; }
        .pavti-ringB { transform-origin: 100px 100px; animation: pavtiSpin 120s linear infinite; }
        @keyframes pavtiSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .pavti-ringA, .pavti-ringB, .pavti-spark { animation: none !important; }
          .pavti-spark { opacity: 0.8 !important; }
          .pavti-tap-hint { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
