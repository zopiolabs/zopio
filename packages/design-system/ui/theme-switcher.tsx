/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "../lib/utils";

const themeSwitcherVariants = cva(
  "relative inline-flex items-center rounded-full border bg-background p-1 transition-colors",
  {
    variants: {
      size: {
        sm: "h-8 w-20",
        md: "h-10 w-24",
        lg: "h-12 w-28",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const themeButtonVariants = cva(
  "relative z-10 flex items-center justify-center rounded-full transition-colors",
  {
    variants: {
      size: {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
      },
      active: {
        true: "text-primary-foreground",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      active: false,
    },
  }
);

type Theme = "light" | "dark" | "system";

interface ThemeSwitcherProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof themeSwitcherVariants> {
  value?: Theme;
  defaultValue?: Theme;
  onValueChange?: (theme: Theme) => void;
  disabled?: boolean;
}

const ThemeSwitcher = React.forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  (
    {
      className,
      size,
      value,
      defaultValue = "system",
      onValueChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<Theme>(
      value || defaultValue
    );

    const currentTheme = value !== undefined ? value : internalValue;

    const handleThemeChange = (theme: Theme) => {
      if (disabled) return;
      
      if (value === undefined) {
        setInternalValue(theme);
      }
      onValueChange?.(theme);
    };

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const themes: Array<{ value: Theme; icon: React.ReactNode; label: string }> = [
      { value: "light", icon: <Sun className="h-4 w-4" />, label: "Light" },
      { value: "dark", icon: <Moon className="h-4 w-4" />, label: "Dark" },
      { value: "system", icon: <Monitor className="h-4 w-4" />, label: "System" },
    ];

    const activeIndex = themes.findIndex((theme) => theme.value === currentTheme);

    return (
      <div
        ref={ref}
        className={cn(
          themeSwitcherVariants({ size, className }),
          disabled && "opacity-50 cursor-not-allowed"
        )}
        role="radiogroup"
        aria-label="Theme selection"
        {...props}
      >
        {/* Background indicator */}
        <div
          className="absolute inset-1 rounded-full bg-primary transition-transform duration-200 ease-in-out"
          style={{
            width: "calc(33.333% - 0.125rem)",
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {/* Theme buttons */}
        {themes.map((theme) => (
          <button
            key={theme.value}
            type="button"
            className={cn(
              themeButtonVariants({
                size,
                active: currentTheme === theme.value,
              })
            )}
            onClick={() => handleThemeChange(theme.value)}
            disabled={disabled}
            role="radio"
            aria-checked={currentTheme === theme.value}
            aria-label={`Switch to ${theme.label} theme`}
            title={`${theme.label} theme`}
          >
            {theme.icon}
          </button>
        ))}
      </div>
    );
  }
);

ThemeSwitcher.displayName = "ThemeSwitcher";

// Hook for theme management
interface UseThemeOptions {
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
}

const useTheme = ({
  defaultTheme = "system",
  storageKey = "theme",
  enableSystem = true,
}: UseThemeOptions = {}) => {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  // Load theme from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme;
      if (stored && ["light", "dark", "system"].includes(stored)) {
        setTheme(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey]);

  // Apply theme to document
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    let effectiveTheme: "light" | "dark" = "light";
    
    if (theme === "system" && enableSystem) {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = theme === "dark" ? "dark" : "light";
    }

    setResolvedTheme(effectiveTheme);

    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);
  }, [theme, enableSystem]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, enableSystem]);

  const setThemeWithStorage = React.useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Ignore localStorage errors
      }
    },
    [storageKey]
  );

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWithStorage,
  };
};

// Theme provider component
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
}

const ThemeContext = React.createContext<{
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
} | null>(null);

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  enableSystem = true,
}) => {
  const themeState = useTheme({ defaultTheme, storageKey, enableSystem });

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export {
  ThemeSwitcher,
  ThemeProvider,
  useTheme,
  useThemeContext,
  themeSwitcherVariants,
};
export type { ThemeSwitcherProps, Theme, UseThemeOptions, ThemeProviderProps };
