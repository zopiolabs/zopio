# @core/live-events

Edge-safe, tree-shakable realtime event system for Zopio core layer.

## Features

- Plug & play LiveProvider interface
- Basic Socket.IO implementation
- Easily extendable to other providers like Supabase or Ably

## Usage

```ts
import { SocketIOLiveProvider } from "@core/live-events";

const live = new SocketIOLiveProvider("https://localhost:3000");

live.subscribe("my-room", (data) => {
  console.log("Received:", data);
});
```
