'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  getColorFromWheelPosition,
  getWheelPositionFromColor,
  getRecommendedPair
} from '@/lib/colorHarmony';

interface ColorWheelProps {
  color1: string;
  color2: string;
  onColor1Change: (color: string) => void;
  onColor2Change: (color: string) => void;
  mode: 'free' | 'recommend';
  className?: string;
}

const WHEEL_SIZE = 280;
const WHEEL_RADIUS = 120;
const CENTER = WHEEL_SIZE / 2;

export function ColorWheel({
  color1,
  color2,
  onColor1Change,
  onColor2Change,
  mode,
  className
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    const imageData = ctx.createImageData(WHEEL_SIZE, WHEEL_SIZE);
    const data = imageData.data;

    for (let y = 0; y < WHEEL_SIZE; y++) {
      for (let x = 0; x < WHEEL_SIZE; x++) {
        const dx = x - CENTER;
        const dy = y - CENTER;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= WHEEL_RADIUS) {
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          angle = (angle + 90 + 360) % 360;

          const saturation = Math.min(100, (distance / WHEEL_RADIUS) * 100);
          const hsl = { h: angle, s: saturation, l: 50 };
          const rgb = hslToRgb(hsl);

          const index = (y * WHEEL_SIZE + x) * 4;
          data[index] = rgb.r;
          data[index + 1] = rgb.g;
          data[index + 2] = rgb.b;
          data[index + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, WHEEL_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  useEffect(() => {
    if (mode === 'recommend' && color1) {
      const recommended = getRecommendedPair(color1);
      onColor2Change(recommended);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, color1]);

  const handleMouseDown = (e: React.MouseEvent, selector: 1 | 2) => {
    e.preventDefault();
    if (selector === 1) {
      setIsDragging1(true);
    } else {
      if (mode === 'free') {
        setIsDragging2(true);
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const color = getColorFromWheelPosition(x, y, CENTER, CENTER, WHEEL_RADIUS);
      setHoveredColor(color);

      if (isDragging1 && color) {
        onColor1Change(color);
      } else if (isDragging2 && color && mode === 'free') {
        onColor2Change(color);
      }
    },
    [isDragging1, isDragging2, mode, onColor1Change, onColor2Change]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging1(false);
    setIsDragging2(false);
  }, []);

  useEffect(() => {
    if (isDragging1 || isDragging2) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging1, isDragging2, handleMouseMove, handleMouseUp]);

  const pos1 = getWheelPositionFromColor(color1, CENTER, CENTER, WHEEL_RADIUS);
  const pos2 = getWheelPositionFromColor(color2, CENTER, CENTER, WHEEL_RADIUS);

  return (
    <div
      ref={containerRef}
      className={cn('relative select-none', className)}
      style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
    >
      <canvas
        ref={canvasRef}
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        className="rounded-full cursor-crosshair"
      />

      {pos1 && (
        <div
          className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-3 border-white shadow-lg cursor-grab active:cursor-grabbing z-10"
          style={{
            left: pos1.x,
            top: pos1.y,
            backgroundColor: color1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.5)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 1)}
          title="主色"
        />
      )}

      {pos2 && (
        <div
          className={cn(
            'absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-3 border-white shadow-lg z-10',
            mode === 'free' ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-80'
          )}
          style={{
            left: pos2.x,
            top: pos2.y,
            backgroundColor: color2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.5)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 2)}
          title={mode === 'recommend' ? '推荐色（自动）' : '副色'}
        />
      )}

      {mode === 'recommend' && pos1 && pos2 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
        >
          <line
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        </svg>
      )}

      {hoveredColor && (
        <div
          className="absolute pointer-events-none bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20"
          style={{
            left: '50%',
            bottom: -30,
            transform: 'translateX(-50%)'
          }}
        >
          {hoveredColor}
        </div>
      )}
    </div>
  );
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }) {
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

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
