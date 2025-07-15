/**
 * SPDX-License-Identifier: MIT
 */

import { ThemeProvider } from '@repo/design-system/providers/theme';
import { Toaster } from '@repo/design-system/ui/sonner';
import { TooltipProvider } from '@repo/design-system/ui/tooltip';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs';

// Import styles
import '@repo/design-system/styles/globals.css';
import '../styles/storybook.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chromatic: {
      modes: {
        light: {
          theme: 'light',
          className: 'light',
        },
        dark: {
          theme: 'dark',
          className: 'dark',
        },
      },
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => {
      return (
        <div className="bg-background">
          <ThemeProvider>
            <TooltipProvider>
              <Story />
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </div>
      );
    },
  ],

  tags: ['autodocs'],
};

export default preview;
