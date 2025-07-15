/**
 * SPDX-License-Identifier: MIT
 */

import type { FC } from 'react';

// Sample Dashboard component for the sample app
export const Dashboard: FC = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 font-bold text-2xl">Sample App Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold text-lg">Overview</h2>
          <p>This is a sample app for the Zopio registry.</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold text-lg">Statistics</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Users</p>
              <p className="font-bold text-xl">1,234</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="font-bold text-xl">$5,678</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Conversion</p>
              <p className="font-bold text-xl">12.3%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample Settings component for the sample app
export const Settings: FC = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 font-bold text-2xl">Sample App Settings</h1>
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold text-lg">Configuration</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="apiKey"
              className="block font-medium text-gray-700 text-sm"
            >
              API Key
            </label>
            <input
              id="apiKey"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your API key"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="webhookUrl"
              className="block font-medium text-gray-700 text-sm"
            >
              Webhook URL
            </label>
            <input
              id="webhookUrl"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://example.com/webhook"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the module
export default {
  name: '@repo/sample-app',
  version: '1.0.0',
  components: {
    Dashboard,
    Settings,
  },
};
