export const colors = {
  primary: '#1A73E8',
  primaryDark: '#0D47A1',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  text: '#111827',
  textMuted: '#4B5563',
  onPrimary: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
} as const;

export const theme = {
  colors,
  spacing,
  radius,
} as const;

export type Theme = typeof theme;
