/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@repo/design-system/lib/utils';

// Default logos using Lucide icons
import {
  Github,
  Twitter,
  Figma,
  Slack,
  Chrome,
  Dribbble,
  Framer,
  Codepen,
  Codesandbox,
  Gitlab,
  LucideProps
} from 'lucide-react';

// Default cycle duration in milliseconds
const CYCLE_DURATION = 2000;

// Define the Logo interface
export interface Logo {
  id: number;
  name: string;
  icon: React.ComponentType<LucideProps>;
}

// Default logos array
const defaultLogos: Logo[] = [
  { id: 1, name: 'Github', icon: Github },
  { id: 2, name: 'Twitter', icon: Twitter },
  { id: 3, name: 'Figma', icon: Figma },
  { id: 4, name: 'Slack', icon: Slack },
  { id: 5, name: 'Gitlab', icon: Gitlab },
  { id: 6, name: 'Chrome', icon: Chrome },
  { id: 7, name: 'Dribbble', icon: Dribbble },
  { id: 8, name: 'Framer', icon: Framer },
  { id: 9, name: 'Codepen', icon: Codepen },
  { id: 10, name: 'Codesandbox', icon: Codesandbox },
];

export interface LogoCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns to display
   * @default 2
   */
  columns?: number;
  /**
   * Custom logos to display
   */
  logos?: Logo[];
  /**
   * Custom cycle duration in milliseconds
   * @default 2000
   */
  cycleDuration?: number;
  /**
   * Whether to use spring animation
   * @default true
   */
  useSpring?: boolean;
  /**
   * Spring stiffness (only used if useSpring is true)
   * @default 300
   */
  springStiffness?: number;
  /**
   * Spring damping (only used if useSpring is true)
   * @default 20
   */
  springDamping?: number;
  /**
   * Logo size in pixels
   * @default 24
   */
  logoSize?: number;
  /**
   * Logo color
   * @default "currentColor"
   */
  logoColor?: string;
}

/**
 * LogoCarousel component
 *
 * A smooth, animated way to showcase logos in multiple columns.
 * Perfect for partner showcases, client logos, and brand displays.
 */
export function LogoCarousel({
  columns = 2,
  logos = defaultLogos,
  cycleDuration = CYCLE_DURATION,
  useSpring = true,
  springStiffness = 300,
  springDamping = 20,
  logoSize = 24,
  logoColor = "currentColor",
  className,
  ...props
}: LogoCarouselProps) {
  const [visibleLogos, setVisibleLogos] = React.useState<Logo[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  // Check for reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Initialize visible logos
  React.useEffect(() => {
    if (logos.length === 0) return;

    // Initial random selection of logos based on column count
    const initialLogos = getRandomLogos(logos, columns);
    setVisibleLogos(initialLogos);

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) return;

    // Set up cycling interval
    const interval = setInterval(() => {
      setVisibleLogos((currentLogos) => {
        const newLogos = [...currentLogos];
        const randomIndex = Math.floor(Math.random() * columns);
        const availableLogos = logos.filter(
          (logo) => !currentLogos.some((l) => l.id === logo.id)
        );

        // If all logos are currently shown, get a random one
        const replacementLogo = availableLogos.length > 0
          ? availableLogos[Math.floor(Math.random() * availableLogos.length)]
          : logos[Math.floor(Math.random() * logos.length)];

        newLogos[randomIndex] = replacementLogo;
        return newLogos;
      });
    }, cycleDuration);

    return () => clearInterval(interval);
  }, [logos, columns, cycleDuration, prefersReducedMotion]);

  // Helper function to get random logos
  const getRandomLogos = (logoArray: Logo[], count: number): Logo[] => {
    const shuffled = [...logoArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Animation configuration
  const transition = useSpring
    ? {
        type: "spring" as const,
        stiffness: springStiffness,
        damping: springDamping,
      }
    : {
        duration: 0.3,
        ease: "easeInOut" as const,
      };

  return (
    <div
      className={cn("flex items-center justify-center gap-8 md:gap-12 lg:gap-16", className)}
      data-slot="logo-carousel"
      {...props}
    >
      {visibleLogos.map((logo) => (
        <div
          key={`${logo.id}-${logo.name}`}
          className="relative h-14 md:h-24 overflow-hidden w-24 md:w-48"
          aria-label={logo.name}
        >
          <motion.div
            key={logo.id}
            initial={prefersReducedMotion ? { opacity: 1, y: "0%" } : { opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={transition}
            className="flex h-full items-center justify-center w-full"
          >
            {React.createElement(logo.icon, {
              size: logoSize,
              color: logoColor,
              strokeWidth: 1.5,
              className: "hover:opacity-100 opacity-80 transition-opacity",
              "aria-hidden": "true",
            })}
            <span className="sr-only">{logo.name}</span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
