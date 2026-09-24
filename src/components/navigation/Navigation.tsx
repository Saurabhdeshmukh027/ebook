import { useState, useEffect, useCallback } from 'react';
import { scrollTo } from '../../lib/smoothScroll';
import { t } from '../../data/translations';
import type { Language } from '../../types';

interface NavigationProps {
  className?: string;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const NAV_LINKS = [
  { href: '#why', label: { en: 'Why This Matters', mr: 'हे महत्त्वाचे का?', hi: 'यह महत्वपूर्ण क्यों है?' } },
  { href: '#product', label: { en: 'E-PavtiBook', mr: 'ई-पावतीबुक', hi: 'ई-पावतीबुक' } },
  { href: '#features', label: { en: 'Features', mr: 'सुविधा', hi: 'विशेषताएं' } },
  { href: '#pricing', label: { en: 'Pricing', mr: 'किंमत', hi: 'मूल्य' } },
];

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
] as const;

export function Navigation({ className = '', currentLanguage = 'en', onLanguageChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isLanguageOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-language')) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLanguageOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollTo(href);
      setIsMobileMenuOpen(false);
    }
  }, []);

  return (
    <nav
      className={`navigation ${className} ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
        backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(247, 239, 221, 0.1)' : 'none',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.125rem, 3.5vw, 1.5rem)',
            fontWeight: 600,
            color: 'var(--color-paper)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          E-PavtiBook
        </span>
        <span
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-marigold)',
            backgroundColor: 'rgba(232, 149, 30, 0.1)',
            padding: '0.125rem 0.5rem',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
          }}
        >
          Mandal
        </span>
      </div>

      <div
        className="nav-links"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          listStyle: 'none',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'rgba(247, 239, 221, 0.8)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-marigold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(247, 239, 221, 0.8)'; }}
          >
            {link.label[currentLanguage]}
          </a>
        ))}
        {/* Mobile-only language selector inside hamburger menu */}
        <div className="mobile-language-selector" style={{ display: 'none' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={lang.code === currentLanguage ? 'active' : ''}
              onClick={() => {
                onLanguageChange?.(lang.code);
                setIsMobileMenuOpen(false);
              }}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>

      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="nav-language" style={{ position: 'relative' }}>
          <button
            className="language-trigger"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'rgba(247, 239, 221, 0.8)',
              background: 'none',
              border: '1px solid rgba(247, 239, 221, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-marigold)';
              e.currentTarget.style.color = 'var(--color-marigold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247, 239, 221, 0.2)';
              e.currentTarget.style.color = 'rgba(247, 239, 221, 0.8)';
            }}
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            aria-haspopup="listbox"
            aria-expanded={isLanguageOpen}
          >
            {languages.find(l => l.code === currentLanguage)?.native}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, transform: isLanguageOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {isLanguageOpen && (
            <ul
              className="language-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                right: 0,
                minWidth: '160px',
                background: 'rgba(10, 10, 10, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(247, 239, 221, 0.1)',
                borderRadius: '8px',
                padding: '0.5rem',
                listStyle: 'none',
                zIndex: 200,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                animation: 'dropdown-fade 0.2s ease',
              }}
              role="listbox"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <li key={lang.code} role="option" aria-selected={lang.code === currentLanguage}>
                  <button
                    onClick={() => {
                      onLanguageChange?.(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.625rem 1rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: lang.code === currentLanguage ? 600 : 500,
                      color: lang.code === currentLanguage ? 'var(--color-marigold)' : 'rgba(247, 239, 221, 0.9)',
                      background: lang.code === currentLanguage ? 'rgba(232, 149, 30, 0.1)' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      transition: 'background-color 0.15s ease, color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (lang.code !== currentLanguage) {
                        e.currentTarget.style.backgroundColor = 'rgba(247, 239, 221, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (lang.code !== currentLanguage) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {lang.native}
                    {lang.code === currentLanguage && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--color-marigold)', flexShrink: 0 }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          className="nav-cta"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-cinematic-black)',
            backgroundColor: 'var(--color-marigold)',
            padding: '0.625rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            transition: 'background-color 0.2s ease, transform 0.1s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-brass)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-marigold)'; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {t(currentLanguage).getStarted}
        </a>

        <button
          className="mobile-menu-toggle"
          style={{
            display: 'none',
            padding: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-paper)',
          }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? t(currentLanguage).closeMenu : t(currentLanguage).openMenu}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .navigation {
            padding: 0.75rem 1rem !important;
            height: 64px !important;
          }
          .nav-actions {
            gap: 0.5rem !important;
          }
          .nav-actions .nav-cta {
            padding: 0.45rem 0.85rem !important;
            font-size: 0.8125rem !important;
          }
          .nav-links {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 1px solid rgba(247, 239, 221, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
          }
          .nav-links a {
            font-size: 1.125rem;
          }
          .mobile-open .nav-links {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
          .nav-language {
            display: none;
          }
          .mobile-language-selector {
            display: flex !important;
            flex-direction: row;
            gap: 0.5rem;
            justify-content: center;
            padding-top: 1rem;
            border-top: 1px solid rgba(247, 239, 221, 0.1);
          }
          .mobile-language-selector button {
            padding: 0.5rem 1rem;
            font-family: var(--font-body);
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 4px;
            border: 1px solid rgba(247, 239, 221, 0.2);
            background: transparent;
            color: rgba(247, 239, 221, 0.8);
            cursor: pointer;
            transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
          }
          .mobile-language-selector button.active {
            background: rgba(232, 149, 30, 0.15);
            color: var(--color-marigold);
            border-color: var(--color-marigold);
            font-weight: 600;
          }
          .nav-links .nav-cta {
            width: 100%;
            text-align: center;
          }
        }
        @keyframes dropdown-fade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}