/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
} from '@repo/design-system/ui';

/**
 * Snippet is a component that allows you to display and copy code in a tabbed interface.
 */
const meta = {
  title: 'ui/Snippet',
  component: Snippet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Snippet>;

export default meta;

type Story = StoryObj<typeof meta>;

// Example code snippets
const npmInstallCode = 'npm install @repo/design-system';
const yarnInstallCode = 'yarn add @repo/design-system';
const pnpmInstallCode = 'pnpm add @repo/design-system';

const reactComponentCode = `import { Button } from '@repo/design-system/ui';

export default function Example() {
  return (
    <Button variant="default">
      Click me
    </Button>
  );
}`;

const cssCode = `.snippet {
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #f8fafc;
}

.snippet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
}`;

const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snippet Example</title>
</head>
<body>
  <div class="snippet">
    <div class="snippet-header">
      <span>example.js</span>
      <button>Copy</button>
    </div>
    <pre><code>const hello = "world";</code></pre>
  </div>
</body>
</html>`;

/**
 * Default example showing package installation commands in different package managers
 */
export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <Snippet defaultValue="npm">
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value="npm">npm</SnippetTabsTrigger>
            <SnippetTabsTrigger value="yarn">yarn</SnippetTabsTrigger>
            <SnippetTabsTrigger value="pnpm">pnpm</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton value={npmInstallCode} />
        </SnippetHeader>
        <SnippetTabsContent value="npm">{npmInstallCode}</SnippetTabsContent>
        <SnippetTabsContent value="yarn">{yarnInstallCode}</SnippetTabsContent>
        <SnippetTabsContent value="pnpm">{pnpmInstallCode}</SnippetTabsContent>
      </Snippet>
    </div>
  ),
};

/**
 * Example showing React component code
 */
export const ReactComponent: Story = {
  render: () => (
    <div className="w-[600px]">
      <Snippet defaultValue="react">
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value="react">React</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton value={reactComponentCode} />
        </SnippetHeader>
        <SnippetTabsContent value="react">
          {reactComponentCode}
        </SnippetTabsContent>
      </Snippet>
    </div>
  ),
};

/**
 * Example showing multiple code types with different tabs
 */
export const MultipleCodeTypes: Story = {
  render: () => (
    <div className="w-[600px]">
      <Snippet defaultValue="html">
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value="html">HTML</SnippetTabsTrigger>
            <SnippetTabsTrigger value="css">CSS</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton value={htmlCode} />
        </SnippetHeader>
        <SnippetTabsContent value="html">{htmlCode}</SnippetTabsContent>
        <SnippetTabsContent value="css">{cssCode}</SnippetTabsContent>
      </Snippet>
    </div>
  ),
};

/**
 * Example showing custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="w-[600px]">
      <Snippet defaultValue="npm" className="border-primary">
        <SnippetHeader className="bg-primary/10">
          <SnippetTabsList className="bg-transparent">
            <SnippetTabsTrigger
              value="npm"
              className="data-[state=active]:bg-primary/20"
            >
              npm
            </SnippetTabsTrigger>
            <SnippetTabsTrigger
              value="yarn"
              className="data-[state=active]:bg-primary/20"
            >
              yarn
            </SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton value={npmInstallCode} className="opacity-100" />
        </SnippetHeader>
        <SnippetTabsContent value="npm" className="font-mono">
          {npmInstallCode}
        </SnippetTabsContent>
        <SnippetTabsContent value="yarn" className="font-mono">
          {yarnInstallCode}
        </SnippetTabsContent>
      </Snippet>
    </div>
  ),
};

/**
 * Example showing dark mode styling
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark w-[600px]">
      <Snippet defaultValue="npm">
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value="npm">npm</SnippetTabsTrigger>
            <SnippetTabsTrigger value="yarn">yarn</SnippetTabsTrigger>
            <SnippetTabsTrigger value="pnpm">pnpm</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton value={npmInstallCode} />
        </SnippetHeader>
        <SnippetTabsContent value="npm">{npmInstallCode}</SnippetTabsContent>
        <SnippetTabsContent value="yarn">{yarnInstallCode}</SnippetTabsContent>
        <SnippetTabsContent value="pnpm">{pnpmInstallCode}</SnippetTabsContent>
      </Snippet>
    </div>
  ),
};

/**
 * Example showing custom copy button timeout
 */
export const CustomCopyTimeout: Story = {
  render: () => (
    <div className="w-[600px]">
      <Snippet defaultValue="npm">
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value="npm">npm</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton
            value={npmInstallCode}
            timeout={5000}
            onCopy={() => console.log('Copied to clipboard!')}
            onError={(error) => console.error('Failed to copy:', error)}
          />
        </SnippetHeader>
        <SnippetTabsContent value="npm">{npmInstallCode}</SnippetTabsContent>
      </Snippet>
      <p className="mt-2 text-muted-foreground text-sm">
        This example has a 5-second timeout for the copy button and logs to
        console on copy.
      </p>
    </div>
  ),
};
