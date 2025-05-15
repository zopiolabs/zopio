# Firebase Provider

## Overview
Firebase data provider for Zopio framework that implements the CRUD interface for Firebase Firestore.

## Installation

```bash
# From your project root
npm install @repo/data-providers firebase
```

## Usage

```typescript
import { createDataProvider } from '@repo/data-providers';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const firebaseApp = initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // other firebase config
});

const firestore = getFirestore(firebaseApp);

// Create a Firebase provider instance
const dataProvider = createDataProvider({
  type: 'firebase',
  config: {
    firestore,
    collectionMapping: {
      posts: 'posts', // Maps 'posts' resource to 'posts' Firestore collection
      users: 'users' // Maps 'users' resource to 'users' Firestore collection
    }
  }
});

// Use the provider
const result = await dataProvider.getList({
  resource: 'posts',
  pagination: { page: 1, perPage: 10 },
  sort: { field: 'createdAt', order: 'desc' },
  filter: { status: 'published' }
});
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `firestore` | `Firestore` | Yes | Firestore instance from Firebase SDK |
| `collectionMapping` | `Record<string, string>` | No | Maps resource names to Firestore collection names |

## Methods

This provider implements the standard CRUD interface:

- `getList`: Retrieve a list of documents with pagination, sorting, and filtering
- `getOne`: Retrieve a single document by ID
- `create`: Create a new document
- `update`: Update an existing document
- `deleteOne`: Delete a document by ID

## Integration with Firebase

The provider translates Zopio's data queries into Firestore queries using the Firebase SDK. It supports:

- Real-time data with optional subscriptions
- Complex filtering with multiple conditions
- Pagination with limit/offset
- Sorting by multiple fields
- Nested document structures
