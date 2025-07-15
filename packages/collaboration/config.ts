/**
 * SPDX-License-Identifier: MIT
 */

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: Record<string, never>; // Empty storage for now, will be extended later

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name?: string;
        avatar?: string;
        color: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: Record<string, never>; // Empty event type for now
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: Record<string, never>; // Empty thread metadata for now
    // Example usage would be:
    // ThreadMetadata: {
    //   x: number;
    //   y: number;
    // };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: Record<string, never>; // Empty room info for now
    // Example usage would be:
    // RoomInfo: {
    //   title: string;
    //   url: string;
    // };
  }
}

export {};
