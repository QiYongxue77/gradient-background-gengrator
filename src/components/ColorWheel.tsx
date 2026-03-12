'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  hexToHsl,
  hslToHex,
  getRecommendedColorSchemes,
  getBestColorPair,
  type RecommendedColors
} from '@/lib/utils';

interface ColorWheelProps {
  color1: string;
  color2: string;
  onColorsChange: (color1: string, color2: string) => void;
}

type SelectionMode = 'free' | 'recommended';

export const ColorWheel: React.FC<ColorWheelProps> = ({
  color1,
  color2,
  onColorsChange
}) => {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [selectedColor, setSelectedColor] = useState<string>(color1);
  const [activeHandle, setActiveHandle] = useState<1 | 2>(1);
  const wheelRef = useRef<HTMLDivElement>(null);

  const recommendedSchemes = useMemo(() => {
    return getRecommendedColorSchemes(selectedColor);
  }, [selectedColor]);

  const getAngle = (x: number, y: number, centerX: number, centerY: number): number => {
    const dx = x - centerX;
    const dy = y - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  };

  const getDistance = (x: number, y: number, centerX: number, centerY: number): number => {
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleWheelInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const angle = getAngle(x, y, centerX, centerY);
    const distance = getDistance(x, y, centerX, centerY);
    const saturation = Math.min(100, (distance / (rect.width / 2)) * 100);

    const hsl = hexToHsl(selectedColor);
    const newColor = hslToHex(angle, saturation, hsl.l);

    setSelectedColor(newColor);

    if (mode === 'free') {
      if (activeHandle === 1) {
        onColorsChange(newColor, color2);
      } else {
        onColorsChange(color1, newColor);
      }
    } else {
      onColorsChange(newColor, getBestColorPair(newColor));
    }
  };

  const handleMouseDown = (handle: 1 | 2) => {
    setActiveHandle(handle);
    setSelectedColor(handle === 1 ? color1 : color2);
  };

  const handleRecommendedSchemeSelect = (scheme: RecommendedColors) => {
    if (scheme.colors.length > 0) {
      onColorsChange(selectedColor, scheme.colors[0]);
    }
  };

  const renderColorWheel = () => {
    const segments = 36;
    const gradientStops = [];

    for (let i = 0; i <= 360; i += 10) {
      const color = hslToHex(i, 100, 50);
      gradientStops.push(`${color} ${i}deg`);
    }

    const conicGradient = `conic-gradient(${gradientStops.join(', ')})`;

    return (
      <div className="relative w-full aspect-square">
        <div
          ref={wheelRef}
          className="absolute inset-0 rounded-full cursor-crosshair"
          style={{
            background: conicGradient,
            boxShadow: 'inset 0 0 50px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.2)'
          }}
          onMouseDown={(e) => {
            if (mode === 'free') {
              const rect = wheelRef.current?.getBoundingClientRect();
              if (rect) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const dist1 = getDistance(x, y, centerX, centerY);
                
                const hsl1 = hexToHsl(color1);
                const angle1 = hsl1.h;
                const x1 = centerX + (hsl1.s / 100) * (centerX) * Math.cos(angle1 * Math.PI / 180);
                const y1 = centerY + (hsl1.s / 100) * (centerY) * Math.sin(angle1 * Math.PI / 180);
                const handle1Dist = getDistance(x, y, x1, y1);
                
                const hsl2 = hexToHsl(color2);
                const angle2 = hsl2.h;
                const x2 = centerX + (hsl2.s / 100) * (centerX) * Math.cos(angle2 * Math.PI / 180);
                const y2 = centerY + (hsl2.s / 100) * (centerY) * Math.sin(angle2 * Math.PI / 180);
                const handle2Dist = getDistance(x, y, x2, y2);
                
                if (handle1Dist < handle2Dist && handle1Dist < 30) {
                  handleMouseDown(1);
                } else if (handle2Dist < 30) {
                  handleMouseDown(2);
                } else {
                  handleMouseDown(1);
                  handleWheelInteraction(e);
                }
              }
            } else {
              handleMouseDown(1);
              handleWheelInteraction(e);
            }
          }}
          onMouseMove={(e) => {
            if (e.buttons === 1) {
              handleWheelInteraction(e);
            }
          }}
          onTouchStart={handleWheelInteraction}
          onTouchMove={handleWheelInteraction}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, white 0%, transparent 70%)',
              mixBlendMode: 'screen'
            }}
          />
          
          {renderHandle(color1, 1)}
          {mode === 'free' && renderHandle(color2, 2)}
        </div>
      </div>
    );
  };

  const renderHandle = (color: string, handle: 1 | 2) => {
    const hsl = hexToHsl(color);
    const angle = hsl.h;
    const radius = 50;
    const saturationFactor = hsl.s / 100;
    const x = 50 + Math.cos(angle * Math.PI / 180) * radius * saturationFactor;
    const y = 50 + Math.sin(angle * Math.PI / 180) * radius * saturationFactor;

    return (
      <div
        className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          left: `${x}%`,
          top: `${y}%`
        }}
      >
        <div
          className="w-full h-full rounded-full border-4 border-white shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        />
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-black/70 text-white px-2 py-1 rounded whitespace-nowrap">
          {handle === 1 ? 'Color 1' : 'Color 2'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">Color Wheel</h3>
        <div className="flex gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={mode === 'free' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('free')}
            className="text-xs"
          >
            Free
          </Button>
          <Button
            variant={mode === 'recommended' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setMode('recommended');
              onColorsChange(selectedColor, getBestColorPair(selectedColor));
            }}
            className="text-xs"
          >
            Recommended
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-64 h-64 sm:w-80 sm:h-80">
          {renderColorWheel()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Color 1</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color1}
              onChange={(e) => {
                const newColor = e.target.value;
                setSelectedColor(newColor);
                if (mode === 'recommended') {
                  onColorsChange(newColor, getBestColorPair(newColor));
                } else {
                  onColorsChange(newColor, color2);
                }
              }}
              className="w-12 h-10 p-1 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={color1.toUpperCase()}
              onChange={(e) => {
                const newColor = e.target.value;
                setSelectedColor(newColor);
                if (mode === 'recommended') {
                  onColorsChange(newColor, getBestColorPair(newColor));
                } else {
                  onColorsChange(newColor, color2);
                }
              }}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Color 2</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color2}
              onChange={(e) => {
                if (mode === 'free') {
                  onColorsChange(color1, e.target.value);
                }
              }}
              disabled={mode !== 'free'}
              className="w-12 h-10 p-1 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={color2.toUpperCase()}
              onChange={(e) => {
                if (mode === 'free') {
                  onColorsChange(color1, e.target.value);
                }
              }}
              disabled={mode !== 'free'}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {mode === 'recommended' && (
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">Recommended Schemes</label>
          <div className="grid grid-cols-2 gap-3">
            {recommendedSchemes.map((scheme, index) => (
              <button
                key={scheme.type}
                onClick={() => handleRecommendedSchemeSelect(scheme)}
                className="group relative overflow-hidden rounded-lg aspect-[3/1] border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${selectedColor}, ${scheme.colors[0] || selectedColor})`
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-xs font-medium text-white drop-shadow-sm">
                    {scheme.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="w-full h-16 rounded-xl border-2 border-border overflow-hidden shadow-inner"
        style={{
          background: `linear-gradient(135deg, ${color1}, ${color2})`
        }}
      />
    </div>
  );
};
