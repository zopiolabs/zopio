// This file provides environment variables for development
// It's used as a workaround since .env.local is in .gitignore

export const PORT = 3003;
export const PUBLIC_URL = 'http://localhost:3003';

// Export the variables to process.env
process.env.PORT = PORT.toString();
process.env.PUBLIC_URL = PUBLIC_URL;
