export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorHarmony {
  name: string;
  description: string;
  colors: string[];
}

export function hexToHsl(hex: string): HSLColor {
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

export function hslToHex({ h, s, l }: HSLColor): string {
  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  let r: number, g: number, b: number;

  if (sat === 0) {
    r = g = b = light;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
    const p = 2 * light - q;
    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function getColorHarmonies(baseColor: string): ColorHarmony[] {
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
      name: '分裂互补色',
      description: '一种颜色与其互补色两侧的颜色',
      colors: [
        baseColor,
        hslToHex({ h: (h + 150) % 360, s, l }),
        hslToHex({ h: (h + 210) % 360, s, l })
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
    },
    {
      name: '四角色',
      description: '色轮上形成矩形的四种颜色',
      colors: [
        baseColor,
        hslToHex({ h: (h + 90) % 360, s, l }),
        hslToHex({ h: (h + 180) % 360, s, l }),
        hslToHex({ h: (h + 270) % 360, s, l })
      ]
    },
    {
      name: '单色',
      description: '同一色相的不同明度和饱和度',
      colors: [
        hslToHex({ h, s, l: Math.max(20, l - 30) }),
        hslToHex({ h, s, l }),
        hslToHex({ h, s, l: Math.min(80, l + 30) })
      ]
    }
  ];
}

export function getRecommendedPair(baseColor: string): string {
  const hsl = hexToHsl(baseColor);
  const { h, s, l } = hsl;

  const brightness = l;
  const saturation = s;

  if (brightness > 70) {
    return hslToHex({ h: (h + 180) % 360, s: Math.min(100, s + 20), l: Math.max(30, l - 40) });
  }

  if (brightness < 30) {
    return hslToHex({ h: (h + 30) % 360, s: Math.min(100, s + 30), l: Math.min(70, l + 40) });
  }

  if (saturation < 30) {
    return hslToHex({ h: (h + 180) % 360, s: 70, l });
  }

  const harmonies = [
    hslToHex({ h: (h + 180) % 360, s, l }),
    hslToHex({ h: (h + 30) % 360, s, l }),
    hslToHex({ h: (h - 30 + 360) % 360, s, l }),
    hslToHex({ h, s: Math.min(100, s + 20), l: Math.min(80, l + 20) }),
    hslToHex({ h, s, l: Math.min(80, l + 25) })
  ];

  return harmonies[0];
}

export function getColorFromWheelPosition(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radius: number
): string {
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > radius) {
    return '';
  }

  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 90 + 360) % 360;

  const saturation = Math.min(100, (distance / radius) * 100);
  const lightness = 50;

  return hslToHex({ h: angle, s: saturation, l: lightness });
}

export function getWheelPositionFromColor(
  color: string,
  centerX: number,
  centerY: number,
  radius: number
): { x: number; y: number } | null {
  const hsl = hexToHsl(color);
  const { h, s } = hsl;

  const angleRad = ((h - 90) * Math.PI) / 180;
  const distance = (s / 100) * radius;

  const x = centerX + Math.cos(angleRad) * distance;
  const y = centerY + Math.sin(angleRad) * distance;

  return { x, y };
}
