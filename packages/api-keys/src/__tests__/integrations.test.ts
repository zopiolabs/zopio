import { describe, it, expect, beforeEach } from 'vitest';
import { fromApiKey } from '../integrations/fromApiKey';
import { createKey } from '../createKey';
import { revokeKey } from '../revokeKey';

// Define interfaces matching our package requirements
interface NextRequest {
  headers: {
    get(name: string): string | null;
  };
}

// Mock NextRequest
class MockHeaders {
  private headers: Record<string, string> = {};

  set(name: string, value: string): void {
    this.headers[name.toLowerCase()] = value;
  }

  get(name: string): string | null {
    return this.headers[name.toLowerCase()] || null;
  }
}

class MockRequest implements NextRequest {
  headers: MockHeaders = new MockHeaders();
}

describe('API Key Integrations', () => {
  let apiKey: string;
  let mockRequest: MockRequest;

  beforeEach(() => {
    // Create a fresh API key for each test
    apiKey = createKey('integration_user', ['read']);
    
    // Create a mock request
    mockRequest = new MockRequest();
  });

  describe('fromApiKey', () => {
    it('should return null when no API key is provided', () => {
      const result = fromApiKey(mockRequest);
      expect(result).toBeNull();
    });

    it('should return user identity when a valid API key is provided', () => {
      // Set the API key in the request headers
      mockRequest.headers.set('x-api-key', apiKey);
      
      // Get the user identity
      const user = fromApiKey(mockRequest);
      
      // Verify the user identity
      expect(user).not.toBeNull();
      if (user) {
        expect(user.userId).toBe('integration_user');
        expect(user.scopes).toEqual(['read']);
        expect(user.keyId).toBeDefined();
      }
    });

    it('should return null for an invalid API key', () => {
      // Set an invalid API key in the request headers
      mockRequest.headers.set('x-api-key', 'invalid_key');
      
      // Get the user identity
      const user = fromApiKey(mockRequest);
      
      // Verify the user identity is null
      expect(user).toBeNull();
    });

    it('should return null for a revoked API key', () => {
      // Set the API key in the request headers
      mockRequest.headers.set('x-api-key', apiKey);
      
      // Revoke the key
      revokeKey(apiKey);
      
      // Get the user identity
      const user = fromApiKey(mockRequest);
      
      // Verify the user identity is null after revocation
      expect(user).toBeNull();
    });
  });
});
