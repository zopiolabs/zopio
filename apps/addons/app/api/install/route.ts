import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { addonId } = await req.json();

  // Simulate install (replace with actual install logic)
  // Log installation in a production-safe way
  await new Promise((res) => setTimeout(res, 1000));

  return NextResponse.json({ success: true, addonId });
}
