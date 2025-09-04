/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Copy, Check, Pipette } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const colorPickerVariants = cva("relative", {
  variants: {
    size: {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  alpha: number;
}

interface ColorPickerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof colorPickerVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (color: string) => void;
  disabled?: boolean;
  showEyeDropper?: boolean;
  showAlpha?: boolean;
  format?: "hex" | "rgb" | "hsl";
}

// Color conversion utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
};

const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h >= 1/6 && h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h >= 2/6 && h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h >= 3/6 && h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h >= 4/6 && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (h >= 5/6 && h < 1) {
    r = c; g = 0; b = x;
  }

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
};

const ColorPicker = React.forwardRef<HTMLButtonElement, ColorPickerProps>(
  (
    {
      className,
      size,
      value,
      defaultValue = "#000000",
      onValueChange,
      disabled = false,
      showEyeDropper = true,
      showAlpha = false,
      format = "hex",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const currentColor = value !== undefined ? value : internalValue;
    const rgb = hexToRgb(currentColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    const [hue, setHue] = React.useState(hsv.h);
    const [saturation, setSaturation] = React.useState(hsv.s);
    const [brightness, setBrightness] = React.useState(hsv.v);
    const [alpha, setAlpha] = React.useState(1);

    const handleColorChange = (newColor: string) => {
      if (value === undefined) {
        setInternalValue(newColor);
      }
      onValueChange?.(newColor);
    };

    const updateColorFromHsv = (h: number, s: number, v: number) => {
      const rgb = hsvToRgb(h, s, v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      handleColorChange(hex);
    };

    const handleSaturationBrightnessChange = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newSaturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const newBrightness = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
      
      setSaturation(newSaturation);
      setBrightness(newBrightness);
      updateColorFromHsv(hue, newSaturation, newBrightness);
    };

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHue = parseInt(e.target.value);
      setHue(newHue);
      updateColorFromHsv(newHue, saturation, brightness);
    };

    const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAlpha = parseFloat(e.target.value);
      setAlpha(newAlpha);
    };

    const formatColor = (color: string): string => {
      const rgb = hexToRgb(color);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      switch (format) {
        case "rgb":
          return showAlpha 
            ? `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${alpha})`
            : `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
        case "hsl":
          return showAlpha
            ? `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${alpha})`
            : `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        default:
          return color;
      }
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(formatColor(currentColor));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy color:', err);
      }
    };

    const handleEyeDropper = async () => {
      if (!('EyeDropper' in window)) {
        console.warn('EyeDropper API not supported');
        return;
      }

      try {
        // @ts-ignore - EyeDropper is not in TypeScript types yet
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        handleColorChange(result.sRGBHex);
      } catch (err) {
        console.error('EyeDropper failed:', err);
      }
    };

    React.useEffect(() => {
      const rgb = hexToRgb(currentColor);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setBrightness(hsv.v);
    }, [currentColor]);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            className={cn(
              colorPickerVariants({ size, className }),
              "rounded border-2 border-border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            style={{ backgroundColor: currentColor }}
            disabled={disabled}
            aria-label="Open color picker"
            {...props}
          />
        </PopoverTrigger>
        
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            {/* Color Area */}
            <div className="relative">
              <div
                className="w-full h-32 rounded cursor-crosshair"
                style={{
                  background: `linear-gradient(to right, white, hsl(${hue}, 100%, 50%)), 
                              linear-gradient(to top, black, transparent)`,
                  backgroundBlendMode: 'multiply, normal'
                }}
                onClick={handleSaturationBrightnessChange}
              >
                <div
                  className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none"
                  style={{
                    left: `${(saturation / 100) * 100}%`,
                    top: `${100 - (brightness / 100) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
            </div>

            {/* Hue Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hue</label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={handleHueChange}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                }}
              />
            </div>

            {/* Alpha Slider */}
            {showAlpha && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Alpha</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={alpha}
                  onChange={handleAlphaChange}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-transparent to-current"
                  style={{ color: currentColor }}
                />
              </div>
            )}

            {/* Color Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Value</label>
              <div className="flex gap-2">
                <Input
                  value={formatColor(currentColor)}
                  onChange={(e) => {
                    if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                      handleColorChange(e.target.value);
                    }
                  }}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="px-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* EyeDropper */}
            {showEyeDropper && 'EyeDropper' in window && (
              <Button
                variant="outline"
                onClick={handleEyeDropper}
                className="w-full"
              >
                <Pipette className="h-4 w-4 mr-2" />
                Pick from screen
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker, colorPickerVariants };
export type { ColorPickerProps, ColorValue };
