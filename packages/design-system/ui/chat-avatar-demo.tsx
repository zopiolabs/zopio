/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';

import { GlobalDraggableAvatar } from './global-draggable-avatar';
import { Button } from './button';

export function ChatAvatarDemo() {
  const [showAvatar, setShowAvatar] = React.useState(true);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Avatar Demo</h1>
      
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAvatar(true)} 
            variant={showAvatar ? "default" : "outline"}
          >
            Show Chat Avatar
          </Button>
          <Button 
            onClick={() => setShowAvatar(false)} 
            variant={!showAvatar ? "default" : "outline"}
          >
            Hide Chat Avatar
          </Button>
        </div>
        
        <div className="p-4 border rounded-lg">
          <p className="mb-4">
            This demo shows the enhanced Global Draggable Avatar with chat functionality.
            Click on the avatar to toggle the chat window.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The avatar has a green indicator showing it has chat capabilities</li>
            <li>Click the avatar to open/close the chat window</li>
            <li>The chat window can be dragged independently</li>
            <li>Type a message and press Enter or click Send to send it</li>
            <li>Use the emoji picker to add emojis to your message</li>
          </ul>
        </div>
      </div>
      
      {showAvatar && (
        <GlobalDraggableAvatar
          initials="CS"
          size="lg"
          bgColor="#0ea5e9"
          textColor="#ffffff"
          initialPosition={{ x: 100, y: 100 }}
          label="Chat Support"
          useChatWindow={true}
          agentName="Support Agent"
          userName="You"
          initialMessages={[
            {
              id: 'msg-1',
              content: 'Welcome to our support chat! How can I help you today?',
              sender: 'agent',
              timestamp: new Date(),
            },
          ]}
        />
      )}
    </div>
  );
}
