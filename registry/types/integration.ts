/**
 * SPDX-License-Identifier: MIT
 */

import type { BaseModule } from './module.ts';

/**
 * OAuth configuration for integration modules
 */
export interface OAuthConfig {
  authorizationUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
}

/**
 * API Key configuration for integration modules
 */
export interface ApiKeyConfig {
  headerName: string;
  queryParamName?: string;
}

/**
 * Credentials configuration for integration modules
 */
export interface CredentialsConfig {
  fields: {
    name: string;
    label: string;
    type: 'string' | 'password' | 'number' | 'boolean';
    required?: boolean;
    description?: string;
  }[];
}

/**
 * Webhook configuration for integration modules
 */
export interface Webhook {
  name: string;
  event: string;
  description?: string;
  payloadSchema?: Record<string, unknown>;
}

/**
 * Endpoint configuration for integration modules
 */
export interface Endpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
}

/**
 * Interface for integration module manifest
 */
export interface IntegrationManifest extends BaseModule {
  type: 'integration';
  zopio: {
    category: string;
    icon: string;
    provider: string;
    authType: 'oauth' | 'apiKey' | 'credentials' | 'none';
    configSchema?: Record<string, unknown>;
    endpoints?: {
      name: string;
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      description: string;
    }[];
    webhooks?: {
      name: string;
      event: string;
      description: string;
    }[];
  };
}
