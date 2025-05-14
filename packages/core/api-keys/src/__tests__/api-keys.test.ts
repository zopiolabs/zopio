import { describe, it, expect, beforeEach } from 'vitest';
import { createKey, validateKey, revokeKey } from '..';
import { findKeyInDB } from '../utils';

// Define regex patterns at the top level to avoid performance issues
const API_KEY_FORMAT_REGEX = /^zpk_[a-f0-9]{48}$/;
const API_KEY_PREFIX_REGEX = /^zpk_/;

describe('API Keys', () => {
  let apiKey: string;
  const userId = 'test_user_123';
  const scopes = ['read', 'write'];

  beforeEach(() => {
    // Create a fresh API key for each test
    apiKey = createKey(userId, scopes);
  });

  it('should create an API key with the correct format', () => {
    expect(apiKey).toMatch(API_KEY_FORMAT_REGEX);
  });

  it('should validate a valid API key', () => {
    const isValid = validateKey(apiKey);
    expect(isValid).toBe(true);
  });

  it('should not validate an invalid API key', () => {
    const invalidKey = 'zpk_invalid_key';
    const isValid = validateKey(invalidKey);
    expect(isValid).toBe(false);
  });

  it('should revoke an API key', () => {
    // First verify the key is valid
    expect(validateKey(apiKey)).toBe(true);
    
    // Revoke the key
    revokeKey(apiKey);
    
    // Now it should be invalid
    expect(validateKey(apiKey)).toBe(false);
  });

  it('should store the correct user ID and scopes', () => {
    // Get the hashed key from the API key
    const hashedKey = apiKey.replace(API_KEY_PREFIX_REGEX, '');
    
    // Find the key record in the database
    const record = findKeyInDB(hashedKey);
    
    // Verify the record exists and has the correct properties
    expect(record).not.toBeNull();
    if (record) {
      expect(record.userId).toBe(userId);
      expect(record.scopes).toEqual(scopes);
      expect(record.revoked).toBe(false);
    }
  });
});
