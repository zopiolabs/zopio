// Simple implementation that doesn't rely on the observability package
// This allows the API to start even if Sentry is not properly configured

// Instead of using console.log, we'll just return a value
// that indicates Sentry was not initialized

export const register = () => {
  // In a production environment, you would want to properly
  // initialize Sentry with the appropriate environment variables
  return false; // Return false to indicate Sentry was not initialized
};
