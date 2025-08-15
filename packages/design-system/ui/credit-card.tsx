/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CreditCard as CreditCardIcon, Eye, EyeOff } from "lucide-react";
import { cn } from "../lib/utils";

const creditCardVariants = cva(
  "relative overflow-hidden rounded-xl bg-gradient-to-br shadow-lg",
  {
    variants: {
      variant: {
        visa: "from-blue-600 to-blue-800 text-white",
        mastercard: "from-red-600 to-orange-600 text-white",
        amex: "from-green-600 to-green-800 text-white",
        discover: "from-orange-500 to-orange-700 text-white",
        default: "from-gray-700 to-gray-900 text-white",
        dark: "from-black to-gray-800 text-white",
        light: "from-gray-100 to-gray-300 text-gray-900 border",
      },
      size: {
        sm: "w-64 h-40 text-xs",
        md: "w-80 h-48 text-sm",
        lg: "w-96 h-60 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface CreditCardContextValue {
  showSensitive: boolean;
  setShowSensitive: (show: boolean) => void;
  cardData: {
    number?: string;
    name?: string;
    expiry?: string;
    cvv?: string;
    type?: string;
  };
}

const CreditCardContext = React.createContext<CreditCardContextValue | null>(null);

interface CreditCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof creditCardVariants> {
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
  showSensitive?: boolean;
  onToggleSensitive?: (show: boolean) => void;
  flipped?: boolean;
}

const CreditCard = React.forwardRef<HTMLDivElement, CreditCardProps>(
  (
    {
      className,
      variant,
      size,
      children,
      number = "•••• •••• •••• ••••",
      name = "CARDHOLDER NAME",
      expiry = "MM/YY",
      cvv = "•••",
      showSensitive = false,
      onToggleSensitive,
      flipped = false,
      ...props
    },
    ref
  ) => {
    const [internalShowSensitive, setInternalShowSensitive] = React.useState(showSensitive);

    const handleToggleSensitive = React.useCallback(
      (show: boolean) => {
        setInternalShowSensitive(show);
        onToggleSensitive?.(show);
      },
      [onToggleSensitive]
    );

    // Detect card type from number
    const detectCardType = (cardNumber: string) => {
      const cleaned = cardNumber.replace(/\D/g, '');
      if (cleaned.startsWith('4')) return 'visa';
      if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
      if (cleaned.startsWith('3')) return 'amex';
      if (cleaned.startsWith('6')) return 'discover';
      return 'default';
    };

    const cardType = detectCardType(number);
    const actualVariant = variant || cardType;

    const contextValue = React.useMemo(
      () => ({
        showSensitive: internalShowSensitive,
        setShowSensitive: handleToggleSensitive,
        cardData: {
          number,
          name,
          expiry,
          cvv,
          type: cardType,
        },
      }),
      [internalShowSensitive, handleToggleSensitive, number, name, expiry, cvv, cardType]
    );

    return (
      <CreditCardContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            creditCardVariants({ variant: actualVariant, size, className }),
            "transition-transform duration-700 transform-gpu",
            flipped && "rotate-y-180"
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
          {...props}
        >
          {children || (
            <>
              <CreditCardFront />
              <CreditCardBack />
            </>
          )}
        </div>
      </CreditCardContext.Provider>
    );
  }
);

CreditCard.displayName = "CreditCard";

// Credit Card Front
interface CreditCardFrontProps extends React.HTMLAttributes<HTMLDivElement> {}

const CreditCardFront = React.forwardRef<HTMLDivElement, CreditCardFrontProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CreditCardContext);

    if (!context) {
      throw new Error("CreditCardFront must be used within a CreditCard");
    }

    const { showSensitive, cardData } = context;

    const formatCardNumber = (number: string) => {
      if (!showSensitive && number !== "•••• •••• •••• ••••") {
        const cleaned = number.replace(/\D/g, '');
        const lastFour = cleaned.slice(-4);
        return `•••• •••• •••• ${lastFour}`;
      }
      return number.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const getCardIcon = (type: string) => {
      switch (type) {
        case 'visa':
          return <div className="text-xl font-bold">VISA</div>;
        case 'mastercard':
          return <div className="text-xl font-bold">MC</div>;
        case 'amex':
          return <div className="text-xl font-bold">AMEX</div>;
        case 'discover':
          return <div className="text-xl font-bold">DISCOVER</div>;
        default:
          return <CreditCardIcon className="h-8 w-8" />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 p-6 flex flex-col justify-between backface-hidden",
          className
        )}
        {...props}
      >
        {children || (
          <>
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="opacity-80">
                <div className="text-xs uppercase tracking-wide">Credit Card</div>
              </div>
              <div className="opacity-90">
                {getCardIcon(cardData.type || 'default')}
              </div>
            </div>

            {/* Chip */}
            <div className="flex items-center">
              <div className="w-12 h-8 bg-yellow-400 rounded-md mr-4 opacity-90">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md flex items-center justify-center">
                  <div className="w-8 h-6 bg-yellow-500 rounded-sm"></div>
                </div>
              </div>
              <div className="text-xs opacity-60">CHIP</div>
            </div>

            {/* Card Number */}
            <div className="space-y-1">
              <div className="text-lg md:text-xl lg:text-2xl font-mono tracking-wider">
                {formatCardNumber(cardData.number || "•••• •••• •••• ••••")}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="text-xs opacity-60 uppercase tracking-wide">
                  Cardholder Name
                </div>
                <div className="text-sm md:text-base font-medium uppercase tracking-wide">
                  {cardData.name || "CARDHOLDER NAME"}
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs opacity-60 uppercase tracking-wide">
                  Valid Thru
                </div>
                <div className="text-sm md:text-base font-mono">
                  {cardData.expiry || "MM/YY"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

CreditCardFront.displayName = "CreditCardFront";

// Credit Card Back
interface CreditCardBackProps extends React.HTMLAttributes<HTMLDivElement> {}

const CreditCardBack = React.forwardRef<HTMLDivElement, CreditCardBackProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CreditCardContext);

    if (!context) {
      throw new Error("CreditCardBack must be used within a CreditCard");
    }

    const { showSensitive, cardData } = context;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 p-6 flex flex-col justify-between backface-hidden rotate-y-180",
          className
        )}
        {...props}
      >
        {children || (
          <>
            {/* Magnetic Stripe */}
            <div className="w-full h-12 bg-black -mx-6 mt-4"></div>

            {/* Signature Strip and CVV */}
            <div className="space-y-4">
              <div className="w-full h-8 bg-white -mx-6 relative">
                <div className="absolute right-6 top-0 h-full flex items-center">
                  <div className="bg-white text-black px-2 py-1 text-xs font-mono border-l border-gray-300">
                    {showSensitive ? cardData.cvv || "•••" : "•••"}
                  </div>
                </div>
              </div>
              
              <div className="text-xs opacity-60 text-right">
                CVV/CVC Security Code
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-2 text-xs opacity-60">
              <div>
                This card is property of the issuing bank. If found, please return to any branch.
              </div>
              <div>
                For customer service, call the number on the front of your card.
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

CreditCardBack.displayName = "CreditCardBack";

// Credit Card Number
interface CreditCardNumberProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  masked?: boolean;
}

const CreditCardNumber = React.forwardRef<HTMLDivElement, CreditCardNumberProps>(
  ({ className, value, masked = true, ...props }, ref) => {
    const context = React.useContext(CreditCardContext);

    if (!context) {
      throw new Error("CreditCardNumber must be used within a CreditCard");
    }

    const { showSensitive, cardData } = context;
    const number = value || cardData.number || "•••• •••• •••• ••••";

    const formatNumber = (num: string) => {
      if (masked && !showSensitive && num !== "•••• •••• •••• ••••") {
        const cleaned = num.replace(/\D/g, '');
        const lastFour = cleaned.slice(-4);
        return `•••• •••• •••• ${lastFour}`;
      }
      return num.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    return (
      <div
        ref={ref}
        className={cn("text-lg md:text-xl lg:text-2xl font-mono tracking-wider", className)}
        {...props}
      >
        {formatNumber(number)}
      </div>
    );
  }
);

CreditCardNumber.displayName = "CreditCardNumber";

// Credit Card Controls
interface CreditCardControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const CreditCardControls = React.forwardRef<HTMLDivElement, CreditCardControlsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 mt-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CreditCardControls.displayName = "CreditCardControls";

// Toggle Sensitive Button
interface ToggleSensitiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ToggleSensitiveButton = React.forwardRef<HTMLButtonElement, ToggleSensitiveButtonProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CreditCardContext);

    if (!context) {
      throw new Error("ToggleSensitiveButton must be used within a CreditCard");
    }

    const { showSensitive, setShowSensitive } = context;

    const handleToggle = () => {
      setShowSensitive(!showSensitive);
    };

    return (
      <button
        ref={ref}
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3",
          className
        )}
        {...props}
      >
        {children || (
          <>
            {showSensitive ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {showSensitive ? "Hide" : "Show"} Details
          </>
        )}
      </button>
    );
  }
);

ToggleSensitiveButton.displayName = "ToggleSensitiveButton";

// Flip Card Button
interface FlipCardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

const FlipCardButton = React.forwardRef<HTMLButtonElement, FlipCardButtonProps>(
  ({ className, children, flipped = false, onFlip, ...props }, ref) => {
    const [isFlipped, setIsFlipped] = React.useState(flipped);

    const handleFlip = () => {
      const newFlipped = !isFlipped;
      setIsFlipped(newFlipped);
      onFlip?.(newFlipped);
    };

    return (
      <button
        ref={ref}
        onClick={handleFlip}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3",
          className
        )}
        {...props}
      >
        {children || (
          <>
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Flip Card
          </>
        )}
      </button>
    );
  }
);

FlipCardButton.displayName = "FlipCardButton";

// Utility function to format card number
const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  return formatted;
};

// Utility function to format expiry date
const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

// Hook for accessing credit card context
const useCreditCard = () => {
  const context = React.useContext(CreditCardContext);
  if (!context) {
    throw new Error("useCreditCard must be used within a CreditCard component");
  }
  return context;
};

export {
  CreditCard,
  CreditCardFront,
  CreditCardBack,
  CreditCardNumber,
  CreditCardControls,
  ToggleSensitiveButton,
  FlipCardButton,
  useCreditCard,
  formatCardNumber,
  formatExpiryDate,
  creditCardVariants,
};

export type {
  CreditCardProps,
  CreditCardFrontProps,
  CreditCardBackProps,
  CreditCardNumberProps,
  CreditCardControlsProps,
  ToggleSensitiveButtonProps,
  FlipCardButtonProps,
  CreditCardContextValue,
};
