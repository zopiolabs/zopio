# @repo/seo

## Overview

The `@repo/seo` package provides search engine optimization utilities for Zopio applications. It includes tools for generating structured metadata for Next.js applications and implementing JSON-LD structured data to improve search engine visibility and rich result opportunities.

## Module Categories

### Metadata Generation

- **Metadata Creator**: Generate consistent and SEO-friendly metadata for Next.js pages
- **Default Configuration**: Standardized metadata settings for Zopio applications

### Structured Data

- **JSON-LD Component**: React component for adding structured data to pages
- **Schema.org Types**: Type definitions for common structured data schemas

## Usage Guidelines

### Metadata Generation

```typescript
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return createMetadata({
    title: 'My Page Title',
    description: 'A detailed description of my page content',
    image: 'https://example.com/image.jpg',
    // Additional metadata properties
  });
}
```

### JSON-LD Structured Data

```tsx
import { JsonLd, WebPage } from '@repo/seo/json-ld';

export default function Page() {
  return (
    <>
      <h1>My Page</h1>
      <JsonLd
        code={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'My Page',
          description: 'A detailed description of my page content',
        }}
      />
    </>
  );
}
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/seo
```

## Development Guidelines

### Project Structure

```
seo/
├── json-ld.tsx     # JSON-LD React component
├── metadata.ts     # Metadata generation utilities
└── package.json    # Package dependencies
```

### Dependencies

- `react`: React library for component creation
- `schema-dts`: TypeScript definitions for Schema.org structured data
- `lodash.merge`: Utility for merging metadata objects
- `next`: Next.js types for metadata

### Best Practices

1. **Consistent Metadata**: Use the `createMetadata` function to ensure consistent metadata across your application.
2. **Structured Data**: Implement JSON-LD structured data for important pages to improve search engine understanding.
3. **Image Optimization**: Always provide optimized images for metadata to improve page load times.
4. **Descriptive Titles**: Create descriptive and unique titles for each page.
5. **Concise Descriptions**: Write concise but informative meta descriptions (under 160 characters).

## Integration Examples

### Basic Page Metadata

```typescript
// app/page.tsx
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return createMetadata({
    title: 'Home Page',
    description: 'Welcome to our application home page',
  });
}

export default function HomePage() {
  return <h1>Welcome to our application</h1>;
}
```

### Product Page with Structured Data

```tsx
// app/products/[id]/page.tsx
import { createMetadata } from '@repo/seo/metadata';
import { JsonLd, Product } from '@repo/seo/json-ld';
import type { Metadata } from 'next';

export function generateMetadata({ params }): Metadata {
  const product = getProduct(params.id);
  
  return createMetadata({
    title: product.name,
    description: product.description,
    image: product.imageUrl,
  });
}

export default function ProductPage({ params }) {
  const product = getProduct(params.id);
  
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <JsonLd
        code={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.imageUrl,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
          },
        }}
      />
    </>
  );
}
```

### Blog Post with Article Structured Data

```tsx
// app/blog/[slug]/page.tsx
import { createMetadata } from '@repo/seo/metadata';
import { JsonLd } from '@repo/seo/json-ld';
import type { Metadata } from 'next';

export function generateMetadata({ params }): Metadata {
  const post = getPost(params.slug);
  
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage,
  });
}

export default function BlogPost({ params }) {
  const post = getPost(params.slug);
  
  return (
    <>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <JsonLd
        code={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage,
          datePublished: post.publishDate,
          author: {
            '@type': 'Person',
            name: post.author.name,
          },
        }}
      />
    </>
  );
}
```

## Documentation References

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/) - Structured data vocabulary
- [Google Search Central: Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [JSON-LD Format](https://json-ld.org/)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure all components are properly typed.
3. Document any new SEO features or changes to existing ones.
4. Test structured data using Google's [Rich Results Test](https://search.google.com/test/rich-results).

## License

MIT
