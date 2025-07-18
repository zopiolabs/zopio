/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { BundledLanguage } from 'shiki';

import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockTitle,
} from '@repo/design-system/ui/code-block';
import type { CodeBlockProps } from '@repo/design-system/ui/code-block';

/**
 * A component for displaying code with syntax highlighting, line numbers, and copy functionality.
 */
const meta = {
  title: 'ui/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

const javascriptCode = `function greeting(name) {
  return \`Hello, \${name}!\`;
}

// Call the function
const message = greeting('World');
console.log(message); // Output: Hello, World!`;

const typescriptCode = `interface User {
  id: number;
  name: string;
  email: string;
}

function getUserInfo(user: User): string {
  return \`\${user.name} (\${user.email})\`;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

console.log(getUserInfo(user)); // Output: John Doe (john@example.com)`;

const cssCode = `.code-block {
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  background-color: #f8fafc;
}

.code-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.code-block-content {
  padding: 1rem;
  overflow-x: auto;
}`;

const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Block Example</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="code-block">
    <div class="code-block-header">
      <span>example.js</span>
      <button>Copy</button>
    </div>
    <div class="code-block-content">
      <pre><code>const hello = "world";</code></pre>
    </div>
  </div>
</body>
</html>`;

/**
 * The default code block with JavaScript code and a title.
 */
export const Default: Story = {
  args: {
    data: [
      {
        language: 'javascript',
        filename: 'example.js',
        code: javascriptCode,
      },
    ],
  },
  render: (args: CodeBlockProps) => {
    return (
      <div className="w-[600px]">
        <CodeBlock {...args}>
          <CodeBlockHeader>
            <CodeBlockTitle title="example.js" />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem value={item.language} key={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    );
  },
};

/**
 * A code block with TypeScript code and syntax highlighting.
 */
export const TypeScript: Story = {
  args: {
    data: [
      {
        language: 'typescript',
        filename: 'user.ts',
        code: typescriptCode,
      },
    ],
  },
  render: (args: CodeBlockProps) => {
    return (
      <div className="w-[600px]">
        <CodeBlock {...args}>
          <CodeBlockHeader>
            <CodeBlockTitle title="user.ts" />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem value={item.language} key={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    );
  },
};

/**
 * A code block with CSS code.
 */
export const CSS: Story = {
  args: {
    data: [
      {
        language: 'css',
        filename: 'styles.css',
        code: cssCode,
      },
    ],
  },
  render: (args: CodeBlockProps) => {
    return (
      <div className="w-[600px]">
        <CodeBlock {...args}>
          <CodeBlockHeader>
            <CodeBlockTitle title="styles.css" />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem value={item.language} key={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    );
  },
};

/**
 * A code block with HTML code.
 */
export const HTML: Story = {
  args: {
    data: [
      {
        language: 'html',
        filename: 'index.html',
        code: htmlCode,
      },
    ],
  },
  render: (args: CodeBlockProps) => {
    return (
      <div className="w-[600px]">
        <CodeBlock {...args}>
          <CodeBlockHeader>
            <CodeBlockTitle title="index.html" />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem value={item.language} key={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    );
  },
};

/**
 * A code block without line numbers.
 */
export const WithoutLineNumbers: Story = {
  args: {
    data: [
      {
        language: 'javascript',
        filename: 'example.js',
        code: javascriptCode,
      },
    ],
  },
  render: (args: CodeBlockProps) => {
    return (
      <div className="w-[600px]">
        <CodeBlock {...args}>
          <CodeBlockHeader>
            <CodeBlockTitle title="example.js" />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem
                value={item.language}
                lineNumbers={false}
                key={item.language}
              >
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    );
  },
};

/**
 * A code block with highlighted lines.
 */
export const HighlightedLines: Story = {
  args: {
    data: [
      {
        language: 'javascript',
        filename: 'example.js',
        code: `function greeting(name) { // [!code highlight]
  return \`Hello, \${name}!\`;
}

// Call the function
const message = greeting('World'); // [!code highlight]
console.log(message); // Output: Hello, World!`,
      },
    ],
  },
  render: (args: CodeBlockProps) => {
    return (
      <div className="w-[600px]">
        <CodeBlock {...args}>
          <CodeBlockHeader>
            <CodeBlockTitle title="example.js" />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem value={item.language} key={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    );
  },
};

/**
 * A code block with dark mode styling.
 */
export const DarkMode: Story = {
  args: {
    data: [
      {
        language: 'javascript',
        filename: 'example.js',
        code: javascriptCode,
      },
    ],
  },
  render: (args: CodeBlockProps) => {
    return (
      <div className="dark w-[600px]">
        <CodeBlock {...args}>
          <CodeBlockHeader>
            <CodeBlockTitle title="example.js" />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem value={item.language} key={item.language}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </div>
    );
  },
};
