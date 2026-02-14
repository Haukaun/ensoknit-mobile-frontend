import { themeColors, type ThemeColors, type ColorScheme } from './theme-colors';

describe('themeColors', () => {
  test('exports light theme with all required color keys', () => {
    const requiredKeys = [
      'primary',
      'primaryForeground',
      'secondary',
      'secondaryForeground',
      'muted',
      'mutedForeground',
      'accent',
      'accentForeground',
      'background',
      'foreground',
      'card',
      'border',
      'destructive',
    ];

    requiredKeys.forEach((key) => {
      expect(themeColors.light).toHaveProperty(key);
      expect(typeof themeColors.light[key as keyof typeof themeColors.light]).toBe('string');
    });
  });

  test('exports dark theme with all required color keys', () => {
    const requiredKeys = [
      'primary',
      'primaryForeground',
      'secondary',
      'secondaryForeground',
      'muted',
      'mutedForeground',
      'accent',
      'accentForeground',
      'background',
      'foreground',
      'card',
      'border',
      'destructive',
    ];

    requiredKeys.forEach((key) => {
      expect(themeColors.dark).toHaveProperty(key);
      expect(typeof themeColors.dark[key as keyof typeof themeColors.dark]).toBe('string');
    });
  });

  test('all color values are valid hex colors', () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;

    Object.values(themeColors.light).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });

    Object.values(themeColors.dark).forEach((color) => {
      expect(color).toMatch(hexColorRegex);
    });
  });

  test('ThemeColors type matches light theme structure', () => {
    const colorScheme: ThemeColors = themeColors.light;
    expect(colorScheme).toBeDefined();
  });

  test('ColorScheme type is valid', () => {
    const schemes: ColorScheme[] = ['light', 'dark'];
    expect(schemes).toHaveLength(2);
  });
});
