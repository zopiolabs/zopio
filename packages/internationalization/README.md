# @repo/internationalization

## Overview

The `@repo/internationalization` package provides a comprehensive solution for multilingual support in Zopio applications. Built on top of next-intl and Languine, it offers a type-safe API for translations, locale detection, and internationalized routing with full support for the Next.js App Router.

## Module Categories

### Core Components

- **Locale Detection**: Automatic locale detection based on user preferences
- **Dictionary Management**: Type-safe dictionary loading and management
- **Translation Provider**: React context provider for translations
- **Middleware**: Next.js middleware for internationalized routing

### Utilities

- **Translation Hooks**: React hooks for accessing translations
- **Locale Management**: Utilities for handling locale preferences
- **Message Loading**: Server-side message loading with fallbacks

## Usage Guidelines

### Basic Setup

First, ensure your environment variables are properly configured:

```bash
# .env
DEFAULT_LOCALE=en
```

Add the middleware to your Next.js application:

```tsx
// middleware.ts
export { internationalizationMiddleware as middleware } from '@repo/internationalization/middleware';
```

Wrap your application with the TranslationProvider:

```tsx
// app/[locale]/layout.tsx
import { TranslationProvider } from '@repo/internationalization';
import type { Locale } from '@repo/internationalization';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return (
    <TranslationProvider locale={locale}>
      {children}
    </TranslationProvider>
  );
}
```

### Using Translations

```tsx
// In client components
'use client';

import { useTranslation } from '@repo/internationalization';

export function Greeting() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('greeting.title')}</h1>
      <p>{t('greeting.message')}</p>
    </div>
  );
}

// In server components
import { getDictionary } from '@repo/internationalization';

export default async function ServerComponent({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const dictionary = await getDictionary(locale);
  
  return (
    <div>
      <h1>{dictionary.greeting.title}</h1>
      <p>{dictionary.greeting.message}</p>
    </div>
  );
}
```

### Adding New Translations

Create or update dictionary files in the `dictionaries` directory:

```json
// dictionaries/en.json
{
  "greeting": {
    "title": "Welcome to Zopio",
    "message": "A modern development platform"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}

// dictionaries/es.json
{
  "greeting": {
    "title": "Bienvenido a Zopio",
    "message": "Una plataforma de desarrollo moderna"
  },
  "navigation": {
    "home": "Inicio",
    "about": "Acerca de",
    "contact": "Contacto"
  }
}
```

Then run the translation script to update other language files:

```bash
pnpm translate
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/internationalization
```

## Environment Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `DEFAULT_LOCALE` | Default locale for the application | No | `en` | `en` |

## Development Guidelines

### Adding New Languages

To add a new language:

1. Update the `languine.json` configuration file:

```json
{
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de", "ja"]
  }
}
```

2. Run the translation script to generate initial translations:

```bash
pnpm translate
```

3. Review and refine the machine-translated content in the generated files

### Translation Best Practices

1. Use semantic keys that describe the content's purpose, not its value
2. Organize translations hierarchically by feature or page
3. Use variables for dynamic content: `t('welcome', { name })`
4. Provide context comments for translators when necessary
5. Keep translations concise and clear

### Handling Pluralization

```tsx
// In your dictionary
// en.json
{
  "items": {
    "count": {
      "one": "You have {count} item",
      "other": "You have {count} items"
    }
  }
}

// In your component
import { useTranslation } from '@repo/internationalization';

export function ItemCount({ count }: { count: number }) {
  const { t } = useTranslation();
  
  return (
    <p>{t('items.count', { count })}</p>
  );
}
```

## Integration Examples

### With Next.js App Router

```tsx
// app/[locale]/layout.tsx
import { TranslationProvider } from '@repo/internationalization';
import type { Locale } from '@repo/internationalization';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return (
    <html lang={locale}>
      <body>
        <TranslationProvider locale={locale}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}

// app/[locale]/page.tsx
import { getDictionary } from '@repo/internationalization';
import type { Locale } from '@repo/internationalization';

export default async function HomePage({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
  const dictionary = await getDictionary(locale);
  
  return (
    <div>
      <h1>{dictionary.home.title}</h1>
      <p>{dictionary.home.description}</p>
    </div>
  );
}
```

### Language Switcher Component

```tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { locales, useTranslation } from '@repo/internationalization';
import { Button } from '@repo/design-system/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/ui/dropdown-menu';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  
  // Replace the current locale segment with the new locale
  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };
  
  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語',
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {languageNames[locale as keyof typeof languageNames] || locale}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((l) => (
          <DropdownMenuItem key={l} asChild>
            <Link href={getLocalizedPath(l)}>
              {languageNames[l as keyof typeof languageNames] || l}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Documentation References

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Languine Documentation](https://github.com/QuiiBz/next-international)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [FormatJS Documentation](https://formatjs.io/)

## Contributing Guidelines

1. Follow the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep translations organized and maintainable
4. Use descriptive translation keys
5. Follow the project's naming conventions

## License

MIT
