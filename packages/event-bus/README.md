# @zopio/event-bus

Lightweight internal event bus for Zopio core modules and plugins.

## Features

- `on(event, handler)` to listen for events
- `off(event, handler)` to remove listeners
- `once(event, handler)` for one-time listeners
- `emit(event, payload)` to publish an event
- Built-in constants for common core events

## Usage

```ts
import { EventBusInstance, CoreEvents } from '@zopio/event-bus';

EventBusInstance.on(CoreEvents.USER_CREATED, async (payload) => {
  console.log('Welcome email for:', payload.email);
});

await EventBusInstance.emit(CoreEvents.USER_CREATED, { email: 'hi@zopio.dev' });
```