/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  AppWindowIcon,
  CodeIcon,
  FolderIcon,
  TerminalIcon,
} from 'lucide-react';

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
 * Interactive code playground with live preview and debugging capabilities.
 * Perfect for React component testing requiring isolated environments with TypeScript support.
 */
const meta: Meta<typeof SandboxProvider> = {
  title: 'ui/Sandbox',
  component: SandboxProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The Sandbox component provides an interactive code playground with live preview, debugging console, and file explorer capabilities powered by Sandpack.',
      },
    },
  },
  args: {
    template: 'react',
    files: {
      '/App.js': `export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}`,
      '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 20px;
}

.App {
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

h2 {
  color: #666;
  font-weight: normal;
}`,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic sandbox with tabbed interface showing code editor, preview, and console.
 */
export const Default: Story = {
  render: (args) => (
    <div className="h-[600px] w-full">
      <SandboxProvider {...args}>
        <SandboxLayout>
          <SandboxTabs defaultValue="code">
            <SandboxTabsList>
              <SandboxTabsTrigger value="code">
                <CodeIcon size={14} />
                Code
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="preview">
                <AppWindowIcon size={14} />
                Preview
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="console">
                <TerminalIcon size={14} />
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
        </SandboxLayout>
      </SandboxProvider>
    </div>
  ),
};

/**
 * Sandbox with file explorer for managing multiple files.
 */
export const WithFileExplorer: Story = {
  render: (args) => (
    <div className="h-[600px] w-full">
      <SandboxProvider {...args}>
        <SandboxLayout>
          <SandboxTabs defaultValue="code">
            <SandboxTabsList>
              <SandboxTabsTrigger value="files">
                <FolderIcon size={14} />
                Files
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="code">
                <CodeIcon size={14} />
                Code
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="preview">
                <AppWindowIcon size={14} />
                Preview
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="console">
                <TerminalIcon size={14} />
                Console
              </SandboxTabsTrigger>
            </SandboxTabsList>
            <SandboxTabsContent value="files">
              <SandboxFileExplorer />
            </SandboxTabsContent>
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
        </SandboxLayout>
      </SandboxProvider>
    </div>
  ),
  args: {
    files: {
      '/App.js': `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      textAlign: 'center',
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h1>Counter App</h1>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '50%',
            background: '#007bff',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          -
        </button>
        <span style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          minWidth: '60px'
        }}>
          {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '50%',
            background: '#007bff',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}`,
    },
  },
};

/**
 * TypeScript sandbox with type checking enabled.
 */
export const TypeScript: Story = {
  render: (args) => (
    <div className="h-[600px] w-full">
      <SandboxProvider {...args}>
        <SandboxLayout>
          <SandboxTabs defaultValue="code">
            <SandboxTabsList>
              <SandboxTabsTrigger value="code">
                <CodeIcon size={14} />
                Code
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="preview">
                <AppWindowIcon size={14} />
                Preview
              </SandboxTabsTrigger>
              <SandboxTabsTrigger value="console">
                <TerminalIcon size={14} />
                Console
              </SandboxTabsTrigger>
            </SandboxTabsList>
            <SandboxTabsContent value="code">
              <SandboxCodeEditor showTabs />
            </SandboxTabsContent>
            <SandboxTabsContent value="preview">
              <SandboxPreview />
            </SandboxTabsContent>
            <SandboxTabsContent value="console">
              <SandboxConsole />
            </SandboxTabsContent>
          </SandboxTabs>
        </SandboxLayout>
      </SandboxProvider>
    </div>
  ),
  args: {
    template: 'react-ts',
    files: {
      '/App.tsx': `import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]);

  const addUser = () => {
    const newUser: User = {
      id: users.length + 1,
      name: \`User \${users.length + 1}\`,
      email: \`user\${users.length + 1}@example.com\`,
    };
    setUsers([...users, newUser]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>TypeScript User List</h1>
      <button onClick={addUser} style={{ marginBottom: '20px' }}>
        Add User
      </button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;`,
    },
  },
};

/**
 * Minimal sandbox showing only the code editor.
 */
export const CodeEditorOnly: Story = {
  render: (args) => (
    <div className="h-[400px] w-full">
      <SandboxProvider {...args}>
        <SandboxLayout>
          <SandboxCodeEditor />
        </SandboxLayout>
      </SandboxProvider>
    </div>
  ),
  args: {
    files: {
      '/App.js': `// Welcome to the code editor!
// Try editing this code and see the changes

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
console.log(greet('Sandbox'));

// Add your code here...`,
    },
  },
};
