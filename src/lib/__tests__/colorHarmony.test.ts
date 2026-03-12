import {
  hexToHsl,
  hslToHex,
  getColorHarmonies,
  getRecommendedPair,
  getColorFromWheelPosition,
  getWheelPositionFromColor
} from '../colorHarmony';

// Simple test runner
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.error(`  ${error}`);
    failed++;
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toBeCloseTo(expected: number, precision: number) {
      const diff = Math.abs((actual as number) - expected);
      const threshold = Math.pow(10, -precision);
      if (diff > threshold) {
        throw new Error(`Expected ${actual} to be close to ${expected}`);
      }
    },
    toMatch(pattern: RegExp) {
      if (!pattern.test(actual as string)) {
        throw new Error(`Expected ${actual} to match ${pattern}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null but got ${actual}`);
      }
    },
    not: {
      toBe(expected: unknown) {
        if (actual === expected) {
          throw new Error(`Expected ${actual} not to be ${expected}`);
        }
      },
      toBeNull() {
        if (actual === null) {
          throw new Error(`Expected value not to be null`);
        }
      }
    },
    toBeLessThan(expected: number) {
      if (!((actual as number) < expected)) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (!((actual as number) > expected)) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (!((actual as number) <= expected)) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    },
    toHaveLength(expected: number) {
      if ((actual as { length: number }).length !== expected) {
        throw new Error(`Expected length ${expected} but got ${(actual as { length: number }).length}`);
      }
    }
  };
}

// Test suites
console.log('Running Color Harmony Tests...\n');

console.log('hexToHsl Tests:');
test('should convert red hex to HSL correctly', () => {
  const result = hexToHsl('#FF0000');
  expect(result.h).toBeCloseTo(0, 0);
  expect(result.s).toBeCloseTo(100, 0);
  expect(result.l).toBeCloseTo(50, 0);
});

test('should convert green hex to HSL correctly', () => {
  const result = hexToHsl('#00FF00');
  expect(result.h).toBeCloseTo(120, 0);
  expect(result.s).toBeCloseTo(100, 0);
  expect(result.l).toBeCloseTo(50, 0);
});

test('should convert blue hex to HSL correctly', () => {
  const result = hexToHsl('#0000FF');
  expect(result.h).toBeCloseTo(240, 0);
  expect(result.s).toBeCloseTo(100, 0);
  expect(result.l).toBeCloseTo(50, 0);
});

test('should convert white hex to HSL correctly', () => {
  const result = hexToHsl('#FFFFFF');
  expect(result.s).toBeCloseTo(0, 0);
  expect(result.l).toBeCloseTo(100, 0);
});

test('should convert black hex to HSL correctly', () => {
  const result = hexToHsl('#000000');
  expect(result.s).toBeCloseTo(0, 0);
  expect(result.l).toBeCloseTo(0, 0);
});

console.log('\nhslToHex Tests:');
test('should convert HSL to red hex correctly', () => {
  const result = hslToHex({ h: 0, s: 100, l: 50 });
  expect(result.toUpperCase()).toBe('#FF0000');
});

test('should convert HSL to green hex correctly', () => {
  const result = hslToHex({ h: 120, s: 100, l: 50 });
  expect(result.toUpperCase()).toBe('#00FF00');
});

test('should convert HSL to blue hex correctly', () => {
  const result = hslToHex({ h: 240, s: 100, l: 50 });
  expect(result.toUpperCase()).toBe('#0000FF');
});

test('should be reversible with hexToHsl', () => {
  const originalHex = '#5135FF';
  const hsl = hexToHsl(originalHex);
  const convertedBack = hslToHex(hsl);
  expect(convertedBack.toUpperCase()).toBe(originalHex.toUpperCase());
});

console.log('\ngetColorHarmonies Tests:');
test('should return 6 harmony types', () => {
  const harmonies = getColorHarmonies('#FF0000');
  expect(harmonies).toHaveLength(6);
});

test('should include complementary harmony', () => {
  const harmonies = getColorHarmonies('#FF0000');
  const complementary = harmonies.find(h => h.name === '互补色');
  expect(complementary).toBeDefined();
  expect(complementary?.colors).toHaveLength(2);
});

test('should include analogous harmony', () => {
  const harmonies = getColorHarmonies('#FF0000');
  const analogous = harmonies.find(h => h.name === '类似色');
  expect(analogous).toBeDefined();
  expect(analogous?.colors).toHaveLength(3);
});

test('should include triadic harmony', () => {
  const harmonies = getColorHarmonies('#FF0000');
  const triadic = harmonies.find(h => h.name === '三角色');
  expect(triadic).toBeDefined();
  expect(triadic?.colors).toHaveLength(3);
});

test('should return valid hex colors', () => {
  const harmonies = getColorHarmonies('#FF0000');
  harmonies.forEach(harmony => {
    harmony.colors.forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

test('should generate complementary color correctly', () => {
  const harmonies = getColorHarmonies('#FF0000');
  const complementary = harmonies.find(h => h.name === '互补色');
  expect(complementary?.colors[1].toUpperCase()).toBe('#00FFFF');
});

console.log('\ngetRecommendedPair Tests:');
test('should return a valid hex color', () => {
  const result = getRecommendedPair('#FF0000');
  expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
});

test('should return different colors for different inputs', () => {
  const pair1 = getRecommendedPair('#FF0000');
  const pair2 = getRecommendedPair('#00FF00');
  expect(pair1).not.toBe(pair2);
});

test('should recommend darker color for bright input', () => {
  const brightColor = '#FFFFFF';
  const recommended = getRecommendedPair(brightColor);
  const brightHsl = hexToHsl(brightColor);
  const recommendedHsl = hexToHsl(recommended);
  expect(recommendedHsl.l).toBeLessThan(brightHsl.l);
});

test('should recommend brighter color for dark input', () => {
  const darkColor = '#000000';
  const recommended = getRecommendedPair(darkColor);
  const darkHsl = hexToHsl(darkColor);
  const recommendedHsl = hexToHsl(recommended);
  expect(recommendedHsl.l).toBeGreaterThan(darkHsl.l);
});

console.log('\ngetColorFromWheelPosition Tests:');
const CENTER = 140;
const RADIUS = 120;

test('should return empty string for position outside wheel', () => {
  const result = getColorFromWheelPosition(0, 0, CENTER, CENTER, RADIUS);
  expect(result).toBe('');
});

test('should return a valid hex color for position inside wheel', () => {
  const result = getColorFromWheelPosition(CENTER, CENTER - 50, CENTER, CENTER, RADIUS);
  expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
});

test('should return red for top position', () => {
  const result = getColorFromWheelPosition(CENTER, CENTER - RADIUS + 10, CENTER, CENTER, RADIUS);
  const hsl = hexToHsl(result);
  expect(hsl.h).toBeCloseTo(0, -1);
});

console.log('\ngetWheelPositionFromColor Tests:');
test('should return position for valid color', () => {
  const result = getWheelPositionFromColor('#FF0000', CENTER, CENTER, RADIUS);
  expect(result).not.toBeNull();
  expect(result?.x).toBeDefined();
  expect(result?.y).toBeDefined();
});

test('should return position within wheel bounds', () => {
  const result = getWheelPositionFromColor('#00FF00', CENTER, CENTER, RADIUS);
  expect(result).not.toBeNull();
  const dx = (result?.x || 0) - CENTER;
  const dy = (result?.y || 0) - CENTER;
  const distance = Math.sqrt(dx * dx + dy * dy);
  expect(distance).toBeLessThanOrEqual(RADIUS);
});

console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(40)}`);

process.exit(failed > 0 ? 1 : 0);
