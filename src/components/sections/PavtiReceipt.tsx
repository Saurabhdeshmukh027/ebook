import type { Language } from '../../types';

interface PavtiReceiptProps {
  language?: Language;
  onNext: () => void;
}

/** Demo receipt data — source of truth from the supplied HTML */
const PAVTI_DATA = {
  no: '0001',
  date: '21/09/2026',
  name: 'श्री. रमेश पाटील',
  amount: 501,
  words: 'पाचशे एक फक्त',
  mode: 'रोख',
  by: 'सचिव',
  mandal: 'शिवराय दुर्गा उत्सव मंडळ',
};

const RECEIPT_LABELS = {
  en: {
    jaiLine: '॥ Jai Bhavani ॥ Jai Shivray ॥',
    donationPavti: 'Donation Pavti',
    pavtiNo: 'Pavti No.',
    date: 'Date',
    donorName: 'Donor Name',
    donationAmount: 'Donation Amount',
    amountInWords: 'Amount in Words',
    paymentMode: 'Payment Mode',
    receivedBy: 'Received By',
    sealText: 'Donation\nAccepted',
    signLine: 'President / Secretary',
    viewBlessing: 'View Blessing →',
  },
  mr: {
    jaiLine: '॥ जय भवानी ॥ जय शिवराय ॥',
    donationPavti: 'देणगी पावती',
    pavtiNo: 'पावती क्र.',
    date: 'दिनांक',
    donorName: 'देणगीदाराचे नाव',
    donationAmount: 'देणगी रक्कम',
    amountInWords: 'अक्षरी रुपये',
    paymentMode: 'भरणा पद्धत',
    receivedBy: 'स्वीकारणारा',
    sealText: 'देणगी\nस्वीकृत',
    signLine: 'अध्यक्ष / सचिव',
    viewBlessing: 'आशीर्वाद पहा →',
  },
  hi: {
    jaiLine: '॥ जय भवानी ॥ जय शिवराय ॥',
    donationPavti: 'दान रसीद',
    pavtiNo: 'रसीद क्र.',
    date: 'दिनांक',
    donorName: 'दाता का नाम',
    donationAmount: 'दान राशि',
    amountInWords: 'अक्षरी रुपये',
    paymentMode: 'भुगतान माध्यम',
    receivedBy: 'स्वीकारकर्ता',
    sealText: 'दान\nस्वीकृत',
    signLine: 'अध्यक्ष / सचिव',
    viewBlessing: 'आशीर्वाद देखें →',
  },
};

const TRANSLATED_NAMES = {
  en: 'Shri. Ramesh Patil',
  mr: 'श्री. रमेश पाटील',
  hi: 'श्री. रमेश पाटील',
};

const TRANSLATED_WORDS = {
  en: 'Five hundred one only',
  mr: 'पाचशे एक फक्त',
  hi: 'पाँच सौ एक मात्र',
};

const TRANSLATED_MODE = {
  en: 'Cash',
  mr: 'रोख',
  hi: 'नकद',
};

const TRANSLATED_BY = {
  en: 'Secretary',
  mr: 'सचिव',
  hi: 'सचिव',
};

