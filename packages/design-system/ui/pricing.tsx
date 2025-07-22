/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from "../lib/utils";
import { Check, Star } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Simple confetti particle component
interface ConfettiParticleProps {
  color: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({ color, x, y, size, speed, delay }) => {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animation: `fall ${speed}s ease-in ${delay}s forwards`,
        opacity: 0,
      }}
    />
  );
};

// Confetti container component
interface ConfettiProps {
  active: boolean;
  originX: number;
  originY: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active, originX, originY }) => {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--secondary))",
    "hsl(var(--muted))",
  ];
  
  if (!active) return null;
  
  // Generate 30 confetti particles
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      
      {Array.from({ length: 30 }).map((_, i) => {
        const color = colors[i % colors.length];
        const size = Math.random() * 8 + 4; // 4-12px
        const speed = Math.random() * 3 + 2; // 2-5s
        const delay = Math.random() * 0.5; // 0-0.5s
        const spreadX = (Math.random() - 0.5) * 60; // -30% to +30% from origin
        const spreadY = (Math.random() - 0.5) * 20; // -10% to +10% from origin
        
        return (
          <ConfettiParticle
            key={i}
            color={color}
            x={originX + spreadX}
            y={originY + spreadY}
            size={size}
            speed={speed}
            delay={delay}
          />
        );
      })}
    </div>
  );
};

// Type for Link component to avoid dependency on Next.js
type LinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

// Simple Link component that can be replaced with actual Next.js Link when used
const Link: React.FC<LinkProps> = ({ href, className, children }) => {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular?: boolean;
}

export interface PricingProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  className?: string;
  defaultIsMonthly?: boolean;
  showToggle?: boolean;
  toggleLabel?: string;
  toggleDiscountLabel?: string;
}

export interface PricingCardProps {
  plan: PricingPlan;
  isMonthly: boolean;
  index: number;
  isDesktop: boolean;
}

export interface PricingToggleProps {
  isMonthly: boolean;
  onToggle: (checked: boolean) => void;
  label?: string;
  discountLabel?: string;
}

const PricingToggle = React.forwardRef<HTMLButtonElement, PricingToggleProps>(
  ({ isMonthly, onToggle, label = "Annual billing", discountLabel = "(Save 20%)" }, ref) => {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="font-medium">Monthly</span>
        <button
          ref={ref}
          role="switch"
          aria-checked={!isMonthly}
          onClick={() => onToggle(!isMonthly)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            !isMonthly ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
              !isMonthly ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
        <span className="font-medium">
          {label} {discountLabel && <span className="text-primary">{discountLabel}</span>}
        </span>
      </div>
    );
  }
);

PricingToggle.displayName = "PricingToggle";

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ plan, isMonthly, index, isDesktop }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ y: 50, opacity: 1 }}
        whileInView={
          isDesktop
            ? {
                y: plan.isPopular ? -20 : 0,
                opacity: 1,
                x: index === 2 ? -30 : index === 0 ? 30 : 0,
                scale: index === 0 || index === 2 ? 0.94 : 1.0,
              }
            : {}
        }
        viewport={{ once: true }}
        transition={{
          duration: 1.6,
          type: "spring",
          stiffness: 100,
          damping: 30,
          delay: 0.4,
          opacity: { duration: 0.5 },
        }}
        className={cn(
          "rounded-2xl border-[1px] p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative",
          plan.isPopular ? "border-primary border-2" : "border-border",
          "flex flex-col",
          !plan.isPopular && "mt-5",
          index === 0 || index === 2
            ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
            : "z-10",
          index === 0 && "origin-right",
          index === 2 && "origin-left"
        )}
      >
        {plan.isPopular && (
          <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
            <Star className="h-3 w-3 text-primary-foreground" />
            <span className="text-primary-foreground ml-1 font-sans font-semibold">
              Popular
            </span>
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <p className="text-base font-semibold text-muted-foreground">
            {plan.name}
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-foreground">
              ${isMonthly ? plan.price : plan.yearlyPrice}
            </span>
            {plan.period !== "Next 3 months" && (
              <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                / {plan.period}
              </span>
            )}
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            {isMonthly ? "billed monthly" : "billed annually"}
          </p>

          <ul className="mt-5 gap-2 flex flex-col">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <hr className="w-full my-4" />

          <Link
            href={plan.href}
            className={cn(
              "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
              "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
              "py-2 px-4 rounded-md",
              plan.isPopular
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground border border-input"
            )}
          >
            {plan.buttonText}
          </Link>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            {plan.description}
          </p>
        </div>
      </motion.div>
    );
  }
);

PricingCard.displayName = "PricingCard";

export const Pricing = React.forwardRef<HTMLDivElement, PricingProps>(
  ({ 
    title = "Simple, Transparent Pricing",
    subtitle = "Choose the plan that works for you",
    plans,
    className,
    defaultIsMonthly = true,
    showToggle = true,
    toggleLabel,
    toggleDiscountLabel
  }, ref) => {
    const [isMonthly, setIsMonthly] = useState(defaultIsMonthly);
    const [isDesktop, setIsDesktop] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiOrigin, setConfettiOrigin] = useState({ x: 50, y: 10 });
    const switchRef = useRef<HTMLButtonElement>(null);
    
    // Handle window resize for responsive design
    useEffect(() => {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Set desktop state
        setIsDesktop(window.innerWidth >= 768);
        
        // Add resize listener
        const handleResize = () => {
          setIsDesktop(window.innerWidth >= 768);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }, []);

    // Handle confetti cleanup
    useEffect(() => {
      if (showConfetti) {
        const timer = setTimeout(() => {
          setShowConfetti(false);
        }, 3000); // Hide confetti after 3 seconds
        
        return () => clearTimeout(timer);
      }
    }, [showConfetti]);

    const handleToggle = (checked: boolean) => {
      setIsMonthly(!checked);
      
      // Show confetti effect when switching to annual billing
      if (checked && switchRef.current) {
        const rect = switchRef.current.getBoundingClientRect();
        
        // Calculate position as percentage of viewport
        const x = (rect.left + rect.width / 2) / window.innerWidth * 100;
        const y = (rect.top + rect.height / 2) / window.innerHeight * 100;
        
        setConfettiOrigin({ x, y });
        setShowConfetti(true);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("w-full px-4 py-8 md:py-12 lg:py-16 relative", className)}
      >
        {/* Render confetti effect when toggling to annual */}
        <Confetti 
          active={showConfetti} 
          originX={confettiOrigin.x} 
          originY={confettiOrigin.y} 
        />
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {subtitle}
          </p>
        </div>

        {showToggle && (
          <div className="flex justify-center mb-10">
            <PricingToggle 
              ref={switchRef}
              isMonthly={isMonthly}
              onToggle={handleToggle}
              label={toggleLabel}
              discountLabel={toggleDiscountLabel}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              isMonthly={isMonthly}
              index={index}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </div>
    );
  }
);

Pricing.displayName = "Pricing";
