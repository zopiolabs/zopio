/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { CodeBlock, useCodeBlock } from '@repo/design-system/ui/code-block';
import { Label } from '@repo/design-system/ui/label';

/**
 * A Code Block component with syntax highlighting, line numbers, copy functionality, and advanced features like diff, focus, and highlighting.
 */
const meta: Meta<typeof CodeBlock> = {
  title: 'ui/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'ghost', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
    },
    language: {
      control: { type: 'text' },
      description: 'Programming language for syntax highlighting',
    },
    showLineNumbers: {
      control: { type: 'boolean' },
      description: 'Show line numbers',
    },
    showCopyButton: {
      control: { type: 'boolean' },
      description: 'Show copy button',
    },
    wrap: {
      control: { type: 'boolean' },
      description: 'Wrap long lines',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample code snippets
const reactCode = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

const javascriptCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

// Example usage
const items = [
  { price: 10, quantity: 2 },
  { price: 15, quantity: 1 },
  { price: 8, quantity: 3 }
];

const total = calculateTotal(items);
console.log('Total:', total); // Total: 59`;

const pythonCode = `def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]

    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])

    return sequence

# Example usage
fib_sequence = fibonacci(10)
print(f"First 10 Fibonacci numbers: {fib_sequence}")`;

const cssCode = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}`;

const jsonCode = `{
  "name": "my-awesome-project",
  "version": "1.0.0",
  "description": "An awesome project built with modern tools",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "^4.17.21",
    "moment": "^2.29.4"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "nodemon": "^2.0.22",
    "webpack": "^5.82.1"
  }
}`;

const diffCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
    const itemTotal = items[i].price * items[i].quantity;
    total += itemTotal;
  }
  return total;
}`;

/**
 * Basic Code Block with default settings.
 */
export const Default: Story = {
  args: {
    code: reactCode,
    language: 'javascript',
    filename: 'MyComponent.jsx',
  },
};

/**
 * Different visual variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <CodeBlock
          variant="default"
          code={reactCode}
          language="javascript"
          filename="component.jsx"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <CodeBlock
          variant="ghost"
          code={reactCode}
          language="javascript"
          filename="component.jsx"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <CodeBlock
          variant="outline"
          code={reactCode}
          language="javascript"
          filename="component.jsx"
        />
      </div>
    </div>
  ),
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <CodeBlock
          size="sm"
          code={reactCode}
          language="javascript"
          filename="component.jsx"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <CodeBlock
          size="md"
          code={reactCode}
          language="javascript"
          filename="component.jsx"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <CodeBlock
          size="lg"
          code={reactCode}
          language="javascript"
          filename="component.jsx"
        />
      </div>
    </div>
  ),
};

/**
 * Code block without header.
 */
export const NoHeader: Story = {
  args: {
    code: reactCode,
    language: 'javascript',
    showCopyButton: false,
  },
};

/**
 * Code block without line numbers.
 */
export const NoLineNumbers: Story = {
  args: {
    code: reactCode,
    language: 'javascript',
    filename: 'component.jsx',
    showLineNumbers: false,
  },
};

/**
 * Code block with highlighted lines.
 */
export const HighlightedLines: Story = {
  args: {
    code: reactCode,
    language: 'javascript',
    filename: 'component.jsx',
    highlightLines: [2, 4],
  },
};

/**
 * Code block with highlighted words.
 */
export const HighlightedWords: Story = {
  args: {
    code: reactCode,
    language: 'javascript',
    filename: 'component.jsx',
    highlightWords: ['props.name', 'MyComponent'],
  },
};

/**
 * Code block with focused lines.
 */
export const FocusedLines: Story = {
  args: {
    code: `function calculateDiscount(price, percentage) {
  const discount = price * (percentage / 100);
  return price - discount;
}

// Example usage
const finalPrice = calculateDiscount(100, 20);
console.log(finalPrice); // 80`,
    language: 'javascript',
    filename: 'discount.js',
    focusLines: [2],
  },
};

/**
 * Code block with diff highlighting.
 */
export const DiffHighlighting: Story = {
  args: {
    code: diffCode,
    language: 'javascript',
    filename: 'calculate.js',
    diffLines: {
      removed: [4],
      added: [5, 6],
    },
  },
};

