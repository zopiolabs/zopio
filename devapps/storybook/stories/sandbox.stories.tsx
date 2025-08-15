/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Sandbox, useSandbox } from '@repo/design-system/ui/sandbox';

/**
 * A Sandbox component for interactive code editing and preview with file management, console, and live preview capabilities.
 */
const meta: Meta<typeof Sandbox> = {
  title: 'ui/Sandbox',
  component: Sandbox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'ghost', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    template: {
      control: { type: 'select' },
      options: ['vanilla', 'react', 'vue', 'angular', 'svelte'],
    },
    showFileExplorer: {
      control: { type: 'boolean' },
    },
    showConsole: {
      control: { type: 'boolean' },
    },
    showPreview: {
      control: { type: 'boolean' },
    },
    autoRun: {
      control: { type: 'boolean' },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample files
const vanillaFiles = {
  'index.html': {
    name: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1 id="title">Hello World!</h1>
        <button onclick="changeTitle()">Change Title</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    language: 'html',
  },
  'styles.css': {
    name: 'styles.css',
    content: `body {
    font-family: system-ui, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
}`,
    language: 'css',
  },
  'script.js': {
    name: 'script.js',
    content: `function changeTitle() {
    const title = document.getElementById('title');
    const titles = ['Hello World!', 'Welcome!', 'Interactive!'];
    const current = titles.indexOf(title.textContent);
    const next = (current + 1) % titles.length;
    title.textContent = titles[next];
    console.log('Title changed to:', titles[next]);
}`,
    language: 'javascript',
  },
};

const reactFiles = {
  'App.jsx': {
    name: 'App.jsx',
    content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>React Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;`,
    language: 'javascript',
  },
};

const jsFiles = {
  'index.js': {
    name: 'index.js',
    content: `console.log('Hello from Sandbox!');

class Calculator {
  constructor() {
    this.result = 0;
  }

  add(num) {
    this.result += num;
    console.log(\`Added \${num}, result: \${this.result}\`);
    return this;
  }

  getResult() {
    return this.result;
  }
}

const calc = new Calculator();
calc.add(10).add(5);
console.log('Final result:', calc.getResult());`,
    language: 'javascript',
  },
};

export const Default: Story = {
  args: {
    files: vanillaFiles,
    template: 'vanilla',
    activeFile: 'index.html',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <Sandbox
          variant="default"
          size="sm"
          files={jsFiles}
          activeFile="index.js"
        />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <Sandbox
          variant="ghost"
          size="sm"
          files={jsFiles}
          activeFile="index.js"
        />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <Sandbox
          variant="outline"
          size="sm"
          files={jsFiles}
          activeFile="index.js"
        />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <Sandbox size="sm" files={jsFiles} activeFile="index.js" />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <Sandbox size="md" files={jsFiles} activeFile="index.js" />
      </div>
      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <Sandbox size="lg" files={jsFiles} activeFile="index.js" />
      </div>
    </div>
  ),
};

export const NoFileExplorer: Story = {
  args: {
    files: jsFiles,
    activeFile: 'index.js',
    showFileExplorer: false,
  },
};

export const ReadOnly: Story = {
  args: {
    files: vanillaFiles,
    activeFile: 'index.html',
    readOnly: true,
  },
};

export const ReactTemplate: Story = {
  args: {
    files: reactFiles,
    template: 'react',
    activeFile: 'App.jsx',
  },
};

export const JavaScriptOnly: Story = {
  args: {
    files: jsFiles,
    template: 'vanilla',
    activeFile: 'index.js',
  },
};

export const WebPage: Story = {
  args: {
    files: vanillaFiles,
    template: 'vanilla',
    activeFile: 'index.html',
  },
};

export const Interactive: Story = {
  render: () => {
    const [files, setFiles] = useState(vanillaFiles);

    const handleFileChange = (path: string, content: string) => {
      setFiles((prev) => ({
        ...prev,
        [path]: { ...prev[path as keyof typeof prev], content },
      }));
    };

    return (
      <Sandbox
        files={files}
        onFileChange={handleFileChange}
        activeFile="index.html"
      />
    );
  },
};

const SandboxInfo = () => {
  const { files, activeFile, isRunning } = useSandbox();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div>Files: {Object.keys(files).length}</div>
      <div>Active: {files[activeFile]?.name}</div>
      <div>Running: {isRunning ? 'Yes' : 'No'}</div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => (
    <Sandbox files={vanillaFiles} activeFile="index.html">
      <SandboxInfo />
    </Sandbox>
  ),
};
