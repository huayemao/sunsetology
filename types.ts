export type Language = 'en' | 'zh' | 'ja' | 'ar';

export interface Color {
  r: number;
  g: number;
  b: number;
  hex: string;
  hsl: string; // "h, s%, l%"
  cmyk: string; // "c%, m%, y%, k%"
}

export interface Palette {
  primary: Color;
  secondary: Color;
  accent: Color;
  background: Color;
  colors: Color[]; // Full extracted list (5-8 colors)
}

export interface SunsetData {
  id: string;
  imageUrl: string;
  timestamp: number;
  palette: Palette;
  location?: string;
  quote?: string;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export interface Translations {
  title: string;
  subtitle: string;
  uploadText: string;
  uploadSubtext: string;
  analyzing: string;
  palette: string;
  gradient: string;
  cardView: string;
  download: string;
  reset: string;
  shareTitle: string;
  quotes: string[];
}
