/**
 * Centralized hex color constants matching our CSS custom properties in global.css.
 * This is the single source of truth for runtime color access.
 *
 * RULE: Prefer Tailwind classes (className="text-primary bg-secondary") for all styling.
 * Only import from here when an API requires a raw color string (icon libraries, charts,
 * animated styles).
 *
 * Light theme values are mathematically converted from OKLCH source values.
 * Dark theme values are designer-derived (see design doc Section 1).
 */
export const themeColors = {
  light: {
    primary: '#78472a',           // --primary: 22 48.2% 31.9%
    primaryForeground: '#fffbf5', // --primary-foreground: 37 100% 97.9%
    secondary: '#f2e2d0',         // --secondary: 31 57% 88.2%
    secondaryForeground: '#3a2a20', // --secondary-foreground: 21 28.8% 17.8%
    muted: '#f8ece1',             // --muted: 29 63.8% 92.8%
    mutedForeground: '#775d4f',   // --muted-foreground: 21 20% 38.7%
    accent: '#c69356',            // --accent: 33 49.8% 55.7%
    accentForeground: '#1e130e',  // --accent-foreground: 21 36.2% 8.5%
    background: '#fff7ee',        // --background: 32 100% 96.6%
    foreground: '#2d1d14',        // --foreground: 21 37.9% 12.9%
    card: '#fffbf5',              // --card: 37 100% 97.9%
    border: '#e1d5ca',            // --border: 29 27.8% 83.8%
    destructive: '#cc272e',       // --destructive: 357 68.3% 47.6%
  },
  dark: {
    primary: '#C4956A',           // --primary: 35 40% 65% (designer-derived)
    primaryForeground: '#1A1512', // --primary-foreground: 30 20% 8%
    secondary: '#272017',         // --secondary: 30 15% 14%
    secondaryForeground: '#EDE4D8', // --secondary-foreground: 40 30% 93%
    muted: '#251E16',             // --muted: 30 12% 14%
    mutedForeground: '#8C7A6A',   // --muted-foreground: 30 15% 55%
    accent: '#C49A5C',            // --accent: 40 40% 55%
    accentForeground: '#EDE4D8',  // --accent-foreground: 40 30% 93%
    background: '#1F1810',        // --background: 30 20% 8%
    foreground: '#EDE4D8',        // --foreground: 40 30% 93%
    card: '#241C13',              // --card: 30 18% 10%
    border: '#342A1F',            // --border: 30 12% 18%
    destructive: '#D15050',       // --destructive: 0 70% 59%
  },
} as const;

export type ThemeColors = (typeof themeColors)['light'];
export type ColorScheme = 'light' | 'dark';
