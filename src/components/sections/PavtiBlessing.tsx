import type { Language } from '../../types';

interface PavtiBlessingProps {
  language?: Language;
  onRestart: () => void;
}

const BLESSING_CONTENT = {
  en: {
    title: 'Blessings',
    thanks: '<b>Shri. Ramesh Patil</b>,<br/>Thank you from the bottom of our hearts for your generous donation!',
    text1: "May the grace of Maa Jagdamba always remain upon you and your family. May your home be blessed with happiness, prosperity, health and peace.",
    text2: 'Your support will make this Navratrotsav even more auspicious.',
    close: 'Jai Bhavani! Jai Shivray!',
    from: 'Shivray Durga Utsav Mandal',
    english: 'Thank you for your generous donation. May Maa Durga bless you and your family with health, happiness and prosperity.',
    restart: '↺ Experience Again',
  },
  mr: {
    title: 'आशीर्वाद',
    thanks: '<b>श्री. रमेश पाटील</b>,<br/>आपण दिलेल्या देणगीबद्दल मनःपूर्वक धन्यवाद!',
    text1: 'आई जगदंबेची कृपादृष्टी आपल्यावर व आपल्या कुटुंबावर सदैव राहो. आपल्या घरात सुख, समृद्धी, आरोग्य आणि शांती नांदो.',
    text2: 'आपल्या सहकार्यामुळे हा नवरात्रोत्सव अधिक मंगलमय होईल.',
    close: 'जय भवानी! जय शिवराय!',
    from: 'शिवराय दुर्गा उत्सव मंडळ',
    english: 'Thank you for your generous donation. May Maa Durga bless you and your family with health, happiness and prosperity.',
    restart: '↺ पुन्हा अनुभवा',
  },
  hi: {
    title: 'आशीर्वाद',
    thanks: '<b>श्री. रमेश पाटील</b>,<br/>आपके उदार दान के लिए हार्दिक धन्यवाद!',
    text1: 'माँ जगदंबा की कृपादृष्टि आप पर और आपके परिवार पर सदैव बनी रहे। आपके घर में सुख, समृद्धि, स्वास्थ्य और शांति बनी रहे।',
    text2: 'आपके सहयोग से यह नवरात्रोत्सव और भी मंगलमय होगा।',
    close: 'जय भवानी! जय शिवराय!',
    from: 'शिवराय दुर्गा उत्सव मंडल',
    english: 'Thank you for your generous donation. May Maa Durga bless you and your family with health, happiness and prosperity.',
    restart: '↺ फिर से अनुभव करें',
  },
};

export function PavtiBlessing({ language = 'en', onRestart }: PavtiBlessingProps) {
  const content = BLESSING_CONTENT[language];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 26px',
      background: `
        radial-gradient(circle at 50% 0%, rgba(212,175,55,0.14), transparent 50%),
        linear-gradient(180deg, #062114 0%, #08160f 100%)
      `,
      fontFamily: "'Mukta', 'Noto Sans Devanagari', -apple-system, 'Segoe UI', Roboto, sans-serif",
      overflow: 'auto',
    }}>
      {/* Corner motifs */}
      {[
        { top: '18px', left: '18px', borderRight: 'none', borderBottom: 'none', borderTopLeftRadius: '10px' },
        { top: '18px', right: '18px', borderLeft: 'none', borderBottom: 'none', borderTopRightRadius: '10px' },
        { bottom: '18px', left: '18px', borderRight: 'none', borderTop: 'none', borderBottomLeftRadius: '10px' },
        { bottom: '18px', right: '18px', borderLeft: 'none', borderTop: 'none', borderBottomRightRadius: '10px' },
      ].map((s, i) => (
        <span key={i} style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          border: '1.5px solid rgba(212,175,55,0.4)',
          opacity: 0.7,
          ...s,
        } as React.CSSProperties} />
      ))}

      {/* Blessing content */}
      <div style={{
        width: 'min(100%, 280px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Title */}
        <h3 style={{
          fontFamily: "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif",
          fontWeight: 400,
          fontSize: 'clamp(2rem, 9vw, 2.6rem)',
          lineHeight: 1.15,
          color: '#fce8a9',
          margin: 0,
        }}>
          {content.title}
        </h3>

        {/* Decorative rule */}
        <div style={{
          width: '56px',
          height: '1px',
          margin: 'clamp(10px, 2vh, 16px) auto',
          background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
        }} />

        {/* Thanks */}
        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.7,
            color: '#f6f2e9',
            margin: 0,
          }}
          dangerouslySetInnerHTML={{ __html: content.thanks }}
        />

        {/* Blessing text */}
        <p style={{
          marginTop: 'clamp(7px, 1.4vh, 12px)',
          fontSize: '0.9rem',
          lineHeight: 1.85,
          color: '#ded5c2',
          margin: 'clamp(7px, 1.4vh, 12px) 0 0',
          textWrap: 'balance',
        }}>
          {content.text1}
        </p>

        <p style={{
          marginTop: 'clamp(5px, 1vh, 8px)',
          fontSize: '0.9rem',
          lineHeight: 1.85,
          color: '#ded5c2',
          margin: 'clamp(5px, 1vh, 8px) 0 0',
          textWrap: 'balance',
        }}>
          {content.text2}
        </p>

        {/* Closing */}
        <p style={{
          marginTop: 'clamp(12px, 2.2vh, 20px)',
          fontFamily: "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif",
          fontSize: '1.3rem',
          color: '#d4af37',
          margin: 'clamp(12px, 2.2vh, 20px) 0 0',
        }}>
          {content.close}
        </p>

        {/* From */}
        <p style={{
          marginTop: '4px',
          fontSize: '0.8rem',
          color: 'rgba(222,213,194,0.75)',
          margin: '4px 0 0',
        }}>
          {content.from}
        </p>

        {/* English line */}
        <p style={{
          maxWidth: '240px',
          marginTop: 'clamp(10px, 1.8vh, 16px)',
          fontSize: '0.7rem',
          lineHeight: 1.55,
          color: 'rgba(222,213,194,0.5)',
          margin: 'clamp(10px, 1.8vh, 16px) 0 0',
          textWrap: 'balance',
        }}>
          {content.english}
        </p>

        {/* Restart button */}
        <button
          onClick={onRestart}
          style={{
            marginTop: 'clamp(14px, 2.4vh, 22px)',
            padding: '8px 20px',
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#fce8a9',
            background: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '99px',
            cursor: 'pointer',
          }}
        >
          {content.restart}
        </button>
      </div>
    </div>
  );
}
