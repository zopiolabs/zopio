# @repo/cms

## Overview

The `@repo/cms` package provides a headless content management system integration for Zopio applications using BaseHub as the underlying CMS provider. It offers a type-safe API for fetching and rendering structured content, rich text components, and media assets from your BaseHub content repository.

## Module Categories

### Core Components

- **Content Fetching**: Type-safe API for querying blog posts, legal pages, and other content types
- **Rich Text Rendering**: Components for rendering structured content with proper styling
- **Media Handling**: Image components with optimized loading and rendering

### UI Components

- **Body**: Rich text content renderer with customizable components
- **CodeBlock**: Syntax-highlighted code block renderer
- **Feed**: Content feed component for listing multiple content items
- **Image**: Optimized image component for CMS-sourced media
- **TOC**: Table of contents generator for structured content
- **Toolbar**: Content editing toolbar for authorized users

### Configuration

- **Environment Setup**: Type-safe environment variable handling for CMS tokens
- **Next.js Integration**: Configuration helpers for Next.js applications

## Usage Guidelines

### Basic Setup

1. Add your BaseHub API token to your environment variables:

```env
BASEHUB_TOKEN=bshb_pk_your_token_here
```

2. Import and use the CMS components and APIs in your application:

```tsx
import { blog } from '@repo/cms';
import { Body } from '@repo/cms/components/body';

// In your page component
export async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await blog.getPost(params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <time dateTime={post.publishedAt}>
        {new Date(post.publishedAt).toLocaleDateString()}
      </time>
      <Body content={post.content} />
    </article>
  );
}
```

### Fetching Blog Content

```tsx
import { blog } from '@repo/cms';

// Get all blog posts
const posts = await blog.getPosts();

// Get a specific blog post by slug
const post = await blog.getPost('getting-started-with-zopio');

// Get the latest blog post
const latestPost = await blog.getLatestPost();
```

### Fetching Legal Content

```tsx
import { legal } from '@repo/cms';

// Get all legal pages
const legalPages = await legal.getPosts();

// Get a specific legal page by slug
const privacyPolicy = await legal.getPost('privacy-policy');
```

### Rendering Rich Text Content

```tsx
import { Body } from '@repo/cms/components/body';
import { CodeBlock } from '@repo/cms/components/code-block';

export function ContentRenderer({ content }) {
  return (
    <Body 
      content={content} 
      components={{
        pre: ({ code, language }) => (
          <CodeBlock code={code} language={language} />
        ),
      }}
    />
  );
}
```

### Creating a Blog Feed

```tsx
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';

export async function BlogFeed() {
  const posts = await blog.getPosts();
  
  return (
    <Feed
      items={posts}
      renderItem={(post) => (
        <div key={post.slug}>
          <h2>
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </h2>
          <p>{post.excerpt}</p>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>
      )}
    />
  );
}
```

### Adding Table of Contents

```tsx
import { TOC } from '@repo/cms/components/toc';
import { Body } from '@repo/cms/components/body';

export function BlogPostWithTOC({ post }) {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="col-span-3">
        <h1>{post.title}</h1>
        <Body content={post.content} />
      </div>
      <div className="col-span-1">
        <TOC content={post.content} />
      </div>
    </div>
  );
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/cms
```

## Environment Variables

| Variable | Description | Format |
| --- | --- | --- |
| `BASEHUB_TOKEN` | BaseHub API token for content access | Starts with `bshb_pk_` |

## Development Guidelines

### Adding New Content Types

To add a new content type:

1. Define the fragment types for your content:

```tsx
// Define the fragment for your content type
const myContentFragment = fragmentOn('MyContent', {
  id: true,
  title: true,
  slug: true,
  content: true,
  publishedAt: true,
});

// Define the metadata type
type MyContentMeta = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
};

// Define the full content type
type MyContent = MyContentMeta & {
  content: unknown;
};
```

2. Create the queries and helper functions:

```tsx
export const myContent = {
  // Query for listing content
  contentsQuery: fragmentOn('Query', {
    myContents: {
      items: myContentFragment,
    },
  }),
  
  // Query for a specific content item
  contentQuery: (slug: string) => ({
    myContent: {
      where: { slug },
      item: myContentFragment,
    },
  }),
  
  // Helper function to get all content items
  getContents: async (): Promise<MyContent[]> => {
    try {
      const data = await basehub.query(myContent.contentsQuery);
      return data?.myContents?.items || [];
    } catch (error) {
      console.error('Failed to fetch content:', error);
      return [];
    }
  },
  
  // Helper function to get a specific content item
  getContent: async (slug: string): Promise<MyContent | null> => {
    try {
      const data = await basehub.query(myContent.contentQuery(slug));
      return data?.myContent?.item || null;
    } catch (error) {
      console.error(`Failed to fetch content with slug ${slug}:`, error);
      return null;
    }
  },
};
```

### Custom Component Overrides

To customize the rendering of specific content types:

```tsx
import { Body } from '@repo/cms/components/body';

export function CustomContentRenderer({ content }) {
  return (
    <Body
      content={content}
      components={{
        pre: ({ code, language }) => (
          <div className="my-custom-code-block">
            <div className="header">{language}</div>
            <pre>{code}</pre>
          </div>
        ),
        img: (props) => (
          <figure>
            <img 
              {...props} 
              className="rounded-lg shadow-md" 
              loading="lazy" 
            />
            {props.alt && <figcaption>{props.alt}</figcaption>}
          </figure>
        ),
      }}
    />
  );
}
```

## Integration Examples

### With Next.js App Router

```tsx
// app/blog/[slug]/page.tsx
import { blog } from '@repo/cms';
import { Body } from '@repo/cms/components/body';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await blog.getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await blog.getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="prose prose-lg mx-auto">
      <h1>{post.title}</h1>
      <time dateTime={post.publishedAt} className="text-gray-500">
        {new Date(post.publishedAt).toLocaleDateString()}
      </time>
      <Body content={post.content} />
    </article>
  );
}
```

### With TanStack Query

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { blog } from '@repo/cms';
import { Body } from '@repo/cms/components/body';

export function BlogPostWithQuery({ slug }) {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blog.getPost(slug),
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;
  if (!post) return <div>Post not found</div>;
  
  return (
    <article>
      <h1>{post.title}</h1>
      <Body content={post.content} />
    </article>
  );
}
```

## BaseHub Integration

This package integrates with BaseHub for content management. To use the BaseHub dashboard:

1. Log in to your BaseHub account at [https://basehub.com](https://basehub.com)
2. Navigate to your project
3. Use the content editor to create and manage your content
4. Content changes will be available through the CMS API immediately

## Documentation References

- [BaseHub Documentation](https://basehub.com/docs)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