export function PavtiReceipt({ language = 'en', onNext }: PavtiReceiptProps) {
  const labels = RECEIPT_LABELS[language];
  const formattedAmount = `₹ ${PAVTI_DATA.amount.toLocaleString('en-IN')}/-`;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 20px',
      background: `
        radial-gradient(circle at 50% 0%, rgba(212,175,55,0.16), transparent 55%),
        linear-gradient(180deg, #3d0c14 0%, #230508 100%)
      `,
      fontFamily: "'Mukta', 'Noto Sans Devanagari', -apple-system, 'Segoe UI', Roboto, sans-serif",
      overflow: 'auto',
    }}>
      {/* Receipt card */}
      <article style={{
        position: 'relative',
        width: 'min(100%, 320px)',
        background: '#f6f2e9',
        color: '#2a1810',
        borderRadius: '6px',
        padding: 'clamp(14px, 2.4vh, 20px) 18px clamp(12px, 2vh, 18px)',
        boxShadow: '0 0 0 1px rgba(212,175,55,0.5), 0 26px 60px rgba(0,0,0,0.55)',
      }}>
        {/* Inner border */}
        <div style={{
          position: 'absolute',
          inset: '5px',
          border: '1px solid rgba(92,15,30,0.35)',
          borderRadius: '3px',
          pointerEvents: 'none',
        }} />

        {/* Jai line */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#5c0f1e',
          margin: '0 0 8px',
        }}>
          {labels.jaiLine}
        </p>

        {/* Brand header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px',
          paddingBottom: '10px',
          borderBottom: '1.5px solid #5c0f1e',
        }}>
          <img
            src="/images/pavti/img2.jpeg"
            alt="Mandal Mark"
            style={{
              width: '46px',
              height: '48px',
              flexShrink: 0,
              objectFit: 'cover',
              borderRadius: '50%',
              background: '#000',
            }}
            loading="eager"
          />
          <div>
            <p style={{
              fontFamily: "'Tiro Devanagari Marathi', 'Noto Serif Devanagari', serif",
              fontWeight: 400,
              fontSize: '1.05rem',
              lineHeight: 1.25,
              color: '#5c0f1e',
              margin: 0,
            }}>
              {PAVTI_DATA.mandal}
            </p>
            <p style={{
              marginTop: '2px',
              fontSize: '0.85rem',
              fontWeight: 600,
              margin: 0,
            }}>
              {labels.donationPavti}
            </p>
          </div>
        </div>

        {/* Receipt rows */}
        <dl style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(7px, 1.3vh, 10px)',
          margin: 0,
        }}>
          {/* Pavti No & Date — two column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <dt style={{ fontSize: '0.68rem', lineHeight: 1.2, color: 'rgba(42,24,16,0.62)', margin: 0 }}>
                {labels.pavtiNo}
              </dt>
              <dd style={{
                minHeight: '1.4em',
                paddingBottom: '2px',
                fontSize: '0.95rem',
                fontWeight: 600,
                lineHeight: 1.35,
                borderBottom: '1px dotted rgba(92,15,30,0.4)',
                margin: 0,
              }}>
                {PAVTI_DATA.no}
              </dd>
            </div>
            <div>
              <dt style={{ fontSize: '0.68rem', lineHeight: 1.2, color: 'rgba(42,24,16,0.62)', margin: 0 }}>
                {labels.date}
              </dt>
              <dd style={{
                minHeight: '1.4em',
                paddingBottom: '2px',
                fontSize: '0.95rem',
                fontWeight: 600,
                lineHeight: 1.35,
                borderBottom: '1px dotted rgba(92,15,30,0.4)',
                margin: 0,
              }}>
                {PAVTI_DATA.date}
              </dd>
            </div>
          </div>

          {/* Donor Name */}
          <div>
            <dt style={{ fontSize: '0.68rem', lineHeight: 1.2, color: 'rgba(42,24,16,0.62)', margin: 0 }}>
              {labels.donorName}
            </dt>
            <dd style={{
              minHeight: '1.4em',
              paddingBottom: '2px',
              fontSize: '0.95rem',
              fontWeight: 600,
              lineHeight: 1.35,
              borderBottom: '1px dotted rgba(92,15,30,0.4)',
              margin: 0,
            }}>
              {TRANSLATED_NAMES[language]}
            </dd>
          </div>

          {/* Amount — highlighted */}
          <div style={{
            padding: '7px 9px',
            background: 'rgba(212,175,55,0.16)',
            borderLeft: '3px solid #d4af37',
            borderRadius: '2px',
          }}>
            <dt style={{ fontSize: '0.68rem', lineHeight: 1.2, color: 'rgba(42,24,16,0.62)', margin: 0 }}>
              {labels.donationAmount}
            </dt>
            <dd style={{
              fontSize: '1.7rem',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#5c0f1e',
              margin: 0,
            }}>
              {formattedAmount}
            </dd>
          </div>

          {/* Amount in words */}
          <div>
            <dt style={{ fontSize: '0.68rem', lineHeight: 1.2, color: 'rgba(42,24,16,0.62)', margin: 0 }}>
              {labels.amountInWords}
            </dt>
            <dd style={{
              minHeight: '1.4em',
              paddingBottom: '2px',
              fontSize: '0.95rem',
              fontWeight: 600,
              lineHeight: 1.35,
              borderBottom: '1px dotted rgba(92,15,30,0.4)',
              margin: 0,
            }}>
              {TRANSLATED_WORDS[language]}
            </dd>
          </div>

          {/* Payment mode & received by — two column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <dt style={{ fontSize: '0.68rem', lineHeight: 1.2, color: 'rgba(42,24,16,0.62)', margin: 0 }}>
                {labels.paymentMode}
              </dt>
              <dd style={{
                minHeight: '1.4em',
                paddingBottom: '2px',
                fontSize: '0.95rem',
                fontWeight: 600,
                lineHeight: 1.35,
                borderBottom: '1px dotted rgba(92,15,30,0.4)',
                margin: 0,
              }}>
                {TRANSLATED_MODE[language]}
              </dd>
            </div>
            <div>
              <dt style={{ fontSize: '0.68rem', lineHeight: 1.2, color: 'rgba(42,24,16,0.62)', margin: 0 }}>
                {labels.receivedBy}
              </dt>
              <dd style={{
                minHeight: '1.4em',
                paddingBottom: '2px',
                fontSize: '0.95rem',
                fontWeight: 600,
                lineHeight: 1.35,
                borderBottom: '1px dotted rgba(92,15,30,0.4)',
                margin: 0,
              }}>
                {TRANSLATED_BY[language]}
              </dd>
            </div>
          </div>
        </dl>

        {/* Footer — seal + signature */}
        <footer style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 'clamp(12px, 2vh, 18px)',
          minHeight: '58px',
        }}>
          {/* Seal */}
          <div style={{
            width: '58px',
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: '50%',
            border: '2px solid rgba(139,20,32,0.75)',
            boxShadow: 'inset 0 0 0 4px #f6f2e9, inset 0 0 0 5px rgba(139,20,32,0.5)',
            color: 'rgba(139,20,32,0.85)',
            fontSize: '0.65rem',
            fontWeight: 700,
            lineHeight: 1.25,
            transform: 'rotate(-12deg)',
            whiteSpace: 'pre-line',
          }}>
            {labels.sealText}
          </div>

          {/* Signature area */}
          <div style={{
            minWidth: '110px',
            paddingTop: '4px',
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'rgba(42,24,16,0.7)',
            borderTop: '1px solid rgba(42,24,16,0.55)',
          }}>
            {labels.signLine}
          </div>
        </footer>
      </article>

      {/* Next button */}
      <button
        onClick={onNext}
        style={{
          marginTop: 'clamp(8px, 1.5vh, 14px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          fontFamily: "'Mukta', 'Noto Sans Devanagari', -apple-system, sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(246,242,233,0.62)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 12px',
        }}
      >
        {labels.viewBlessing}
        <span style={{
          display: 'block',
          width: '8px',
          height: '8px',
          borderRight: '1.5px solid rgba(212,175,55,0.75)',
          borderBottom: '1.5px solid rgba(212,175,55,0.75)',
          transform: 'rotate(45deg)',
        }} />
      </button>
    </div>
  );
}
