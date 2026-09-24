import type { Language } from '../../types';

interface PavtiDarshanProps {
  language?: Language;
  onNext: () => void;
}

const DARSHAN_CONTENT = {
  en: {
    jaiLine: '॥ Jai Maa Jagdamba ॥',
    subText: 'Shivray Durga Utsav Mandal welcomes you',
    swipeHint: 'View Donation Pavti',
  },
  mr: {
    jaiLine: '॥ जय माँ जगदंबा ॥',
    subText: 'शिवराय दुर्गा उत्सव मंडळ आपले स्वागत करते',
    swipeHint: 'देणगी पावती पहा',
  },
  hi: {
    jaiLine: '॥ जय माँ जगदंबा ॥',
    subText: 'शिवराय दुर्गा उत्सव मंडल आपका स्वागत करता है',
    swipeHint: 'दान पावती देखें',
  },
};

export function PavtiDarshan({ language = 'en', onNext }: PavtiDarshanProps) {
  const content = DARSHAN_CONTENT[language];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'clamp(12px, 2.4vh, 22px)',
      padding: '28px 24px',
      background: `
        radial-gradient(circle at 50% 38%, rgba(212,175,55,0.20), transparent 56%),
        radial-gradient(circle at 50% 108%, rgba(255,122,24,0.28), transparent 55%),
        linear-gradient(180deg, #2a0710 0%, #3d0c14 55%, #1f0508 100%)
      `,
      fontFamily: "'Mukta', 'Noto Sans Devanagari', -apple-system, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Jai line */}
      <p style={{
        fontFamily: "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif",
        fontWeight: 400,
        fontSize: 'clamp(1.2rem, 5vw, 1.6rem)',
        lineHeight: 1.3,
        textAlign: 'center',
        color: '#fce8a9',
        textShadow: '0 0 18px rgba(255,170,40,0.45)',
        margin: 0,
      }}>
        {content.jaiLine}
      </p>

      {/* Darshan photo frame */}
      <div style={{
        width: 'calc(min(65vw, 42vh, 260px) + 12px)',
        padding: '6px',
        borderRadius: 'calc(min(65vw, 42vh, 260px) / 2 + 6px) calc(min(65vw, 42vh, 260px) / 2 + 6px) 18px 18px',
        background: 'linear-gradient(160deg, #fce8a9, #d4af37 45%, #785b14 75%, #d4af37)',
        boxShadow: '0 0 0 1px rgba(252,232,169,0.35), 0 0 60px rgba(212,175,55,0.28), 0 26px 50px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          width: '100%',
          aspectRatio: '1082 / 1397',
          overflow: 'hidden',
          border: '2px solid #3d0c14',
          borderRadius: 'calc(min(65vw, 42vh, 260px) / 2) calc(min(65vw, 42vh, 260px) / 2) 12px 12px',
          background: '#000',
        }}>
          <img
            src="/images/pavti/img1.jpeg"
            alt="Maa Durga Darshan"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            loading="eager"
          />
        </div>
      </div>

      {/* Sub text */}
      <p style={{
        fontFamily: "'Mukta', 'Noto Sans Devanagari', -apple-system, sans-serif",
        fontSize: '0.85rem',
        textAlign: 'center',
        color: '#ded5c2',
        margin: 0,
      }}>
        {content.subText}
      </p>

      {/* Next button */}
      <button
        onClick={onNext}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Mukta', 'Noto Sans Devanagari', -apple-system, sans-serif",
          fontSize: '0.85rem',
          color: 'rgba(246,242,233,0.62)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 16px',
        }}
      >
        {content.swipeHint}
        <span style={{
          display: 'block',
          width: '9px',
          height: '9px',
          borderRight: '1.5px solid rgba(212,175,55,0.75)',
          borderBottom: '1.5px solid rgba(212,175,55,0.75)',
          transform: 'rotate(45deg)',
        }} />
      </button>
    </div>
  );
}
