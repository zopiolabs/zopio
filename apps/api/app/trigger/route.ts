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
import { sendEvent } from '@repo/trigger';
import type { NextRequest } from 'next/server';

/**
 * POST handler for trigger events
 * This endpoint receives webhook events and sends them to Trigger.dev
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    // Validate the request body
    if (!body || !body.event) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Extract event name and payload
    const { event, payload } = body;

    // Send the event to Trigger.dev
    const result = await sendEvent(event, payload);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Event ${event} sent to Trigger.dev`,
        result,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // Error handling without console.error to comply with linting rules

    // Return error response
    return new Response(
      JSON.stringify({
        error: 'Failed to process event',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
