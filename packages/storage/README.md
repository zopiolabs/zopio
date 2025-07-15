# @repo/storage

## Overview

The `@repo/storage` package provides a streamlined interface for file storage in Zopio applications using Vercel Blob. This package simplifies the process of uploading, retrieving, and managing files in the cloud with proper environment variable validation and type safety.

## Module Categories

### Storage Client

- **Blob Client**: Client-side utilities for file uploads and management
- **Server API**: Server-side functions for secure file operations

## Usage Guidelines

### Server-Side Usage

```typescript
import { put, list, del } from '@repo/storage';

// Upload a file to Vercel Blob
export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  const blob = await put('uploads/my-file.pdf', file, {
    access: 'public',
  });
  
  return blob.url;
}

// List files in a directory
export async function listFiles() {
  const blobs = await list({ prefix: 'uploads/' });
  return blobs;
}

// Delete a file
export async function deleteFile(url: string) {
  await del(url);
  return { success: true };
}
```

### Client-Side Usage

```typescript
import { upload } from '@repo/storage/client';

// Upload a file from the client
export async function uploadFileFromClient(file: File) {
  const blob = await upload('uploads/my-file.pdf', file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
  });
  
  return blob.url;
}
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/storage
```

## Environment Variables

| Variable | Description | Required | Format |
|----------|-------------|----------|--------|
| `BLOB_READ_WRITE_TOKEN` | Token for Vercel Blob operations | Yes | Vercel Blob token |

## Development Guidelines

### Project Structure

```
storage/
├── index.ts     # Main exports (server-side)
├── client.ts    # Client-side exports
├── keys.ts      # Environment variable validation
└── package.json # Package dependencies
```

### Dependencies

- `@vercel/blob`: Core Vercel Blob SDK
- `@t3-oss/env-nextjs`: Environment variable validation
- `zod`: Schema validation

### Best Practices

1. **Environment Variables**: Always validate environment variables using the provided `keys` function.
2. **Access Control**: Set appropriate access levels (`public` or `private`) for uploaded files.
3. **File Size Limits**: Be mindful of file size limits when uploading large files.
4. **Error Handling**: Implement proper error handling for upload and download operations.
5. **Cleanup**: Delete unused files to avoid unnecessary storage costs.

## Integration Examples

### File Upload API Route

```typescript
// app/api/upload/route.ts
import { put } from '@repo/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;
    
    if (!file || !filename) {
      return NextResponse.json(
        { error: 'File or filename missing' },
        { status: 400 }
      );
    }
    
    const blob = await put(`uploads/${filename}`, file, {
      access: 'public',
    });
    
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
```

### File Upload Component

```tsx
// components/FileUpload.tsx
import { useState } from 'react';
import { upload } from '@repo/storage/client';

export function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setUploading(true);
    
    try {
      const blob = await upload(`uploads/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      
      setFileUrl(blob.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }
  
  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {fileUrl && (
        <div>
          <p>File uploaded successfully!</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View file
          </a>
        </div>
      )}
    </div>
  );
}
```

### File Management API

```typescript
// app/api/files/route.ts
import { list, del } from '@repo/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const blobs = await list({ prefix: 'uploads/' });
    return NextResponse.json(blobs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
```

## Documentation References

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure all environment variables are properly validated.
3. Add appropriate error handling for storage operations.
4. Document any new storage features or changes to existing ones.

## License

MIT
