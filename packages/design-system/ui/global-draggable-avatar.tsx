/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { ChatBubbleIntegration } from './chat-bubble-integration';
import { ChatMessage, ChatWindow } from './chat-window';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@repo/design-system/lib/utils';

export interface GlobalDraggableAvatarProps {
  /**
   * The initials to display when no image is available
   */
  initials?: string;
  /**
   * Optional image URL for the avatar
   */
  imageUrl?: string;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Whether to use the chat-bubble interface instead of the default chat window
   */
  useChatBubble?: boolean;
  /**
   * Optional size override (default is 'md')
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional background color for the avatar fallback
   */
  bgColor?: string;
  /**
   * Optional text color for the avatar fallback
   */
  textColor?: string;
  /**
   * Optional z-index for the avatar
   */
  zIndex?: number;
  /**
   * Initial position of the avatar
   */
  initialPosition?: { x: number; y: number };
  /**
   * Optional label to display above the avatar
   */
  label?: string;
  /**
   * Optional popover message to display when clicked
   */
  popoverMessage?: string;
  /**
   * Whether to show the popover
   */
  showPopover?: boolean;
  /**
   * Whether to use the enhanced chat window instead of a simple popover
   */
  useChatWindow?: boolean;
  /**
   * Optional agent name for the chat window
   */
  agentName?: string;
  /**
   * Optional user name for the chat window
   */
  userName?: string;
  /**
   * Optional initial messages for the chat window
   */
  initialMessages?: ChatMessage[];
  /**
   * Optional callback when a message is sent
   */
  onSendMessage?: (message: string) => void;
}

/**
 * A global draggable avatar component that can be freely moved around the entire screen
 * This component is rendered at the document.body level via a portal
 */
export function GlobalDraggableAvatar({
  initials = 'AB',
  imageUrl,
  className,
  size = 'md',
  bgColor = '#6366f1',
  textColor = '#ffffff',
  zIndex = 9999,
  initialPosition = { x: 100, y: 100 },
  label = 'Chat with me',
  popoverMessage = 'How can we help you today?',
  showPopover = true,
  useChatWindow,
  useChatBubble,
  agentName = 'Agent',
  userName = 'You',
  initialMessages = [],
  onSendMessage,
}: GlobalDraggableAvatarProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'size-8',
    md: 'size-12',
    lg: 'size-16',
    xl: 'size-20',
  };

  const [isMounted, setIsMounted] = React.useState(false);
  // Set isChatOpen to true by default if we want to show it immediately for testing
  const [isChatOpen, setIsChatOpen] = React.useState(useChatWindow);
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  // Track the avatar position to keep the chat window/bubble anchored to it
  const [avatarPosition, setAvatarPosition] = React.useState(initialPosition);

  // Calculate chat position relative to avatar position
  const chatPosition = React.useMemo(() => ({
    x: avatarPosition.x + 50,
    y: avatarPosition.y - 150
  }), [avatarPosition]);

  // Reference to track the chat element for positioning
  const chatRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Call the external handler if provided
    if (onSendMessage) {
      onSendMessage(content);
    }

    // Simulate agent response after a short delay
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: 'Thank you for your message. How else can I assist you today?',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const avatarComponent = (
    <>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ x: initialPosition.x, y: initialPosition.y }}
        style={{
          position: 'fixed',
          zIndex,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className="cursor-grab active:cursor-grabbing"
        onDrag={(_, info) => {
          // Update avatar position when dragged
          setAvatarPosition({
            x: info.point.x,
            y: info.point.y
          });
        }}
      >
        {/* Label above the avatar */}
        <div className="mb-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium shadow-sm animate-pulse flex items-center gap-1">
          {(useChatWindow || useChatBubble) && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
          )}
          {label}
        </div>

        {/* Avatar with popover or click handler for chat */}
        {showPopover && !useChatWindow ? (
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 10
                }}
                className="rounded-full"
              >
                <Avatar
                  className={cn(
                    sizeClasses[size],
                    'shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background transition-all duration-300',
                    className
                  )}
                >
                  {imageUrl && <AvatarImage src={imageUrl} alt={initials} />}
                  <AvatarFallback
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 shadow-lg" sideOffset={5}>
              <p className="text-sm font-medium">{popoverMessage}</p>
            </PopoverContent>
          </Popover>
        ) : (
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)'
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}
            className="rounded-full"
            onClick={(useChatWindow || useChatBubble) ? toggleChat : undefined}
          >
            <Avatar
              className={cn(
                sizeClasses[size],
                'shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background transition-all duration-300',
                className
              )}
            >
              {imageUrl && <AvatarImage src={imageUrl} alt={initials} />}
              <AvatarFallback
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window or Chat Bubble */}
      <AnimatePresence>
        {isChatOpen && (
          useChatBubble ? (
            <ChatBubbleIntegration
              position={chatPosition}
              agentName={agentName}
              initialMessages={messages.map(msg => ({
                content: msg.content,
                sender: msg.sender
              }))}
              onSendMessage={handleSendMessage}
              onClose={() => setIsChatOpen(false)}
              // Position is now derived from avatar position
              followAvatarPosition={true}
            />
          ) : useChatWindow ? (
            <ChatWindow
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              position={chatPosition}
              onSendMessage={handleSendMessage}
              messages={messages}
              agentName={agentName}
              userName={userName}
              followAvatarPosition={true}
            />
          ) : null
        )}
      </AnimatePresence>
    </>
  );

  // Only render in the browser, not during SSR
  if (!isMounted) return null;

  // Use createPortal to render at document.body level
  return createPortal(avatarComponent, document.body);
}
