export const Colors = {
  dark: {
    background: '#1a1a2e',
    surface: '#16213e',
    card: '#1f2b47',
    primary: '#0078d4',
    accent: '#e94560',
    text: '#eaeaea',
    textSecondary: '#8892a4',
    border: '#2a3a5c',
    platinum: '#a8b8d8',
    gold: '#ffd700',
    silver: '#c0c0c0',
    bronze: '#cd7f32',
  },
  light: {
    background: '#f5f5f5',
    surface: '#ffffff',
    card: '#ffffff',
    primary: '#0078d4',
    accent: '#e94560',
    text: '#1a1a2e',
    textSecondary: '#666666',
    border: '#e0e0e0',
    platinum: '#6678a0',
    gold: '#b8960f',
    silver: '#808080',
    bronze: '#8b5e20',
  },
};

export type ThemeColors = typeof Colors.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};
