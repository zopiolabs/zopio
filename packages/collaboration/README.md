# @repo/collaboration

## Overview

The `@repo/collaboration` package provides real-time collaboration features for Zopio applications using Liveblocks as the underlying collaboration engine. It enables multi-user editing, presence awareness, cursors, comments, and other collaborative features with a simple, type-safe API.

## Module Categories

### Core Components

- **Room Provider**: React components for setting up collaborative spaces
- **Authentication**: Server-side authentication for secure collaboration sessions
- **Presence Tracking**: Real-time user presence and cursor tracking

### Hooks and Utilities

- **Collaboration Hooks**: React hooks for managing collaborative state
- **Type Definitions**: TypeScript types for collaboration data structures
- **Configuration**: Environment-based configuration for Liveblocks integration

## Usage Guidelines

### Basic Setup

1. Add your Liveblocks secret key to your environment variables:

```env
LIVEBLOCKS_SECRET=sk_your_secret_key_here
```

2. Create an authentication endpoint in your Next.js application:

```tsx
// app/api/liveblocks-auth/route.ts
import { authenticate } from '@repo/collaboration/auth';
import { auth } from '@repo/auth/server';

export async function POST(request: Request) {
  const { userId, user } = auth();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Get the organization ID from the authenticated user
  const orgId = user?.orgId || 'default';
  
  // Return the Liveblocks authentication response
  return authenticate({
    userId,
    orgId,
    userInfo: {
      name: user?.name || 'Anonymous',
      avatar: user?.imageUrl,
      color: user?.color || '#000000',
    },
  });
}
```

3. Set up a collaborative room in your component:

```tsx
'use client';

import { Room } from '@repo/collaboration/room';
import { useMyPresence, useOthers } from '@repo/collaboration/hooks';

export default function CollaborativeEditor({ roomId }) {
  return (
    <Room
      id={`org-123:${roomId}`}
      authEndpoint="/api/liveblocks-auth"
      fallback={<div>Loading collaborative session...</div>}
    >
      <CollaborativeContent />
    </Room>
  );
}

function CollaborativeContent() {
  // Get and update the current user's presence
  const [myPresence, updateMyPresence] = useMyPresence();
  
  // Get other users in the room
  const others = useOthers();
  
  // Track cursor position
  const handlePointerMove = (e: React.PointerEvent) => {
    updateMyPresence({
      cursor: { x: e.clientX, y: e.clientY },
    });
  };
  
  // Clear cursor when leaving
  const handlePointerLeave = () => {
    updateMyPresence({
      cursor: null,
    });
  };
  
  return (
    <div 
      className="h-full w-full relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Your collaborative UI */}
      <div className="p-4">
        <h1>Collaborative Document</h1>
        {/* Collaborative content here */}
      </div>
      
      {/* Render other users' cursors */}
      {others.map(({ connectionId, presence, info }) => {
        if (!presence.cursor) return null;
        
        return (
          <div
            key={connectionId}
            className="absolute pointer-events-none"
            style={{
              left: presence.cursor.x,
              top: presence.cursor.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: info.color }}
            />
            <div className="bg-white text-xs px-2 py-1 rounded shadow-sm">
              {info.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Using Collaborative Storage

```tsx
'use client';

import { Room } from '@repo/collaboration/room';
import { useStorage, useMutation } from '@repo/collaboration/hooks';

// Extend the global Liveblocks Storage type
declare global {
  interface Liveblocks {
    Storage: {
      notes: LiveList<{ text: string; author: string }>;
    };
  }
}

