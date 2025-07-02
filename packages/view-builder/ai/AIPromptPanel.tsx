/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import { Button } from '@repo/design-system/components/ui/button';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { useState } from 'react';
import { useSchemaState } from '../hooks/useSchemaState.js';

export function AIPromptPanel() {
  const { setSchema } = useSchemaState();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSchema = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setSchema(data);
    } catch (err) {
      console.error('AI error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">AI Assistant</h3>
      <Textarea
        rows={3}
        placeholder="Create a form for user profile with name, email, and bio"
        value={prompt}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setPrompt(e.target.value)
        }
      />
      <Button
        onClick={generateSchema}
        disabled={loading || !prompt}
        className="w-full"
      >
        {loading ? 'Generating...' : 'Generate View'}
      </Button>
    </div>
  );
}
