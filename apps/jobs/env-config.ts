// This file provides environment variables for development
// It's used as a workaround since .env.local is in .gitignore

export const PORT = 3006;
export const PUBLIC_URL = 'http://localhost:3006';

// Export the variables to process.env
process.env.PORT = PORT.toString();
process.env.PUBLIC_URL = PUBLIC_URL;
