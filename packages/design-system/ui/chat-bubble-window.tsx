/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@repo/design-system/lib/utils';

// Define the message interface
export interface ChatBubbleMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface ChatBubbleWindowProps {
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
   * Name of the user in the chat
   */
  userName?: string;
  /**
   * Initial messages to display
   */
  initialMessages?: ChatBubbleMessage[];
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
}

export function ChatBubbleWindow({
  className,
  position,
  agentName = 'Agent',
  userName = 'You',
  initialMessages = [],
  onSendMessage,
  onClose,
  onDrag,
}: ChatBubbleWindowProps) {
  const [messages, setMessages] = useState<ChatBubbleMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Common emojis for quick selection
  const commonEmojis = ['😊', '👍', '❤️', '🙏', '😂', '🎉', '👋', '🤔'];

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat-bubble after component mounts
  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
    
    // Add chat-bubble specific styling
    const style = document.createElement('style');
    style.textContent = `
      .bubble-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 10px;
      }
      .bubble {
        position: relative;
        max-width: 80%;
        border-radius: 10px;
        padding: 8px 12px;
        margin-bottom: 8px;
        clear: both;
      }
      .bubble.user {
        float: right;
        background-color: #0084ff;
        color: white;
        border-bottom-right-radius: 2px;
      }
      .bubble.agent {
        float: left;
        background-color: #f1f0f0;
        color: black;
        border-bottom-left-radius: 2px;
      }
      .bubble-timestamp {
        font-size: 0.7rem;
        opacity: 0.7;
        margin-top: 4px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up the style element when component unmounts
      document.head.removeChild(style);
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: ChatBubbleMessage = {
        id: `msg-${Date.now()}`,
        content: inputValue.trim(),
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue('');
      onSendMessage?.(inputValue.trim());

      // Simulate agent response after a delay
      setTimeout(() => {
        const agentResponse: ChatBubbleMessage = {
          id: `msg-${Date.now() + 1}`,
          content: `Thanks for your message! This is a simulated response from ${agentName}.`,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentResponse]);
      }, 1000);
    }
  };

  // Handle key press in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add emoji to input
  const addEmoji = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        transition: { type: 'spring', bounce: 0.2, duration: 0.5 }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onDrag?.({ x: position.x + info.offset.x, y: position.y + info.offset.y });
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

      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="bubble-container flex-1 overflow-y-auto p-3"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "bubble",
              message.sender === 'user' ? "user" : "agent"
            )}
          >
            {message.content}
            <div className="bubble-timestamp">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="border-t border-border bg-background p-2">
          <div className="flex flex-wrap gap-2">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="cursor-pointer rounded p-1 text-lg hover:bg-muted"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex-none rounded p-2 hover:bg-muted"
            aria-label="Emoji picker"
          >
            <span role="img" aria-label="emoji">😊</span>
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="flex-none rounded bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
}
