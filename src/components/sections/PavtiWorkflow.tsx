import { useState, useCallback } from 'react';
import { PavtiCurtain } from './PavtiCurtain';
import { PavtiDarshan } from './PavtiDarshan';
import { PavtiReceipt } from './PavtiReceipt';
import { PavtiBlessing } from './PavtiBlessing';
import type { Language } from '../../types';

type WorkflowStep = 'curtain' | 'darshan' | 'receipt' | 'blessing';

interface PavtiWorkflowProps {
  language?: Language;
}

const STEP_ORDER: WorkflowStep[] = ['curtain', 'darshan', 'receipt', 'blessing'];

const WORKFLOW_CONTENT = {
  en: {
    sectionEyebrow: 'EXPERIENCE THE PAVTI',
    sectionHeadline: 'See how a real E-PavtiBook donation receipt works.',
    sectionSubheadline: 'Touch the curtain to begin the devotional experience.',
  },
  mr: {
    sectionEyebrow: 'पावती अनुभवा',
    sectionHeadline: 'E-PavtiBook देणगी पावती कशी कार्य करते ते पहा.',
    sectionSubheadline: 'भक्तिमय अनुभव सुरू करण्यासाठी पडद्याला स्पर्श करा.',
  },
  hi: {
    sectionEyebrow: 'पावती अनुभव करें',
    sectionHeadline: 'देखें कि E-PavtiBook दान रसीद कैसे काम करती है।',
    sectionSubheadline: 'भक्तिमय अनुभव शुरू करने के लिए पर्दे को स्पर्श करें।',
  },
};

export function PavtiWorkflow({ language = 'en' }: PavtiWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('curtain');
  const [curtainOpened, setCurtainOpened] = useState(false);
  const content = WORKFLOW_CONTENT[language];

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  const goNext = useCallback(() => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[idx + 1]);
    }
  }, [currentStep]);

  const goTo = useCallback((step: WorkflowStep) => {
    // Can only go to steps after curtain is opened (or to curtain)
    if (step === 'curtain' || curtainOpened) {
      setCurrentStep(step);
    }
  }, [curtainOpened]);

  const handleCurtainOpen = useCallback(() => {
    setCurtainOpened(true);
  }, []);

  return (
    <section
      id="demo-pavti"
      className="pavti-workflow-section"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(167, 54, 40, 0.06) 0%, transparent 70%),
          linear-gradient(180deg, #FFFBF3 0%, #F7EFDD 100%)
        `,
      }}
      aria-label="Pavti Workflow Demo"
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '700px' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-sindoor)',
          marginBottom: '1rem',
        }}>
          {content.sectionEyebrow}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 500,
          lineHeight: 1.2,
          color: 'var(--color-ink)',
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
        }}>
          {content.sectionHeadline}
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
          fontWeight: 300,
          lineHeight: 1.7,
          color: 'var(--color-ink-soft)',
          margin: 0,
        }}>
          {content.sectionSubheadline}
        </p>
      </div>

      {/* Workflow Container - phone-like viewport */}
      <div
        className="pavti-workflow-viewport"
        style={{
          position: 'relative',
          width: 'min(100%, 390px)',
          aspectRatio: '9 / 16',
          maxHeight: '70vh',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: `
            0 0 0 1px rgba(201, 162, 39, 0.3),
            0 30px 60px rgba(42, 30, 23, 0.25),
            0 15px 30px rgba(42, 30, 23, 0.15)
          `,
        }}
      >
        {/* Slides */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Each step rendered in its own container with slide transitions */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              opacity: currentStep === 'curtain' ? 1 : 0,
              transform: currentStep === 'curtain' ? 'translateY(0)' : 'translateY(-20px)',
              pointerEvents: currentStep === 'curtain' ? 'auto' : 'none',
              zIndex: currentStep === 'curtain' ? 10 : 1,
            }}
          >
            <PavtiCurtain
              language={language}
              onOpen={handleCurtainOpen}
              onNext={goNext}
              opened={curtainOpened}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              opacity: currentStep === 'darshan' ? 1 : 0,
              transform: currentStep === 'darshan' ? 'translateY(0)' : (currentIndex < 1 ? 'translateY(20px)' : 'translateY(-20px)'),
              pointerEvents: currentStep === 'darshan' ? 'auto' : 'none',
              zIndex: currentStep === 'darshan' ? 10 : 1,
            }}
          >
            <PavtiDarshan language={language} onNext={goNext} />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              opacity: currentStep === 'receipt' ? 1 : 0,
              transform: currentStep === 'receipt' ? 'translateY(0)' : (currentIndex < 2 ? 'translateY(20px)' : 'translateY(-20px)'),
              pointerEvents: currentStep === 'receipt' ? 'auto' : 'none',
              zIndex: currentStep === 'receipt' ? 10 : 1,
            }}
          >
            <PavtiReceipt language={language} onNext={goNext} />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              opacity: currentStep === 'blessing' ? 1 : 0,
              transform: currentStep === 'blessing' ? 'translateY(0)' : 'translateY(20px)',
              pointerEvents: currentStep === 'blessing' ? 'auto' : 'none',
              zIndex: currentStep === 'blessing' ? 10 : 1,
            }}
          >
            <PavtiBlessing language={language} onRestart={() => {
              setCurtainOpened(false);
              setCurrentStep('curtain');
            }} />
          </div>
        </div>

        {/* Navigation Dots */}
        <div
          className="pavti-dots"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {STEP_ORDER.map((step, i) => (
            <button
              key={step}
              onClick={() => goTo(step)}
              aria-label={`Go to step ${i + 1}`}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                background: currentStep === step
                  ? 'rgba(252, 232, 169, 1)'
                  : 'rgba(252, 232, 169, 0.35)',
                transform: currentStep === step ? 'scale(1.35)' : 'scale(1)',
                transition: 'background 0.3s ease, transform 0.3s ease',
                cursor: (step === 'curtain' || curtainOpened) ? 'pointer' : 'default',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pavti-workflow-section {
            padding: 3rem 1rem !important;
            min-height: auto !important;
          }
          .pavti-workflow-viewport {
            max-height: 65vh !important;
            border-radius: 18px !important;
          }
        }
        @media (max-width: 390px) {
          .pavti-workflow-viewport {
            width: 100% !important;
            border-radius: 0 !important;
            max-height: 75vh !important;
          }
        }
      `}</style>
    </section>
  );
}
