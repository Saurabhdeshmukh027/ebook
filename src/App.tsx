import { useState, useEffect } from 'react';
import { useSmoothScroll } from './lib/smoothScroll';
import { Navigation } from './components/navigation/Navigation';
import { CinematicHero } from './components/hero/CinematicHero';
import { ProductStory } from './components/sections/ProductStory';
import { MandalBenefits } from './components/sections/MandalBenefits';
import { PricingSection } from './components/sections/PricingSection';
import { FinalCTA } from './components/sections/FinalCTA';
import { t } from './data/translations';
import type { Language } from './types';

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Sync document title and <html lang> attribute with selected language
  useEffect(() => {
    const translations = t(currentLanguage);
    document.title = translations.pageTitle;
    document.documentElement.lang = currentLanguage;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', translations.metaDescription);
    }
  }, [currentLanguage]);

  // Initialize global smooth scroll engine ONCE at app level
  // Lenis → GSAP ticker → ScrollTrigger — single coordinated RAF
  useSmoothScroll();

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const handlePrimaryCTAClick = () => {
    // TODO: Connect to actual signup/onboarding flow
    console.log('Primary CTA clicked - navigate to signup/onboarding');
    // window.location.href = '/signup'; // Uncomment when route exists
  };

  const handleSecondaryCTAClick = () => {
    // TODO: Connect to product exploration/demo
    console.log('Secondary CTA clicked - navigate to product demo');
    // window.location.href = '/demo'; // Uncomment when route exists
  };

  return (
    <>
      <Navigation
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <main>
        <CinematicHero
          language={currentLanguage}
        />
        <ProductStory language={currentLanguage} />
        <MandalBenefits language={currentLanguage} />
        <PricingSection language={currentLanguage} />
        <FinalCTA 
          language={currentLanguage} 
          onPrimaryClick={handlePrimaryCTAClick}
          onSecondaryClick={handleSecondaryCTAClick}
        />
      </main>
    </>
  );
}

export default App;