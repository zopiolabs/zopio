# @repo/event-bus

Lightweight internal event bus for Zopio core modules and plugins.

## Features

- `on(event, handler)` to listen for events
- `off(event, handler)` to remove listeners
- `once(event, handler)` for one-time listeners
- `emit(event, payload)` to publish an event
- Built-in constants for common core events
- Type-safe event handling with TypeScript generics

## Usage

```ts
import { EventBusInstance, CoreEvents } from '@repo/event-bus';

// Type-safe event handling
type UserCreatedEvent = { email: string; id: string };

EventBusInstance.on<UserCreatedEvent>(CoreEvents.USER_CREATED, async (payload) => {
  console.log('Welcome email for:', payload.email);
});

await EventBusInstance.emit(CoreEvents.USER_CREATED, { 
  email: 'hi@zopio.dev', 
  id: 'user_123' 
});
```