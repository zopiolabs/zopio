/**
 * SPDX-License-Identifier: MIT
 */

// Using fetch instead of axios to avoid dependency issues
// Simple logger implementation to avoid dependency issues
const Logger = {
  info: (_message: string, ..._args: unknown[]) => {
    // Implementation intentionally left empty
  },
  error: (_message: string, ..._args: unknown[]) => {
    // Implementation intentionally left empty
  },
  warn: (_message: string, ..._args: unknown[]) => {
    // Implementation intentionally left empty
  },
  debug: (_message: string, ..._args: unknown[]) => {
    // Implementation intentionally left empty
  },
};

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

interface WebhookHandlers {
  userCreated?: (data: User) => void;
  userUpdated?: (data: User) => void;
}

interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Sample Integration Provider for Zopio
 * Demonstrates how to implement a third-party integration
 */
export class SampleProvider {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken = '';

  constructor(config: {
    baseUrl?: string;
    clientId: string;
    clientSecret: string;
  }) {
    this.baseUrl = config.baseUrl || 'https://api.sampleprovider.com/v1';
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  /**
   * Authenticate with the provider using OAuth
   */
  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = (await response.json()) as AuthResponse;
      this.accessToken = data.access_token;
      Logger.info('Authentication successful');
      return this.accessToken;
    } catch (error) {
      Logger.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with the provider');
    }
  }

  /**
   * Get all users from the provider
   */
  async getUsers(): Promise<User[]> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = (await response.json()) as { users: User[] };
      Logger.info(`Retrieved ${data.users.length} users`);
      return data.users;
    } catch (error) {
      Logger.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users from the provider');
    }
  }

  /**
   * Create a new user in the provider
   */
  async createUser(userData: {
    name: string;
    email: string;
    role?: string;
  }): Promise<User> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = (await response.json()) as { user: User };
      Logger.info('User created successfully:', data.user.id);
      return data.user;
    } catch (error) {
      Logger.error('Failed to create user:', error);
      throw new Error('Failed to create user with the provider');
    }
  }

  /**
   * Set up webhook handlers for the provider
   */
  setupWebhooks(handlers: WebhookHandlers): void {
    // This is a mock implementation since we can't actually set up real webhooks in this example
    // In a real integration, you would register webhook endpoints with the provider

    // Simulate webhook events for demonstration purposes
    setTimeout(() => {
      if (handlers.userCreated) {
        const mockUserData: User = {
          id: 'user_123',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date().toISOString(),
        };

        Logger.info('Simulating userCreated webhook event');
        handlers.userCreated(mockUserData);
      }
    }, 5000);
  }
}

// Export the provider
export default {
  name: '@repo/sample-integration',
  version: '1.0.0',
  provider: SampleProvider,
};
