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
import { AIPromptPanel } from './ai/AIPromptPanel';
import { DragDropCanvas } from './canvas/DragDropCanvas';
import { SchemaProvider } from './hooks/useSchemaState';
import { JSONEditor } from './json-editor/JSONEditor';
import { Toolbox } from './toolbox/Toolbox';

export function ViewBuilder() {
  return (
    <SchemaProvider>
      <div className="grid h-full grid-cols-5 gap-4 p-4">
        <div className="col-span-1 space-y-4">
          <Toolbox />
          <AIPromptPanel />
        </div>
        <div className="col-span-3">
          <DragDropCanvas />
        </div>
        <div className="col-span-1">
          <JSONEditor />
        </div>
      </div>
    </SchemaProvider>
  );
}
