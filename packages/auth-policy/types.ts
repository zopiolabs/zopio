export interface PolicyContext {
  user: { id: string; roles: string[]; tenantId?: string };
  action: string;
  resource?: any;
  context?: Record<string, any>;
}

export type PolicyRule = (input: PolicyContext) => boolean | Promise<boolean>;

export interface PolicyRegistry {
  [action: string]: PolicyRule;
}