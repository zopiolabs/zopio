/**
 * SPDX-License-Identifier: MIT
 */

Object.defineProperty(exports, '__esModule', { value: true });
exports.createBetterStackLogger = createBetterStackLogger;
function createBetterStackLogger(options) {
  const endpoint = options.endpoint || 'https://in.logs.betterstack.com';
  return {
    write: async (entry) => {
      try {
        const response = await fetch(`${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${options.sourceToken}`,
          },
          body: JSON.stringify({
            ...entry,
            level: entry.can ? 'info' : 'warn',
            message: `Auth ${entry.can ? 'ALLOWED' : 'DENIED'}: ${entry.action} ${entry.resource}${entry.field ? `.${entry.field}` : ''}`,
            service: 'auth-service',
          }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          process.stderr.write(
            `[AUTH-LOG] Failed to send log to BetterStack: ${errorText}\n`
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        process.stderr.write(
          `[AUTH-LOG] Error sending log to BetterStack: ${errorMessage}\n`
        );
      }
    },
  };
}
