// Simple test runner for color harmony functions
// Run with: node test-color-harmony.mjs

// HSL to RGB conversion helper
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function getColorHarmonies(baseColor) {
  const hsl = hexToHsl(baseColor);
  const { h, s, l } = hsl;

  return [
    {
      name: '互补色',
      description: '色轮上相对的两种颜色，对比强烈',
      colors: [baseColor, hslToHex({ h: (h + 180) % 360, s, l })]
    },
    {
      name: '类似色',
      description: '色轮上相邻的颜色，和谐统一',
      colors: [
        hslToHex({ h: (h - 30 + 360) % 360, s, l }),
        baseColor,
        hslToHex({ h: (h + 30) % 360, s, l })
      ]
    },
    {
      name: '三角色',
      description: '色轮上等距的三种颜色，平衡而丰富',
      colors: [
        baseColor,
        hslToHex({ h: (h + 120) % 360, s, l }),
        hslToHex({ h: (h + 240) % 360, s, l })
      ]
    }
  ];
}

function getRecommendedPair(baseColor) {
  const hsl = hexToHsl(baseColor);
  const { h, s, l } = hsl;

  if (l > 70) {
    return hslToHex({ h: (h + 180) % 360, s: Math.min(100, s + 20), l: Math.max(30, l - 40) });
  }

  if (l < 30) {
    return hslToHex({ h: (h + 30) % 360, s: Math.min(100, s + 30), l: Math.min(70, l + 40) });
  }

  return hslToHex({ h: (h + 180) % 360, s, l });
}

// Test runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.error(`  ${error.message || error}`);
    failed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toBeCloseTo(expected, precision = 0) {
      const diff = Math.abs(actual - expected);
      const threshold = Math.pow(10, -precision);
      if (diff > threshold) {
        throw new Error(`Expected ${actual} to be close to ${expected}`);
      }
    },
    toMatch(pattern) {
      if (!pattern.test(actual)) {
        throw new Error(`Expected ${actual} to match ${pattern}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined`);
      }
    },
    not: {
      toBe(expected) {
        if (actual === expected) {
          throw new Error(`Expected ${actual} not to be ${expected}`);
        }
      }
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toHaveLength(expected) {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected} but got ${actual.length}`);
      }
    }
  };
}

// Run tests
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

console.log('\nhslToHex Tests:');
test('should convert HSL to red hex correctly', () => {
  const result = hslToHex({ h: 0, s: 100, l: 50 });
  expect(result.toUpperCase()).toBe('#FF0000');
});

test('should convert HSL to green hex correctly', () => {
  const result = hslToHex({ h: 120, s: 100, l: 50 });
  expect(result.toUpperCase()).toBe('#00FF00');
});

test('should be reversible with hexToHsl', () => {
  const originalHex = '#5135FF';
  const hsl = hexToHsl(originalHex);
  const convertedBack = hslToHex(hsl);
  expect(convertedBack.toUpperCase()).toBe(originalHex.toUpperCase());
});

console.log('\ngetColorHarmonies Tests:');
test('should return 3 harmony types', () => {
  const harmonies = getColorHarmonies('#FF0000');
  expect(harmonies).toHaveLength(3);
});

test('should include complementary harmony', () => {
  const harmonies = getColorHarmonies('#FF0000');
  const complementary = harmonies.find(h => h.name === '互补色');
  expect(complementary).toBeDefined();
  expect(complementary.colors).toHaveLength(2);
});

test('should generate complementary color correctly', () => {
  const harmonies = getColorHarmonies('#FF0000');
  const complementary = harmonies.find(h => h.name === '互补色');
  expect(complementary.colors[1].toUpperCase()).toBe('#00FFFF');
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

console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(40)}`);

process.exit(failed > 0 ? 1 : 0);
