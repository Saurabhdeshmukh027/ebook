import { useState, useEffect } from 'react';

/**
 * useIsMobile — Lightweight responsive hook
 *
 * Defaults to 768px (standard tablet/mobile breakpoint).
 * Enables conditional rendering for mobile-optimized narrative architecture
 * while guaranteeing desktop remains 100% untouched.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    update(mql);

    if (mql.addEventListener) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    } else {
      // Safari < 14 fallback
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
  }, [breakpoint]);

  return isMobile;
}
