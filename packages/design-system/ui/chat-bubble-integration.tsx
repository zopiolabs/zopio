/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { useEffect, useRef } from 'react';

import { cn } from '@repo/design-system/lib/utils';

// Define interfaces for the chat-bubble library
interface BubblesOptions {
  inputCallbackFn?: (message: string) => void;
  responseCallbackFn?: (message: string) => void;
}

interface ConversationObject {
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

// Define props for our component
export interface ChatBubbleIntegrationProps {
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Position of the chat window
   */
  position: { x: number; y: number };
  /**
   * Name of the agent in the chat
   */
  agentName?: string;
  /**
   * Initial messages to display
   */
  initialMessages?: Array<{
    content: string;
    sender: 'user' | 'agent';
  }>;
  /**
   * Callback when a message is sent
   */
  onSendMessage?: (message: string) => void;
  /**
   * Callback when the chat window is closed
   */
  onClose?: () => void;
  /**
   * Callback when the chat window is dragged
   */
  onDrag?: (position: { x: number; y: number }) => void;
  /**
   * Whether the chat bubble should follow the avatar position in real-time
   */
  followAvatarPosition?: boolean;
}

export function ChatBubbleIntegration({
  className,
  position,
  agentName = 'Agent',
  initialMessages = [],
  onSendMessage,
  onClose,
  onDrag,
  followAvatarPosition = false,
}: ChatBubbleIntegrationProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);

