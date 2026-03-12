import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function colorToParam(color: string): string {
  if (color.startsWith('#')) {
    return 'hex_' + color.slice(1);
  }
  return color;
}

export function paramToColor(param: string): string {
  if (param.startsWith('hex_')) {
    return '#' + param.slice(4);
  }
  return param;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function hexToHsl(hex: string): HSL {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function getComplementaryColor(hex: string): string {
  const hsl = hexToHsl(hex);
  hsl.h = (hsl.h + 180) % 360;
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function getAnalogousColors(hex: string, count: number = 2): string[] {
  const hsl = hexToHsl(hex);
  const colors: string[] = [];
  const step = 30;
  for (let i = 1; i <= count; i++) {
    const h1 = (hsl.h + step * i) % 360;
    colors.push(hslToHex(h1, hsl.s, hsl.l));
  }
  for (let i = 1; i <= count; i++) {
    const h2 = (hsl.h - step * i + 360) % 360;
    colors.push(hslToHex(h2, hsl.s, hsl.l));
  }
  return colors;
}

export function getTriadicColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
  ];
}

export function getSplitComplementaryColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
  ];
}

export function getMonochromaticColors(hex: string, count: number = 4): string[] {
  const hsl = hexToHsl(hex);
  const colors: string[] = [];
  const lightnessSteps = [20, 35, 50, 65, 80];
  for (let i = 0; i < count && i < lightnessSteps.length; i++) {
    colors.push(hslToHex(hsl.h, hsl.s, lightnessSteps[i]));
  }
  return colors;
}

export type ColorSchemeType = 'complementary' | 'analogous' | 'triadic' | 'splitComplementary' | 'monochromatic';

export interface RecommendedColors {
  type: ColorSchemeType;
  name: string;
  colors: string[];
}

export function getRecommendedColorSchemes(hex: string): RecommendedColors[] {
  return [
    {
      type: 'complementary',
      name: 'Complementary',
      colors: [getComplementaryColor(hex)]
    },
    {
      type: 'analogous',
      name: 'Analogous',
      colors: getAnalogousColors(hex, 1).slice(0, 2)
    },
    {
      type: 'triadic',
      name: 'Triadic',
      colors: getTriadicColors(hex)
    },
    {
      type: 'splitComplementary',
      name: 'Split Complementary',
      colors: getSplitComplementaryColors(hex)
    }
  ];
}

export function getBestColorPair(hex: string): string {
  const complementary = getComplementaryColor(hex);
  const hsl = hexToHsl(hex);
  
  if (hsl.l > 85) {
    return hslToHex(hsl.h, hsl.s, 20);
  } else if (hsl.l < 15) {
    return hslToHex(hsl.h, hsl.s, 85);
  }
  
  return complementary;
}