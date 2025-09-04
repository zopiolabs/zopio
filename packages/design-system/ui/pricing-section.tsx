/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Switch } from "./switch";
import { Label } from "./label";
import { NumberFlow } from "./number-flow";

const pricingSectionVariants = cva(
  "w-full py-16 px-4",
  {
    variants: {
      variant: {
        default: "bg-background",
        gradient: "bg-gradient-to-br from-background to-muted/20",
        dark: "bg-slate-900 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const pricingCardVariants = cva(
  "relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      popular: {
        true: "border-primary shadow-lg scale-105 bg-gradient-to-br from-card to-primary/5",
        false: "border-border hover:shadow-md hover:scale-[1.02]",
      },
    },
    defaultVariants: {
      popular: false,
    },
  }
);

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  popular?: boolean;
  onSelect?: () => void;
}

export interface PricingSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 
    | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop'
    | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
    | 'onTransitionEnd'
  >,
    VariantProps<typeof pricingSectionVariants> {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  showYearlyToggle?: boolean;
  yearlyDiscount?: number;
  onPlanSelect?: (plan: PricingPlan) => void;
}

const PricingSection = React.forwardRef<HTMLDivElement, PricingSectionProps>(
  (
    {
      className,
      variant,
      title = "Simple, Transparent Pricing",
      subtitle = "Choose the plan that works for you",
      plans,
      showYearlyToggle = true,
      yearlyDiscount = 20,
      onPlanSelect,
      ...props
    },
    ref
  ) => {
    const [isYearly, setIsYearly] = React.useState(false);

    const handleToggleChange = (checked: boolean) => {
      setIsYearly(checked);
    };

    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

    const getEffectivePrice = (plan: PricingPlan): number => {
      if (isYearly) {
        return Math.round(plan.yearlyPrice * (1 - yearlyDiscount / 100));
      }
      return plan.monthlyPrice;
    };

    const handlePlanSelect = (plan: PricingPlan) => {
      plan.onSelect?.();
      onPlanSelect?.(plan);
    };

    return (
      <div
        ref={ref}
        className={cn(pricingSectionVariants({ variant }), className)}
        {...props}
      >
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
            
            {/* Yearly Toggle */}
            {showYearlyToggle && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Label htmlFor="yearly-toggle" className="text-sm font-medium">
                  Monthly
                </Label>
                <Switch
                  id="yearly-toggle"
                  checked={isYearly}
                  onCheckedChange={handleToggleChange}
                />
                <Label htmlFor="yearly-toggle" className="text-sm font-medium flex items-center gap-2">
                  Yearly
                  <Badge variant="secondary" className="text-xs">
                    Save {yearlyDiscount}%
                  </Badge>
                </Label>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={cn(pricingCardVariants({ popular: plan.popular }), "hover:-translate-y-1 transition-transform duration-200")}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="p-6 space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <NumberFlow
                        value={getEffectivePrice(plan)}
                        format="currency"
                        className="text-3xl font-bold"
                      />
                      <span className="text-muted-foreground">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground">
                        Billed annually ({formatPrice(plan.yearlyPrice)}/year)
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        <Check 
                          className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            feature.included 
                              ? "text-green-500" 
                              : "text-muted-foreground/50"
                          )} 
                        />
                        <span 
                          className={cn(
                            "text-sm",
                            feature.included 
                              ? "text-foreground" 
                              : "text-muted-foreground/70 line-through"
                          )}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full"
                    variant={plan.buttonVariant || (plan.popular ? "default" : "outline")}
                    size="lg"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              All plans include access to our platform, lead generation tools, and dedicated support.
            </p>
          </div>
        </div>

      </div>
    );
  }
);

PricingSection.displayName = "PricingSection";

export { PricingSection, pricingSectionVariants };