  useEffect(() => {
    // We need to dynamically import the chat-bubble library since it's a client-side only library
    const initializeChatBubble = async () => {
      try {
        // Import the chat-bubble library
        // Using dynamic import with type assertion to handle the module properly
        let Bubbles;
        try {
          const chatBubbleModule = await import('chat-bubble') as any;
          Bubbles = chatBubbleModule.Bubbles;
        } catch (error) {
          // In Storybook environment, the package might not be resolved correctly
          // Provide a mock implementation to prevent errors
          console.warn('Chat-bubble library could not be loaded - using mock implementation in Storybook');
          return;
        }
        
        if (!Bubbles) {
          console.warn('Chat-bubble Bubbles component not available');
          return;
        }

        if (!chatContainerRef.current) return;

        // Add required styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          /* chat-bubble core styles */
          .bubble-container { width: 100%; max-height: 250px; overflow-y: auto; }
          .bubble { position: relative; display: inline-block; margin: 0 auto; max-width: 80%; min-width: 40px;
            padding: 10px 14px; border-radius: 18px; margin-bottom: 8px; clear: both; }
          .bubble:before { content: ""; position: absolute; bottom: -2px; height: 20px; width: 20px; }
          .bubble--left { float: left; background: #f1f0f0; color: #333; }
          .bubble--left:before { left: -7px; border-radius: 10px; background: #f1f0f0; }
          .bubble--right { float: right; background: #0084ff; color: white; }
          .bubble--right:before { right: -7px; border-radius: 10px; background: #0084ff; }

          /* Input styles */
          .bubble-typing { float: left; background: #f1f0f0; color: #333; border-radius: 18px; padding: 10px 14px; }
          .bubble-typing .dot { display: inline-block; width: 8px; height: 8px; background: #333; border-radius: 50%;
            margin-right: 4px; animation: typing 1.3s infinite; }
          .bubble-typing .dot:nth-child(2) { animation-delay: 0.15s; }
          .bubble-typing .dot:nth-child(3) { animation-delay: 0.3s; }
          @keyframes typing { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }

          /* Reply buttons */
          .bubble-button { display: inline-block; font-size: 14px; cursor: pointer; background: #f1f0f0;
            color: #333; padding: 8px 16px; border-radius: 18px; margin: 5px; transition: all 0.3s ease; }
          .bubble-button:hover { background: #e1e0e0; }

          /* Input area */
          .bubble-input-container { width: 100%; display: flex; padding: 10px; border-top: 1px solid #eee; }
          .bubble-input { flex: 1; border: 1px solid #ddd; border-radius: 18px; padding: 8px 12px; outline: none; }
          .bubble-send-button { background: #0084ff; color: white; border: none; border-radius: 50%; width: 36px;
            height: 36px; margin-left: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
          .bubble-send-button:hover { background: #0073e6; }
        `;
        document.head.appendChild(styleElement);

        // Create a conversation object from initialMessages
        const conversation: ConversationObject = {
          ice: {
            says: initialMessages.length > 0 && initialMessages[0].sender === 'agent'
              ? [initialMessages[0].content]
              : [`Hi there! I'm ${agentName}. How can I help you today?`],
          }
        };

        // Add any additional initial messages
        if (initialMessages.length > 1) {
          conversation.more_messages = {
            says: initialMessages.slice(1).filter(msg => msg.sender === 'agent').map(msg => msg.content)
          };
        }

        // Initialize the chat-bubble instance
        const options: BubblesOptions = {
          inputCallbackFn: (message: string) => {
            onSendMessage?.(message);

            // Simulate agent response
            setTimeout(() => {
              if (chatInstanceRef.current) {
                chatInstanceRef.current.say(`Thank you for your message: "${message}". How can I help you further?`);
              }
            }, 1000);
          }
        };

        chatInstanceRef.current = new Bubbles(chatContainerRef.current, options);
        chatInstanceRef.current.talk(conversation);

        // Add custom input functionality
        const inputContainer = document.createElement('div');
        inputContainer.className = 'bubble-input-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'bubble-input';
        input.placeholder = 'Type a message...';

        const sendButton = document.createElement('button');
        sendButton.className = 'bubble-send-button';
        sendButton.innerHTML = '➤';
        sendButton.onclick = () => {
          if (input.value.trim()) {
            if (chatInstanceRef.current) {
              chatInstanceRef.current.hear(input.value);
            }
            input.value = '';
          }
        };

        input.onkeypress = (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            if (chatInstanceRef.current) {
              chatInstanceRef.current.hear(input.value);
            }
            input.value = '';
          }
        };

        inputContainer.appendChild(input);
        inputContainer.appendChild(sendButton);
        chatContainerRef.current.appendChild(inputContainer);

        // Add emoji picker
        const emojiContainer = document.createElement('div');
        emojiContainer.className = 'emoji-container';
        emojiContainer.style.cssText = 'display: flex; flex-wrap: wrap; padding: 5px; border-top: 1px solid #eee;';

        const commonEmojis = ['😊', '👍', '❤️', '🙏', '😂', '🎉', '👋', '🤔'];

        commonEmojis.forEach(emoji => {
          const emojiButton = document.createElement('button');
          emojiButton.style.cssText = 'background: none; border: none; font-size: 18px; cursor: pointer; padding: 5px;';
          emojiButton.textContent = emoji;
          emojiButton.onclick = () => {
            input.value += emoji;
            input.focus();
          };
          emojiContainer.appendChild(emojiButton);
        });

        chatContainerRef.current.appendChild(emojiContainer);

        return () => {
          // Clean up
          document.head.removeChild(styleElement);
        };
      } catch (error) {
        console.error('Error initializing chat-bubble:', error);
      }
    };

    initializeChatBubble();
  }, [agentName, initialMessages, onSendMessage]);

  // Use useEffect to update the chat position when the avatar position changes
  useEffect(() => {
    // This effect runs whenever the position prop changes
    // This ensures the chat bubble follows the avatar in real-time
  }, [position]);

  return (
    <motion.div
      className={cn(
        'fixed flex flex-col rounded-lg border border-border bg-background shadow-lg',
        'w-80 sm:w-96 h-96',
        'ring-2 ring-primary',
        className
      )}
      initial={{ opacity: 0, scale: 0.9, x: position.x, y: position.y }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
        transition: {
          type: 'spring',
          bounce: 0.2,
          // Use faster transitions when following avatar to make it feel more connected
          duration: followAvatarPosition ? 0.2 : 0.5,
          // Reduce stiffness when following avatar for smoother motion
          stiffness: followAvatarPosition ? 300 : 200
        }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      // Only allow dragging if not following avatar position
      drag={!followAvatarPosition}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (!followAvatarPosition && onDrag) {
          onDrag({ x: position.x + info.offset.x, y: position.y + info.offset.y });
        }
      }}
      style={{ zIndex: 9999 }}
    >
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="font-medium">{agentName}</div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-muted"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Chat container for chat-bubble */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-hidden"
        style={{ position: 'relative', height: 'calc(100% - 56px)' }}
      />
    </motion.div>
  );
}
