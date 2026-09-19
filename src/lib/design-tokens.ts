export const colors = {
  sindoor: '#A73628',
  sindoorDark: '#8A2A1F',
  marigold: '#E8951E',
  brass: '#C9A227',
  ink: '#2A1E17',
  inkSoft: '#5C4E42',
  paper: '#F7EFDD',
  paperCard: '#FFFBF3',
  deepMaroon: '#3B1310',
  veryDeepMaroon: '#260B09',

  cinematic: {
    black: '#0A0A0A',
    darker: '#050505',
    dark: '#121212',
    overlay: 'rgba(10, 10, 10, 0.6)',
    overlayStrong: 'rgba(10, 10, 10, 0.85)',
    vignette: 'radial-gradient(ellipse at center, transparent 30%, #0A0A0A 100%)',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
} as const;

export const typography = {
  fontFamilies: {
    heading: ['Fraunces', 'serif'],
    body: ['Work Sans', 'sans-serif'],
    devanagari: ['Tiro Devanagari Hindi', 'Noto Sans Devanagari', 'sans-serif'],
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
    '5xl': '3.5rem',
    '6xl': '5rem',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
} as const;

export const zIndices = {
  base: 0,
  video: 10,
  atmospheric: 20,
  interaction: 30,
  content: 40,
  navigation: 100,
  modal: 200,
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '300ms ease',
  slow: '500ms ease',
  cinematic: '800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Breakpoints = typeof breakpoints;
export type ZIndices = typeof zIndices;
export type Transitions = typeof transitions;