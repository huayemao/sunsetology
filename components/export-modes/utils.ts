import { Palette } from '../../types';

export type ExportMode = 'compare' | 'wallpaper' | 'card';

// Generate Gradient Data (Sorted by Luminance: Bright -> Dark)
export const generateGradientData = (palette: Palette) => {
  // Sort by luminance descending (Lightest first)
  const sorted = [...palette.colors].sort((a, b) => {
    const lumA = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    const lumB = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
    return lumB - lumA;
  }).slice(0, 5); // Take top 5 distinct colors for the gradient

  const stops = sorted.map((color, i) => ({
    color,
    pct: Math.round((i / (sorted.length - 1)) * 100)
  }));

  return {
    colors: sorted,
    stops,
    css: `linear-gradient(to bottom, ${stops.map(s => `${s.color.hex} ${s.pct}%`).join(', ')})`
  };
};

export type GradientData = ReturnType<typeof generateGradientData>;

export const getDateStr = () => {
  return new Date().toISOString().slice(0,10).replace(/-/g, '');
};
