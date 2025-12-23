import { Color, Palette } from '../types';

// Helper to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Helper to convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number; str: string } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);
  
  return { h: hDeg, s: sPct, l: lPct, str: `${hDeg}, ${sPct}%, ${lPct}%` };
};

// Helper for CMYK
const rgbToCmyk = (r: number, g: number, b: number): string => {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, Math.min(m, y));

  c = (c - k) / (1 - k) || 0;
  m = (m - k) / (1 - k) || 0;
  y = (y - k) / (1 - k) || 0;

  return `${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%`;
};

// Color Distance (Euclidean in RGB space, simplified)
const colorDistance = (c1: {r:number, g:number, b:number}, c2: {r:number, g:number, b:number}) => {
  return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
};

// 权重计算函数类型定义
type WeightFunction = (r: number, g: number, b: number, hsl: { h: number; s: number; l: number }) => number;

/**
 * 通用的颜色提取函数，可以通过权重函数自定义颜色优先级
 * @param imageElement HTML图像元素
 * @param weightFunction 自定义权重计算函数，决定哪些颜色应该被优先选择
 * @returns 提取的调色板
 */
export const extractPalette = (imageElement: HTMLImageElement, weightFunction?: WeightFunction): Promise<Palette> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Resize for processing speed
      const scale = Math.min(1, 400 / imageElement.width);
      canvas.width = imageElement.width * scale;
      canvas.height = imageElement.height * scale;
      
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const pixelBuckets: { [key: string]: { count: number; r: number; g: number; b: number } } = {};
      const quantizationFactor = 10; // Group similar colors

      for (let i = 0; i < data.length; i += 4 * 10) { // Sample every 10th pixel for speed
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue; // Skip transparent

        const hsl = rgbToHsl(r, g, b);

        // 计算权重
        let weight = weightFunction ? weightFunction(r, g, b, hsl) : 1;
        
        // 确保权重不为负数
        weight = Math.max(0.1, weight);

        const key = `${Math.round(r / quantizationFactor) * quantizationFactor},${Math.round(g / quantizationFactor) * quantizationFactor},${Math.round(b / quantizationFactor) * quantizationFactor}`;
        
        if (!pixelBuckets[key]) {
          pixelBuckets[key] = { count: 0, r, g, b };
        }
        pixelBuckets[key].count += weight;
      }

      // Sort buckets by weighted count
      const sortedBuckets = Object.values(pixelBuckets).sort((a, b) => b.count - a.count);

      // Select distinct colors
      const selectedColors: {r:number, g:number, b:number}[] = [];
      const threshold = 40; // Minimum distance between colors

      for (const bucket of sortedBuckets) {
        if (selectedColors.length >= 8) break;
        
        const isDistinct = selectedColors.every(c => colorDistance(c, bucket) > threshold);
        if (isDistinct) {
          selectedColors.push(bucket);
        }
      }

      // Convert to Color interface
      const finalColors: Color[] = selectedColors.map(c => ({
        r: c.r, g: c.g, b: c.b,
        hex: rgbToHex(c.r, c.g, c.b),
        hsl: rgbToHsl(c.r, c.g, c.b).str,
        cmyk: rgbToCmyk(c.r, c.g, c.b)
      }));

      // Sort final colors by luminance for the palette structure
      const sortedByLum = [...finalColors].sort((a, b) => {
         const getLum = (c: Color) => 0.299*c.r + 0.587*c.g + 0.114*c.b;
         return getLum(b) - getLum(a);
      });

      resolve({
        primary: sortedByLum[Math.floor(sortedByLum.length / 2)] || finalColors[0], // Mid-tone usually works best as primary
        secondary: sortedByLum[0] || finalColors[1], // Brightest
        accent: sortedByLum[sortedByLum.length - 1] || finalColors[2], // Darkest
        background: sortedByLum[sortedByLum.length - 2] || finalColors[0],
        colors: finalColors
      });

    } catch (e) {
      reject(e);
    }
  });
};

/**
 * 日落特定的权重函数，为日落照片优化颜色提取
 */
const sunsetWeightFunction: WeightFunction = (r: number, g: number, b: number, hsl: { h: number; s: number; l: number }) => {
  let weight = 1;
  
  // Boost Reds, Oranges, Pinks, Purples (Hue 300-360 & 0-60)
  if (hsl.h > 300 || hsl.h < 60) weight += 2.0;
  // Boost Twilight Blues (Hue 200-260) with moderate darkness
  else if (hsl.h > 200 && hsl.h < 260 && hsl.l < 60) weight += 1.5;
  
  // Penalize de-saturated colors (greys) unless they are very dark (silhouettes)
  if (hsl.s < 20 && hsl.l > 15 && hsl.l < 85) weight -= 0.5;
  
  // Penalize pure white blowouts
  if (hsl.l > 95) weight -= 0.8;
  
  return weight;
};

/**
 * Extracts colors specifically weighted for sunset aesthetics.
 * Prioritizes: Warms tones (Hue 300-60), Deep Blues (Hue 200-260).
 * Penalizes: Low saturation greys, pure blacks/whites (unless high contrast).
 */
export const extractSunsetPalette = (imageElement: HTMLImageElement): Promise<Palette> => {
  return extractPalette(imageElement, sunsetWeightFunction);
};

/**
 * Extracts colors from any image without specific weighting for sunset aesthetics.
 * Provides a balanced palette suitable for all types of images.
 */
export const extractGeneralPalette = (imageElement: HTMLImageElement): Promise<Palette> => {
  return extractPalette(imageElement); // No weight function means balanced extraction
};