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
  general: string;
  sunsetMode: string;
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
  original: string;
  artisticWallpaper: string;
  sunsetologyGradient: string;
  generated: string;
  bySunsetologyApp: string;
  linear: string;
  radial: string;
  compare: string;
  wallpaper: string;
  card: string;
  comparisonView: string;
  portraitView: string;
  socialView: string;
  compareDimensions: string;
  wallpaperDimensions: string;
  cardDimensions: string;
  compareDescription: string;
  wallpaperDescription: string;
  cardDescription: string;
  saveImage: string;
  copied: string;
  preview: string;
  generateArt: string;
  detectedDominantTones: string;
  primaryHexRgb: string;
  primaryHslCmyk: string;
  footerQuote: string;
  copyright: string;
  includeOriginal: string;
  product: string;
  exampleImages: string;
  useThisImage: string;
}