function CollaborativeNotes() {
  // Access the collaborative storage
  const notes = useStorage((root) => root.notes);
  
  // Create a mutation to add a new note
  const addNote = useMutation(({ storage, self }) => {
    storage.get('notes').push({
      text: 'New note',
      author: self.info.name || 'Anonymous',
    });
  }, []);
  
  return (
    <div>
      <h2>Collaborative Notes</h2>
      <button onClick={() => addNote()}>Add Note</button>
      
      <ul>
        {notes?.map((note, index) => (
          <li key={index}>
            <strong>{note.author}:</strong> {note.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Implementing Collaborative Comments

```tsx
'use client';

import { Room } from '@repo/collaboration/room';
import { useThreads, useCreateThread } from '@repo/collaboration/hooks';

// Extend the global Liveblocks ThreadMetadata type
declare global {
  interface Liveblocks {
    ThreadMetadata: {
      x: number;
      y: number;
    };
  }
}

function CollaborativeComments() {
  const { threads } = useThreads();
  const createThread = useCreateThread();
  
  const handleCreateComment = (e: React.MouseEvent) => {
    createThread({
      metadata: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  };
  
  return (
    <div className="relative h-full w-full" onClick={handleCreateComment}>
      {/* Your content */}
      
      {/* Render comment threads */}
      {threads.map((thread) => (
        <div
          key={thread.id}
          className="absolute"
          style={{
            left: thread.metadata.x,
            top: thread.metadata.y,
          }}
        >
          <div className="bg-white rounded-full shadow-md p-1">
            <span>{thread.comments.length}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/collaboration
```

## Environment Variables

| Variable | Description | Format |
| --- | --- | --- |
| `LIVEBLOCKS_SECRET` | Liveblocks secret key for server-side authentication | Starts with `sk_` |

## Development Guidelines

### Extending Liveblocks Types

To add custom data types for your collaborative features, extend the global Liveblocks interface in your application:

```tsx
// In your types.ts file
import type { LiveList, LiveMap, LiveObject } from '@liveblocks/client';

declare global {
  interface Liveblocks {
    // Extend Presence type
    Presence: {
      cursor: { x: number; y: number } | null;
      // Add more presence fields
      status: 'online' | 'away' | 'busy';
      currentPage: string;
    };

    // Extend Storage type
    Storage: {
      // Add your collaborative data structures
      document: LiveObject<{
        title: string;
        content: string;
      }>;
      comments: LiveList<LiveObject<{
        id: string;
        text: string;
        author: string;
        createdAt: number;
      }>>;
      userPreferences: LiveMap<string, unknown>;
    };

    // Extend UserMeta type
    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        color: string;
        role: string;
      };
    };

    // Add custom events
    RoomEvent:
      | { type: 'CURSOR_CLICK'; position: { x: number; y: number } }
      | { type: 'PAGE_CHANGE'; page: string };
  }
}
```

### Creating Custom Hooks

To create custom hooks for your collaborative features:

```tsx
import { useMyPresence, useOthers, useStorage } from '@repo/collaboration/hooks';

// Custom hook for tracking active users
export function useActiveUsers() {
  const others = useOthers();
  const activeUsers = others.filter(
    (user) => user.presence.status === 'online'
  );
  
  return {
    count: activeUsers.length,
    users: activeUsers.map((user) => ({
      id: user.connectionId,
      name: user.info.name,
      avatar: user.info.avatar,
    })),
  };
}

// Custom hook for collaborative document editing
export function useCollaborativeDocument() {
  const [myPresence, updateMyPresence] = useMyPresence();
  const document = useStorage((root) => root.document);
  
  const updateTitle = useMutation(
    ({ storage }, title: string) => {
      storage.get('document').update({ title });
    },
    []
  );
  
  const updateContent = useMutation(
    ({ storage }, content: string) => {
      storage.get('document').update({ content });
    },
    []
  );
  
  return {
    title: document?.title || '',
    content: document?.content || '',
    updateTitle,
    updateContent,
    currentEditor: myPresence.currentPage === 'editor',
    setEditing: (isEditing: boolean) => {
      updateMyPresence({
        currentPage: isEditing ? 'editor' : 'viewer',
      });
    },
  };
}
```

## Integration Examples

### With Next.js App Router

```tsx
// app/documents/[id]/page.tsx
import { Room } from '@repo/collaboration/room';
import DocumentEditor from './document-editor';

export default function DocumentPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen w-full">
      <Room
        id={`documents:${params.id}`}
        authEndpoint="/api/liveblocks-auth"
        fallback={<div>Loading document...</div>}
      >
        <DocumentEditor documentId={params.id} />
      </Room>
    </div>
  );
}
```

### With User Presence Awareness

```tsx
'use client';

import { useOthers, useMyPresence } from '@repo/collaboration/hooks';

export function PresenceIndicator() {
  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();
  
  const setStatus = (status: 'online' | 'away' | 'busy') => {
    updateMyPresence({ status });
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {others.map((user) => (
          <div
            key={user.connectionId}
            className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
            title={user.info.name}
          >
            {user.info.avatar ? (
              <img
                src={user.info.avatar}
                alt={user.info.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{ backgroundColor: user.info.color }}
              >
                {user.info.name?.charAt(0)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="ml-2">
        <span>{others.length} online</span>
      </div>
      
      <div className="ml-auto">
        <select
          value={myPresence.status || 'online'}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border rounded p-1"
        >
          <option value="online">Online</option>
          <option value="away">Away</option>
          <option value="busy">Busy</option>
        </select>
      </div>
    </div>
  );
}
```

## Liveblocks Dashboard

To monitor and manage your collaborative spaces:

1. Log in to your Liveblocks dashboard at [https://liveblocks.io/dashboard](https://liveblocks.io/dashboard)
2. Navigate to your project
3. View active rooms, users, and usage metrics
4. Configure webhooks and other integration settings

## Documentation References

- [Liveblocks Documentation](https://liveblocks.io/docs)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new functionality
5. Follow the project's naming conventions

## License

MIT
