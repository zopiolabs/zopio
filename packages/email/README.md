# @repo/email

## Overview

The `@repo/email` package provides a streamlined email service integration for Zopio applications using Resend as the email delivery provider. It offers a type-safe API for sending transactional emails with React-based templates, ensuring consistent branding and responsive design across all email communications.

## Module Categories

### Core Components

- **Resend Client**: Pre-configured client for the Resend email service
- **Environment Configuration**: Type-safe environment variable handling with Zod validation
- **Email Templates**: React-based, responsive email templates

### Templates

- **Contact Form**: Template for contact form submissions with sender information and message content

## Usage Guidelines

### Basic Setup

First, ensure your environment variables are properly configured:

```bash
# .env
RESEND_FROM=notifications@yourdomain.com
RESEND_TOKEN=re_123456789
```

### Sending Emails

```tsx
import { resend } from '@repo/email';
import { ContactTemplate } from '@repo/email/templates/contact';
import { render } from '@react-email/render';

async function sendContactEmail(name: string, email: string, message: string) {
  try {
    const html = render(
      <ContactTemplate 
        name={name} 
        email={email} 
        message={message} 
      />
    );
    
    const result = await resend.emails.send({
      from: 'Your Company <notifications@yourdomain.com>',
      to: 'support@yourdomain.com',
      subject: `New contact from ${name}`,
      html,
      text: `${name} (${email}) has sent you a message: ${message}`,
    });
    
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
```

### Creating Custom Email Templates

Create new templates in the `templates` directory following this pattern:

```tsx
// templates/welcome.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type * as React from 'react';

interface WelcomeTemplateProps {
  name: string;
  verificationUrl: string;
}

const WelcomeTemplate = (props: WelcomeTemplateProps): React.ReactElement => {
  const { name, verificationUrl } = props;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Welcome to Zopio, {name}!</Preview>
        <Body className="bg-zinc-50 font-sans">
          <Container className="mx-auto py-12">
            <Section className="rounded-md bg-white p-8">
              <Text className="text-2xl font-semibold text-zinc-950">
                Welcome to Zopio, {name}!
              </Text>
              <Text className="text-zinc-500">
                Please verify your email address by clicking the link below:
              </Text>
              <Text className="text-blue-500 underline">
                <a href={verificationUrl}>Verify Email Address</a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

// Add preview props for email testing
WelcomeTemplate.PreviewProps = {
  name: 'John Doe',
  verificationUrl: 'https://example.com/verify?token=123',
};

export default WelcomeTemplate;
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/email
```

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `RESEND_FROM` | Default sender email address | Yes | `notifications@yourdomain.com` |
| `RESEND_TOKEN` | Resend API token (starts with `re_`) | Yes | `re_123456789` |

## Development Guidelines

### Adding New Templates

When creating new email templates:

1. Use the `@react-email/components` library for consistent rendering
2. Follow responsive design principles
3. Include preview text for email clients
4. Add `PreviewProps` for testing in the React Email preview tool
5. Use Tailwind for styling to maintain consistency with the Zopio design system
6. Test rendering in multiple email clients

### Testing Templates

You can test email templates using the React Email preview tool:

```bash
npx email dev
```

## Integration Examples

### With Next.js App Router

```tsx
// app/api/contact/route.ts
import { resend } from '@repo/email';
import { ContactTemplate } from '@repo/email/templates/contact';
import { render } from '@react-email/render';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  
  try {
    const html = render(
      <ContactTemplate 
        name={name} 
        email={email} 
        message={message} 
      />
    );
    
    const result = await resend.emails.send({
      from: 'Your Company <notifications@yourdomain.com>',
      to: 'support@yourdomain.com',
      subject: `New contact from ${name}`,
      html,
    });
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

### With Form Submission

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@repo/design-system/ui/button';
import { Input } from '@repo/design-system/ui/input';
import { Textarea } from '@repo/design-system/ui/textarea';
import { useToast } from '@repo/design-system/ui/use-toast';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        toast({
          title: 'Message sent',
          description: 'We\'ll get back to you as soon as possible.',
        });
        event.currentTarget.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input name="name" placeholder="Your name" required />
      </div>
      <div>
        <Input name="email" type="email" placeholder="Your email" required />
      </div>
      <div>
        <Textarea name="message" placeholder="Your message" required />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
```

## Documentation References

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
- [Zod Documentation](https://zod.dev/)

## Contributing Guidelines

1. Follow the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new templates
5. Follow the project's naming conventions

## License

MIT
