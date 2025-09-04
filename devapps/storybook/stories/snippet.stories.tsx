/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Snippet, useSnippet } from '@repo/design-system/ui/snippet';

// Import the SnippetTab type for proper typing
type SnippetTab = {
  label: string;
  value: string;
  code: string;
  language?: string;
  filename?: string;
};

/**
 * A Snippet component that displays code in a tabbed interface with copy functionality.
 */
const meta: Meta<typeof Snippet> = {
  title: 'ui/Snippet',
  component: Snippet,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'ghost', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    showCopyButton: {
      control: { type: 'boolean' },
    },
    showDownloadButton: {
      control: { type: 'boolean' },
    },
    copyTimeout: {
      control: { type: 'number' },
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample code snippets
const npmTabs = [
  {
    label: 'npm',
    value: 'npm',
    code: 'npm install @repo/design-system',
    language: 'bash',
  },
  {
    label: 'yarn',
    value: 'yarn',
    code: 'yarn add @repo/design-system',
    language: 'bash',
  },
  {
    label: 'pnpm',
    value: 'pnpm',
    code: 'pnpm add @repo/design-system',
    language: 'bash',
  },
];

const reactTabs = [
  {
    label: 'Component',
    value: 'component',
    code: `import React from 'react';
import { Button } from '@repo/design-system/ui/button';

export function MyComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hello World</h1>
      <Button onClick={() => alert('Clicked!')}>
        Click me
      </Button>
    </div>
  );
}`,
    language: 'javascript',
    filename: 'MyComponent.jsx',
  },
  {
    label: 'Usage',
    value: 'usage',
    code: `import { MyComponent } from './MyComponent';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MyComponent />
    </div>
  );
}

export default App;`,
    language: 'javascript',
    filename: 'App.jsx',
  },
];

const configTabs = [
  {
    label: 'package.json',
    value: 'package',
    code: `{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`,
    language: 'json',
    filename: 'package.json',
  },
  {
    label: 'tailwind.config.js',
    value: 'tailwind',
    code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}`,
    language: 'javascript',
    filename: 'tailwind.config.js',
  },
];

const apiTabs = [
  {
    label: 'GET',
    value: 'get',
    code: `fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
    language: 'javascript',
  },
  {
    label: 'POST',
    value: 'post',
    code: `fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
    language: 'javascript',
  },
  {
    label: 'PUT',
    value: 'put',
    code: `fetch('/api/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
    language: 'javascript',
  },
];

const singleTab = [
  {
    label: 'Code',
    value: 'code',
    code: `console.log('Hello, World!');

function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet('Developer');
console.log(message);`,
    language: 'javascript',
  },
];

export const Default: Story = {
  args: {
    tabs: npmTabs,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <Snippet variant="default" tabs={npmTabs} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <Snippet variant="ghost" tabs={npmTabs} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <Snippet variant="outline" tabs={npmTabs} />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <Snippet size="sm" tabs={singleTab} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <Snippet size="md" tabs={singleTab} />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <Snippet size="lg" tabs={singleTab} />
      </div>
    </div>
  ),
};

export const WithoutCopyButton: Story = {
  args: {
    tabs: npmTabs,
    showCopyButton: false,
  },
};

export const WithDownloadButton: Story = {
  args: {
    tabs: reactTabs,
    showDownloadButton: true,
  },
};

export const SingleTab: Story = {
  args: {
    tabs: singleTab,
  },
};

export const ReactComponent: Story = {
  args: {
    tabs: reactTabs,
  },
};

export const ConfigurationFiles: Story = {
  args: {
    tabs: configTabs,
  },
};

export const APIExamples: Story = {
  args: {
    tabs: apiTabs,
  },
};

export const InstallationCommands: Story = {
  args: {
    tabs: [
      {
        label: 'npm',
        value: 'npm',
        code: 'npx create-next-app@latest my-app',
        language: 'bash',
      },
      {
        label: 'yarn',
        value: 'yarn',
        code: 'yarn create next-app my-app',
        language: 'bash',
      },
      {
        label: 'pnpm',
        value: 'pnpm',
        code: 'pnpm create next-app my-app',
        language: 'bash',
      },
      {
        label: 'bun',
        value: 'bun',
        code: 'bun create next-app my-app',
        language: 'bash',
      },
    ],
  },
};

export const DatabaseSchemas: Story = {
  args: {
    tabs: [
      {
        label: 'SQL',
        value: 'sql',
        code: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        language: 'sql',
        filename: 'schema.sql',
      },
      {
        label: 'Prisma',
        value: 'prisma',
        code: `model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())

  @@map("posts")
}`,
        language: 'prisma',
        filename: 'schema.prisma',
      },
    ],
  },
};

export const DockerSetup: Story = {
  args: {
    tabs: [
      {
        label: 'Dockerfile',
        value: 'dockerfile',
        code: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]`,
        language: 'dockerfile',
        filename: 'Dockerfile',
      },
      {
        label: 'docker-compose.yml',
        value: 'compose',
        code: `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:`,
        language: 'yaml',
        filename: 'docker-compose.yml',
      },
    ],
  },
};

export const CustomCopyTimeout: Story = {
  args: {
    tabs: npmTabs,
    copyTimeout: 5000,
  },
};

export const Interactive: Story = {
  render: () => {
    const [copyCount, setCopyCount] = useState(0);

    const handleCopy = (_code: string, _tab: SnippetTab) => {
      setCopyCount((prev) => prev + 1);
    };

    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">
          Copy count: {copyCount}
        </div>
        <Snippet tabs={reactTabs} onCopy={handleCopy} showDownloadButton />
      </div>
    );
  },
};

const SnippetInfo = () => {
  const { copied } = useSnippet();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div>
        <span className="font-medium">Currently copied:</span>
        <div>{copied || 'None'}</div>
      </div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <Snippet tabs={npmTabs}>
      <SnippetInfo />
    </Snippet>
  ),
};

export const EmptyTabs: Story = {
  args: {
    tabs: [],
  },
};
