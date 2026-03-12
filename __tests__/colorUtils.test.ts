import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getMonochromaticColors,
  getRecommendedColorSchemes,
  getBestColorPair
} from '../src/lib/utils';

describe('Color Conversion Functions', () => {
  describe('hexToRgb', () => {
    it('should convert red hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should convert green hex to RGB', () => {
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('should convert blue hex to RGB', () => {
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('should convert red RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    });

    it('should convert green RGB to hex', () => {
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
    });

    it('should convert blue RGB to hex', () => {
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    it('should clamp values to valid range', () => {
      expect(rgbToHex(-10, 300, 128)).toBe('#00ff80');
    });
  });

  describe('RGB <-> HSL Conversion', () => {
    it('should round-trip convert colors accurately', () => {
      const testColors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
      
      testColors.forEach(hex => {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const backToRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        const backToHex = rgbToHex(backToRgb.r, backToRgb.g, backToRgb.b);
        
        expect(backToHex.toLowerCase()).toBe(hex.toLowerCase());
      });
    });
  });

  describe('hexToHsl and hslToHex', () => {
    it('should convert hex to HSL and back', () => {
      const hex = '#5135FF';
      const hsl = hexToHsl(hex);
      const backToHex = hslToHex(hsl.h, hsl.s, hsl.l);
      
      expect(backToHex.toLowerCase()).toBe(hex.toLowerCase());
    });
  });
});

describe('Color Scheme Functions', () => {
  describe('getComplementaryColor', () => {
    it('should return complementary color 180 degrees away', () => {
      const baseColor = '#FF0000';
      const hslBase = hexToHsl(baseColor);
      const complementary = getComplementaryColor(baseColor);
      const hslComp = hexToHsl(complementary);
      
      const angleDiff = Math.abs((hslComp.h - hslBase.h + 360) % 360);
      expect(Math.abs(angleDiff - 180)).toBeLessThan(2);
    });
  });

  describe('getAnalogousColors', () => {
    it('should return analogous colors ±30 degrees away', () => {
      const baseColor = '#FF0000';
      const hslBase = hexToHsl(baseColor);
      const analogous = getAnalogousColors(baseColor, 1);
      
      expect(analogous.length).toBe(2);
      
      const expectedAngles = [30, 330];
      analogous.forEach((color, index) => {
        const hsl = hexToHsl(color);
        const angleDiff = Math.abs((hsl.h - hslBase.h + 360) % 360);
        const expected = expectedAngles[index];
        const minDiff = Math.min(angleDiff, 360 - angleDiff);
        expect(Math.abs(minDiff - (index === 0 ? 30 : 30))).toBeLessThan(2);
      });
    });
  });

  describe('getTriadicColors', () => {
    it('should return triadic colors 120 degrees apart', () => {
      const baseColor = '#FF0000';
      const hslBase = hexToHsl(baseColor);
      const triadic = getTriadicColors(baseColor);
      
      expect(triadic.length).toBe(2);
      
      const expectedAngles = [120, 240];
      triadic.forEach((color, index) => {
        const hsl = hexToHsl(color);
        const angleDiff = Math.abs((hsl.h - hslBase.h + 360) % 360);
        expect(Math.abs(angleDiff - expectedAngles[index])).toBeLessThan(2);
      });
    });
  });

  describe('getSplitComplementaryColors', () => {
    it('should return split complementary colors at 150 and 210 degrees', () => {
      const baseColor = '#FF0000';
      const hslBase = hexToHsl(baseColor);
      const splitComp = getSplitComplementaryColors(baseColor);
      
      expect(splitComp.length).toBe(2);
      
      const expectedAngles = [150, 210];
      splitComp.forEach((color, index) => {
        const hsl = hexToHsl(color);
        const angleDiff = Math.abs((hsl.h - hslBase.h + 360) % 360);
        expect(Math.abs(angleDiff - expectedAngles[index])).toBeLessThan(2);
      });
    });
  });

  describe('getMonochromaticColors', () => {
    it('should return monochromatic colors with same hue', () => {
      const baseColor = '#5135FF';
      const hslBase = hexToHsl(baseColor);
      const monochromatic = getMonochromaticColors(baseColor);
      
      expect(monochromatic.length).toBeGreaterThan(0);
      
      monochromatic.forEach(color => {
        const hsl = hexToHsl(color);
        expect(Math.abs(hsl.h - hslBase.h)).toBeLessThan(2);
      });
    });
  });
});

describe('Recommended Color Schemes', () => {
  it('should return all recommended color schemes', () => {
    const schemes = getRecommendedColorSchemes('#5135FF');
    
    expect(schemes.length).toBe(4);
    expect(schemes[0].type).toBe('complementary');
    expect(schemes[1].type).toBe('analogous');
    expect(schemes[2].type).toBe('triadic');
    expect(schemes[3].type).toBe('splitComplementary');
    
    schemes.forEach(scheme => {
      expect(scheme.colors.length).toBeGreaterThan(0);
      scheme.colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });
});

describe('getBestColorPair', () => {
  it('should return a valid hex color', () => {
    const pair = getBestColorPair('#5135FF');
    expect(pair).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should adjust for very light colors', () => {
    const lightColor = '#FFFFFF';
    const pair = getBestColorPair(lightColor);
    const hslPair = hexToHsl(pair);
    expect(hslPair.l).toBeLessThan(50);
  });

  it('should adjust for very dark colors', () => {
    const darkColor = '#000000';
    const pair = getBestColorPair(darkColor);
    const hslPair = hexToHsl(pair);
    expect(hslPair.l).toBeGreaterThan(50);
  });
});
