/**
 * SPDX-License-Identifier: MIT
 */

export type SessionStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface SetupSession {
  id: string;
  status: SessionStatus;
  currentStepId: string | null;
  answers: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProfile {
  name: string;
  description: string;
  targetUsers: 'internal' | 'public_saas' | 'b2b_portal';
  apps: string[]; // 'web', 'api', 'app'
  architecture: {
    type: 'single_tenant' | 'multi_tenant';
    domainEntity: string; // e.g. 'organization', 'workspace'
  };
  features: {
    auth: boolean;
    database: boolean;
    observability: boolean;
    analytics: boolean;
    storage: boolean;
    rateLimit: boolean;
  };
}

export interface SetupPlan {
  id: string; // same as session id
  targetFiles: string[];
  prismaSchema: string;
  envTemplates: Record<string, string>; // path -> content
  serviceWiring: {
    service: string;
    status: 'stubbed' | 'configured';
    notes: string;
  }[];
}

export interface AppliedChangeset {
  id: string;
  sessionId: string;
  planId: string;
  touchedFiles: {
    path: string;
    type: 'created' | 'updated' | 'deleted';
  }[];
  notes: string[];
  timestamp: string;
}

export interface Question {
  id: string;
  type: 'text' | 'select' | 'multi_select' | 'confirm';
  text: string;
  description?: string;
  options?: { label: string; value: unknown }[];
  required?: boolean;
}
