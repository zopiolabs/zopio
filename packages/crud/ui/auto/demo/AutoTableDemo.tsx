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
import { AutoTable } from '../AutoTable';

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
  { key: 'email', title: 'Email' },
  { key: 'isActive', title: 'Active' },
];

const data = [
  { name: 'John', age: 28, email: 'john@example.com', isActive: true },
  { name: 'Jane', age: 34, email: 'jane@example.com', isActive: false },
];

export function AutoTableDemo() {
  return (
    <div>
      <AutoTable
        columns={columns}
        data={data}
        rowActions={(row) => <button>Edit</button>}
      />
    </div>
  );
}
