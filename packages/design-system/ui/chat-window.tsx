/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import * as React from 'react';

import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Textarea } from './textarea';
import { cn } from '@repo/design-system/lib/utils';

// Types for chat messages
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  position?: { x: number; y: number };
  onSendMessage?: (message: string) => void;
  messages?: ChatMessage[];
  agentName?: string;
  userName?: string;
  /**
   * Whether the chat window should follow the avatar position in real-time
   */
  followAvatarPosition?: boolean;
}

export function ChatWindow({
  isOpen,
  onClose,
  className,
  position = { x: 200, y: 200 },
  onSendMessage,
  messages = [],
  agentName = 'Support Agent',
  userName = 'You',
  followAvatarPosition = false,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Sample emojis for the simple picker
  const emojis = ['😊', '👍', '🙏', '❤️', '😂', '🎉', '👋', '🤔', '👀', '🚀', '✅', '⭐', '🔥', '💯', '🙌'];

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue.trim());
      setInputValue('');
      textareaRef.current?.focus();
    }
  };

  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Insert emoji into textarea
  const insertEmoji = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  // Use useEffect to update the chat position when the avatar position changes
  React.useEffect(() => {
    // This effect runs whenever the position prop changes
    // This ensures the chat window follows the avatar in real-time
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
      style={{ zIndex: 9999 }}
    >
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="font-medium">Chat with {agentName}</div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground p-4">
              <p className="text-center text-sm">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex max-w-[80%] flex-col rounded-lg p-3',
                  message.sender === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <div className="text-sm">{message.content}</div>
                <div className="mt-1 text-xs opacity-70">
                  {message.sender === 'user' ? userName : agentName} • {formatTime(message.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border p-3">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-[60px] max-h-[120px] w-full resize-none pr-12 overflow-auto"
          />

          <div className="absolute bottom-1 right-1 flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
              <span className="sr-only">Add emoji</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="h-8 rounded-full"
            >
              Send
            </Button>
          </div>

          {/* Simple emoji picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-2 grid grid-cols-5 gap-1 rounded-lg border border-border bg-background p-2 shadow-lg"
              >
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
