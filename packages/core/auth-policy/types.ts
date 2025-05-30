export interface ClerkUser {
  id: string;
  publicMetadata?: {
    roles?: string[];
    permissions?: string[];
    organizationId?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface PolicyContext {
  user: {
    id: string;
    roles: string[];
    organizationId?: string;
    metadata?: {
      permissions?: string[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  action: string;
  resource?: unknown;
  context?: Record<string, unknown>;
}

export type PolicyRule = (input: PolicyContext) => boolean | Promise<boolean>;

export interface PolicyRegistry {
  [action: string]: PolicyRule;
}

export type MetadataPermissionRule = {
  type: 'metadata-permission';
  permission: string;
};
