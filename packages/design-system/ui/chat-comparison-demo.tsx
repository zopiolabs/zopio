/**
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { GlobalDraggableAvatar } from './global-draggable-avatar';
import { Toggle } from './toggle';

/**
 * Props for the ChatComparisonDemo component
 */
interface ChatComparisonDemoProps {
  /**
   * Optional class name for the component
   */
  className?: string;
}

/**
 * A demo component that showcases both chat interfaces (custom chat window and chat-bubble)
 */
export function ChatComparisonDemo({ className }: ChatComparisonDemoProps) {
  const [showAvatars, setShowAvatars] = useState(false);
  const [useChatBubble, setUseChatBubble] = useState(true);
  
  // Sample messages for demonstration
  const initialMessages = [
    {
      id: 'msg-1',
      content: 'Welcome to our chat! How can I help you today?',
      sender: 'agent' as const,
      timestamp: new Date(),
    },
    {
      id: 'msg-2',
      content: 'I have a question about your services.',
      sender: 'user' as const,
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 'msg-3',
      content: 'Of course! I\'d be happy to help with any questions about our services. What would you like to know?',
      sender: 'agent' as const,
      timestamp: new Date(Date.now() - 30000),
    },
  ];

  return (
    <div className={className}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Chat Interface Comparison</CardTitle>
          <CardDescription>
            Compare the custom chat window with the chat-bubble integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Show Avatars</span>
            <Toggle 
              pressed={showAvatars} 
              onPressedChange={setShowAvatars}
              aria-label="Toggle avatar visibility"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Use Chat Bubble</span>
            <Toggle 
              pressed={useChatBubble} 
              onPressedChange={setUseChatBubble}
              aria-label="Toggle chat interface"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowAvatars(false)}
          >
            Hide Avatars
          </Button>
          <Button 
            onClick={() => setShowAvatars(true)}
          >
            Show Avatars
          </Button>
        </CardFooter>
      </Card>

      {showAvatars && (
        <>
          <GlobalDraggableAvatar
            initials="CB"
            size="lg"
            bgColor="#0ea5e9"
            textColor="#ffffff"
            initialPosition={{ x: 100, y: 200 }}
            label="Chat Bubble"
            useChatBubble={useChatBubble}
            agentName="Chat Bubble Agent"
            initialMessages={initialMessages}
          />
          
          <GlobalDraggableAvatar
            initials="CW"
            size="lg"
            bgColor="#10b981"
            textColor="#ffffff"
            initialPosition={{ x: 100, y: 400 }}
            label="Chat Window"
            useChatWindow={!useChatBubble}
            agentName="Chat Window Agent"
            initialMessages={initialMessages}
          />
        </>
      )}

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Toggle "Show Avatars" to display or hide the chat avatars</li>
          <li>Toggle "Use Chat Bubble" to switch between chat interfaces</li>
          <li>Click on an avatar to open its chat interface</li>
          <li>Drag avatars to reposition them on the screen</li>
          <li>Try sending messages in both interfaces to compare the experience</li>
        </ul>
      </div>
    </div>
  );
}