/**
 * Code block with maximum height and expand functionality.
 */
export const MaxHeight: Story = {
  args: {
    code: javascriptCode,
    language: 'javascript',
    filename: 'calculator.js',
    maxHeight: '200px',
  },
};

/**
 * Code block with wrapped lines.
 */
export const WrappedLines: Story = {
  args: {
    code: `const veryLongVariableName = "This is a very long string that would normally overflow the container but will be wrapped when the wrap option is enabled";`,
    language: 'javascript',
    filename: 'long-line.js',
    wrap: true,
  },
};

/**
 * Different programming languages.
 */
export const Languages: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">JavaScript</h4>
        <CodeBlock
          code={javascriptCode}
          language="javascript"
          filename="script.js"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Python</h4>
        <CodeBlock
          code={pythonCode}
          language="python"
          filename="fibonacci.py"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">CSS</h4>
        <CodeBlock code={cssCode} language="css" filename="styles.css" />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">JSON</h4>
        <CodeBlock code={jsonCode} language="json" filename="package.json" />
      </div>
    </div>
  ),
};

/**
 * TypeScript example.
 */
export const TypeScript: Story = {
  args: {
    code: `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
    };
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive);
  }
}`,
    language: 'typescript',
    filename: 'UserService.ts',
    highlightLines: [8, 15, 19],
  },
};

/**
 * HTML example.
 */
export const HTML: Story = {
  args: {
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="navigation">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <section class="hero">
            <h1>Welcome to My Website</h1>
            <p>This is an amazing website built with modern HTML.</p>
            <button class="cta-button">Get Started</button>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`,
    language: 'html',
    filename: 'index.html',
  },
};

/**
 * Shell/Bash commands.
 */
export const Shell: Story = {
  args: {
    code: `#!/bin/bash

# Install dependencies
npm install

# Build the project
npm run build

# Start the development server
npm run dev

# Run tests
npm test

# Deploy to production
npm run deploy

echo "Deployment completed successfully!"`,
    language: 'bash',
    filename: 'deploy.sh',
  },
};

/**
 * SQL example.
 */
export const SQL: Story = {
  args: {
    code: `-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@example.com', 'hashed_password_1'),
('jane_smith', 'jane@example.com', 'hashed_password_2');

-- Query with JOIN
SELECT
    u.username,
    p.title,
    p.created_at
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE p.published = TRUE
ORDER BY p.created_at DESC;`,
    language: 'sql',
    filename: 'schema.sql',
    highlightLines: [2, 11, 25],
  },
};

/**
 * Configuration files.
 */
export const Configuration: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Docker</h4>
        <CodeBlock
          code={`FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]`}
          language="dockerfile"
          filename="Dockerfile"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">YAML</h4>
        <CodeBlock
          code={`name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test`}
          language="yaml"
          filename=".github/workflows/ci.yml"
        />
      </div>
    </div>
  ),
};

/**
 * Interactive code block with custom actions.
 */
export const Interactive: Story = {
  render: () => {
    const [code, setCode] = useState(reactCode);
    const [language, setLanguage] = useState('javascript');

    const codeExamples = {
      javascript: reactCode,
      python: pythonCode,
      css: cssCode,
      json: jsonCode,
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="font-medium text-sm">Language:</Label>
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value as keyof typeof codeExamples;
              setLanguage(newLang);
              setCode(codeExamples[newLang]);
            }}
            className="rounded border border-border bg-background px-3 py-1"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <CodeBlock
          code={code}
          language={language}
          filename={`example.${language === 'javascript' ? 'js' : language}`}
        />
      </div>
    );
  },
};

// Custom code block info component for stories
const CodeBlockInfo = () => {
  const { copied, expanded } = useCodeBlock();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Copied:</span>
          <div>{copied ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Expanded:</span>
          <div>{expanded ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Using the CodeBlock context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <CodeBlock
        code={javascriptCode}
        language="javascript"
        filename="calculator.js"
        maxHeight="150px"
      >
        <CodeBlockInfo />
      </CodeBlock>
    </div>
  ),
};
