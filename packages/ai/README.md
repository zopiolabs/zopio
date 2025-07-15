# @repo/ai

## Overview

The `@repo/ai` package provides a streamlined interface for integrating AI capabilities into Zopio applications. It wraps and extends the [Vercel AI SDK](https://github.com/vercel/ai) with pre-configured OpenAI models, React components for AI chat interfaces, and utilities for managing API keys securely.

## Module Categories

### Core Components

- **Message**: A styled component for rendering AI and user messages with Markdown support
- **Thread**: A container component for organizing a sequence of messages in a chat interface

### Utilities

- **API Key Management**: Secure handling of OpenAI API keys using environment variables
- **Pre-configured Models**: Ready-to-use OpenAI model configurations for chat and embeddings
- **React Hooks**: Re-exports of Vercel AI SDK React hooks for chat and completion interfaces

## Usage Guidelines

### Basic Setup

1. Add your OpenAI API key to your environment variables:

```env
OPENAI_API_KEY=sk-your-api-key
```

2. Import and use the components and utilities:

```tsx
import { useChat } from '@repo/ai/lib/react';
import { Message, Thread } from '@repo/ai/components';

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-full">
      <Thread>
        {messages.map((message) => (
          <Message key={message.id} data={message} />
        ))}
      </Thread>
      
      <form onSubmit={handleSubmit} className="p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something..."
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
}
```

### Using Pre-configured Models

```tsx
import { models } from '@repo/ai/lib/models';

// For chat completions
const response = await models.chat.complete({
  messages: [{ role: 'user', content: 'Hello, AI assistant!' }]
});

// For embeddings
const embeddings = await models.embeddings.embed({
  input: 'Text to be embedded'
});
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/ai
```

## Development Guidelines

### Adding New Models

To add a new model configuration, extend the `models` object in `lib/models.ts`:

```typescript
export const models = {
  chat: openai('gpt-4o-mini'),
  embeddings: openai('text-embedding-3-small'),
  // Add your new model here
  vision: openai('gpt-4-vision'),
};
```

### Creating Custom Components

When creating new components, follow these guidelines:

1. Use TypeScript for type safety
2. Use Tailwind CSS for styling with alphabetized classes
3. Follow the PascalCase naming convention for component files
4. Include SPDX license headers in all files

## Integration Examples

### Chat Interface with Streaming

```tsx
import { useChat } from '@repo/ai/lib/react';
import { Message, Thread } from '@repo/ai/components';

export function ChatWithStreaming() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  
  return (
    <div className="flex flex-col h-[600px]">
      <Thread className="flex-1">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            data={message} 
            markdown={{ 
              components: { 
                code: ({ children }) => (
                  <code className="bg-muted/50 p-1 rounded">{children}</code>
                )
              } 
            }}
          />
        ))}
        {isLoading && <div className="self-start animate-pulse">AI is thinking...</div>}
      </Thread>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
}
```

## Documentation References

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [React Markdown Documentation](https://github.com/remarkjs/react-markdown)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
