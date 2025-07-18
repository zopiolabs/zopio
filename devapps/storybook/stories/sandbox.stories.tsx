/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Code, Play, Terminal } from 'lucide-react';

import {
  SandboxCodeEditor,
  SandboxConsole,
  SandboxFileExplorer,
  SandboxLayout,
  SandboxPreview,
  SandboxProvider,
  SandboxTabs,
  SandboxTabsContent,
  SandboxTabsList,
  SandboxTabsTrigger,
} from '@repo/design-system/ui/sandbox';

/**
 * The sandbox component allows you to preview and test components in a sandboxed environment.
 * Powered by Sandpack from CodeSandbox.
 */
const meta = {
  title: 'ui/Sandbox',
  component: SandboxProvider,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SandboxProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

// Simple HTML/CSS/JS example
const simpleExample = {
  files: {
    '/index.js': `import "./styles.css";
document.getElementById("app").innerHTML = \`
  <h1>Hello Sandbox</h1>
  <p>Start editing to see some magic happen!</p>
\`;`,
    '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 16px;
}

h1 {
  color: #0070f3;
}`,
  },
};

// React example
const reactExample = {
  template: 'react',
  files: {
    '/App.js': `import { useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>React Sandbox Example</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>App.js</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}`,
    '/styles.css': `body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

.App {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}`,
  },
} as const;

/**
 * A simple sandbox with code editor and preview.
 */
export const Default: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <SandboxProvider {...simpleExample}>
        <SandboxLayout>
          <SandboxCodeEditor />
          <SandboxPreview />
        </SandboxLayout>
      </SandboxProvider>
    </div>
  ),
};

/**
 * A sandbox with tabs for switching between code, preview, and console.
 */
export const WithTabs: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <SandboxProvider {...reactExample}>
        <SandboxTabs defaultValue="code">
          <SandboxTabsList>
            <SandboxTabsTrigger value="code">
              <Code className="mr-1 size-4" />
              Code
            </SandboxTabsTrigger>
            <SandboxTabsTrigger value="preview">
              <Play className="mr-1 size-4" />
              Preview
            </SandboxTabsTrigger>
            <SandboxTabsTrigger value="console">
              <Terminal className="mr-1 size-4" />
              Console
            </SandboxTabsTrigger>
          </SandboxTabsList>
          <SandboxTabsContent value="code">
            <SandboxCodeEditor />
          </SandboxTabsContent>
          <SandboxTabsContent value="preview">
            <SandboxPreview />
          </SandboxTabsContent>
          <SandboxTabsContent value="console">
            <SandboxConsole />
          </SandboxTabsContent>
        </SandboxTabs>
      </SandboxProvider>
    </div>
  ),
};

/**
 * A sandbox with file explorer, code editor, and preview.
 */
export const WithFileExplorer: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <SandboxProvider {...reactExample}>
        <SandboxTabs defaultValue="code">
          <SandboxTabsList>
            <SandboxTabsTrigger value="code">
              <Code className="mr-1 size-4" />
              Code
            </SandboxTabsTrigger>
            <SandboxTabsTrigger value="preview">
              <Play className="mr-1 size-4" />
              Preview
            </SandboxTabsTrigger>
          </SandboxTabsList>
          <SandboxTabsContent value="code">
            <div className="flex h-full">
              <div className="w-1/4 border-r">
                <SandboxFileExplorer />
              </div>
              <div className="w-3/4">
                <SandboxCodeEditor />
              </div>
            </div>
          </SandboxTabsContent>
          <SandboxTabsContent value="preview">
            <SandboxPreview />
          </SandboxTabsContent>
        </SandboxTabs>
      </SandboxProvider>
    </div>
  ),
};

/**
 * A complete sandbox environment with file explorer, code editor, preview, and console.
 */
export const Complete: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <SandboxProvider {...reactExample}>
        <div className="flex h-full">
          <div className="w-1/5 border-r">
            <SandboxFileExplorer />
          </div>
          <div className="w-4/5">
            <SandboxTabs defaultValue="code">
              <SandboxTabsList>
                <SandboxTabsTrigger value="code">
                  <Code className="mr-1 size-4" />
                  Code
                </SandboxTabsTrigger>
                <SandboxTabsTrigger value="preview">
                  <Play className="mr-1 size-4" />
                  Preview
                </SandboxTabsTrigger>
                <SandboxTabsTrigger value="console">
                  <Terminal className="mr-1 size-4" />
                  Console
                </SandboxTabsTrigger>
              </SandboxTabsList>
              <SandboxTabsContent value="code">
                <SandboxCodeEditor />
              </SandboxTabsContent>
              <SandboxTabsContent value="preview">
                <SandboxPreview />
              </SandboxTabsContent>
              <SandboxTabsContent value="console">
                <SandboxConsole />
              </SandboxTabsContent>
            </SandboxTabs>
          </div>
        </div>
      </SandboxProvider>
    </div>
  ),
};
