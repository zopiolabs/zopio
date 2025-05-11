import { withAuthorization } from '@/middleware/withAuthorization';
import { NextResponse } from 'next/server';

function handler(_req: unknown) {
  // Your protected logic here
  return NextResponse.json({ message: 'User deleted successfully' });
}

export const DELETE = withAuthorization(handler, 'delete', 'User');