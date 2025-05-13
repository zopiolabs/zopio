import 'server-only';

export * from '@clerk/nextjs/server';

// Helper function to get user roles from Clerk user
export function getUserRoles(user: unknown): string[] {
  if (!user) {
    return [];
  }
  
  // Cast to any to access publicMetadata
  const clerkUser = user as { publicMetadata?: { roles?: string[] } };
  return clerkUser.publicMetadata?.roles || [];
}
