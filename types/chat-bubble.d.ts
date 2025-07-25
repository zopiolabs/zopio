/**
 * SPDX-License-Identifier: MIT
 */

declare module 'chat-bubble' {
  export interface BubblesOptions {
    inputCallbackFn?: (message: string) => void;
    responseCallbackFn?: (message: string) => void;
  }

  export interface ConversationObject {
    ice: {
      says: string[];
      reply?: Array<{
        question: string;
        answer: string;
      }>;
    };
    [key: string]: {
      says: string[];
      reply?: Array<{
        question: string;
        answer: string;
      }>;
    };
  }

  export class Bubbles {
    constructor(container: HTMLElement, options?: BubblesOptions | string);

    talk(conversation: ConversationObject): void;

    standby(): void;

    think(): void;

    stop(): void;

    hear(message: string): void;

    say(message: string | string[]): void;

    typing(options?: {
      delay?: number;
      message?: string | string[];
    }): void;
  }

  export function prepHTML(options: {
    relative_path?: string;
    container?: string;
  }): void;
}
