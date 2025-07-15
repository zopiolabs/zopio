/**
 * SPDX-License-Identifier: MIT
 */

import { clerkAuthMiddleware } from '@repo/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  createApiKeyController,
  deleteApiKeyController,
  listApiKeysController,
} from './controller';

// Type guard to check if the object is a Response
function isResponse(obj: unknown): obj is Response {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'status' in obj &&
    typeof (obj as Response).status === 'number'
  );
}

export async function POST(req: NextRequest) {
  const validatedReq = await clerkAuthMiddleware(req as unknown as Request);

  // Check if the response is an error response
  if (isResponse(validatedReq)) {
    // Return the error response as NextResponse
    return new NextResponse(validatedReq.statusText, {
      status: validatedReq.status,
    });
  }

  const body = await req.json();
  const result = await createApiKeyController(body);
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  const validatedReq = await clerkAuthMiddleware(req as unknown as Request);

  // Check if the response is an error response
  if (isResponse(validatedReq)) {
    // Return the error response as NextResponse
    return new NextResponse(validatedReq.statusText, {
      status: validatedReq.status,
    });
  }

  const result = await listApiKeysController();
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const validatedReq = await clerkAuthMiddleware(req as unknown as Request);

  // Check if the response is an error response
  if (isResponse(validatedReq)) {
    // Return the error response as NextResponse
    return new NextResponse(validatedReq.statusText, {
      status: validatedReq.status,
    });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'Missing id parameter' },
      { status: 400 }
    );
  }
  const result = await deleteApiKeyController(id);
  return NextResponse.json(result);
}
