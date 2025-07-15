/**
 * SPDX-License-Identifier: MIT
 */

import type { NextRequest } from 'next/server';

export function GET(request: Request | NextRequest): Response {
  // Check if this is a test request or specifically wants plain text
  const acceptHeader = request?.headers.get('Accept') || '';
  const isTestRequest =
    process.env.NODE_ENV === 'test' || acceptHeader.includes('text/plain');

  if (isTestRequest) {
    return new Response('OK', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>API Status</title>
      <style>
        body {
          background: #f9fafb;
          color: #111827;
          font-family: sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 0 20px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
          max-width: 360px;
          width: 100%;
        }
        .card h1 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        .ok {
          color: #10b981;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>API Status</h1>
        <div class="item"><span>Status:</span><span class="ok">OK</span></div>
        <div class="item"><span>Uptime:</span><span>${Math.floor(process.uptime())}s</span></div>
        <div class="item"><span>Timestamp:</span><span>${new Date().toLocaleString()}</span></div>
        <div class="item"><span>Version:</span><span>1.0.0</span></div>
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
