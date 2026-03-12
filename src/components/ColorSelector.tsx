'use client';

import React, { useState } from 'react';
import { ColorWheel } from './ColorWheel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getColorHarmonies,
  getRecommendedPair,
  hslToHex
} from '@/lib/colorHarmony';
import { Sparkles, MousePointer2, RefreshCw, Palette } from 'lucide-react';

interface ColorSelectorProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  className?: string;
}

type SelectionMode = 'free' | 'recommend';

export function ColorSelector({
  colors,
  onColorsChange,
  className
}: ColorSelectorProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [color1, setColor1] = useState(colors[0] || '#5135FF');
  const [color2, setColor2] = useState(colors[1] || '#FF5828');
  const [showHarmonies, setShowHarmonies] = useState(false);

  const harmonies = getColorHarmonies(color1);

  const handleColor1Change = (newColor: string) => {
    setColor1(newColor);
    if (mode === 'recommend') {
      const recommended = getRecommendedPair(newColor);
      setColor2(recommended);
      onColorsChange([newColor, recommended, ...colors.slice(2)]);
    } else {
      onColorsChange([newColor, color2, ...colors.slice(2)]);
    }
  };

  const handleColor2Change = (newColor: string) => {
    setColor2(newColor);
    onColorsChange([color1, newColor, ...colors.slice(2)]);
  };

  const handleModeChange = (newMode: SelectionMode) => {
    setMode(newMode);
    if (newMode === 'recommend') {
      const recommended = getRecommendedPair(color1);
      setColor2(recommended);
      onColorsChange([color1, recommended, ...colors.slice(2)]);
    }
  };

  const randomizeColors = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const newColor1 = hslToHex({ h: randomHue, s: 80, l: 50 });
    const newColor2 =
      mode === 'recommend'
        ? getRecommendedPair(newColor1)
        : hslToHex({ h: (randomHue + 180) % 360, s: 80, l: 50 });

    setColor1(newColor1);
    setColor2(newColor2);
    onColorsChange([newColor1, newColor2, ...colors.slice(2)]);
  };

  const applyHarmony = (harmonyColors: string[]) => {
    if (harmonyColors.length >= 2) {
      setColor1(harmonyColors[0]);
      setColor2(harmonyColors[1]);
      onColorsChange([...harmonyColors, ...colors.slice(harmonyColors.length)]);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">色彩选择</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={randomizeColors}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          随机
        </Button>
      </div>

      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => handleModeChange('free')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all',
            mode === 'free'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <MousePointer2 className="w-4 h-4" />
          自由选择
        </button>
        <button
          onClick={() => handleModeChange('recommend')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all',
            mode === 'recommend'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Sparkles className="w-4 h-4" />
          推荐选择
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <ColorWheel
          color1={color1}
          color2={color2}
          onColor1Change={handleColor1Change}
          onColor2Change={handleColor2Change}
          mode={mode}
        />

        <div className="flex gap-4 w-full">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              主色
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                style={{ backgroundColor: color1 }}
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => handleColor1Change(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-mono bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === 'recommend' ? '推荐色' : '副色'}
            </label>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg border-2 shadow-sm',
                  mode === 'recommend'
                    ? 'border-primary/50'
                    : 'border-border'
                )}
                style={{ backgroundColor: color2 }}
              />
              <input
                type="text"
                value={color2}
                onChange={(e) =>
                  mode === 'free' && handleColor2Change(e.target.value)
                }
                disabled={mode === 'recommend'}
                className={cn(
                  'flex-1 px-3 py-2 text-sm font-mono bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
                  mode === 'recommend' && 'opacity-60 cursor-not-allowed'
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowHarmonies(!showHarmonies)}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          {showHarmonies ? '隐藏' : '显示'} 色彩和谐方案
        </button>

        {showHarmonies && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {harmonies.map((harmony) => (
              <div
                key={harmony.name}
                className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                onClick={() => applyHarmony(harmony.colors)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{harmony.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {harmony.description}
                  </span>
                </div>
                <div className="flex gap-2">
                  {harmony.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-8 rounded-md shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
