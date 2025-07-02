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
import { useEffect, useState } from 'react';
import { useSchemaState } from '../hooks/useSchemaState.js';

const predefinedFields = [
  { label: 'Text', name: 'text', type: 'string' },
  { label: 'Email', name: 'email', type: 'string' },
  { label: 'Number', name: 'quantity', type: 'number' },
];

export function Toolbox() {
  const { addField, persistView, getViewList, loadView } = useSchemaState();
  const [views, setViews] = useState<string[]>([]);

  useEffect(() => {
    getViewList().then(setViews);
  }, [getViewList]);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Toolbox</h3>
      {predefinedFields.map((field) => (
        <Button
          key={`${field.name}-${field.type}`}
          variant="outline"
          className="w-full justify-start"
          onClick={() =>
            addField({
              name: `${field.name}-${Date.now()}`,
              label: field.label,
              type: field.type,
              required: false,
            })
          }
        >
          ➕ {field.label} Field
        </Button>
      ))}
      <Button variant="default" className="mt-4 w-full" onClick={persistView}>
        💾 Save View
      </Button>
      <div className="pt-4">
        <h4 className="mb-1 font-semibold text-muted-foreground text-xs">
          Saved Views
        </h4>
        {views.map((id) => (
          <Button
            key={id}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => loadView(id)}
          >
            📂 {id}
          </Button>
        ))}
      </div>
    </div>
  );
}
