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
import { AutoForm } from '../AutoForm';
import { useCrudForm } from '../useCrudForm';

const fields = [
  { name: 'name', type: 'string', label: 'Name', required: true },
  { name: 'age', type: 'number', label: 'Age' },
  { name: 'email', type: 'string', label: 'Email', required: true },
  { name: 'isActive', type: 'boolean', label: 'Active?' },
];

export function AutoFormDemo() {
  const form = useCrudForm({ schema: fields, initial: {} });
  return (
    <div>
      <AutoForm
        fields={fields}
        value={form.value}
        onChange={form.setValue}
        errors={form.errors}
      />
      <button className="mt-4" onClick={form.validate}>
        Validate
      </button>
      <pre className="mt-4">{JSON.stringify(form.value, null, 2)}</pre>
    </div>
  );
}
