/**
 * SPDX-License-Identifier: MIT
 */

import type { FC } from 'react';

interface DashboardWidgetProps {
  title?: string;
  showHeader?: boolean;
  variant?: 'default' | 'compact' | 'expanded';
}

/**
 * Sample Dashboard Widget component
 * Can be used in dashboard slots
 */
export const DashboardWidget: FC<DashboardWidgetProps> = ({
  title = 'Sample Widget',
  showHeader = true,
  variant = 'default',
}) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white p-4 shadow">
      {showHeader && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-lg">{title}</h3>
          <button className="text-gray-500 hover:text-gray-700" type="button">
            <span className="sr-only">Options</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center">
          <div className="rounded-md bg-green-100 p-3">
            <span className="text-green-800">All systems operational</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-md bg-yellow-100 p-3">
            <span className="text-yellow-800">Maintenance scheduled</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-md bg-blue-100 p-3">
            <span className="text-blue-800">Updates available</span>
          </div>
        </div>
      </div>

      {variant === 'expanded' && (
        <div className="mt-4 border-gray-100 border-t pt-3">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Updated 5 minutes ago</span>
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Settings Panel component
 * Used to configure the plugin
 */
export const SettingsPanel: FC = () => {
  return (
    <div className="p-4">
      <h2 className="font-medium text-lg">Plugin Settings</h2>

      <div className="space-y-4">
        <div>
          <label
            className="mb-1 block font-medium text-gray-700 text-sm"
            htmlFor="apiKey"
          >
            API Key
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            id="apiKey"
            placeholder="Enter API key"
            type="text"
          />
          <p className="mt-1 text-gray-500 text-xs">
            Required for external service integration
          </p>
        </div>

        <div>
          <label
            className="mb-1 block font-medium text-gray-700 text-sm"
            htmlFor="refreshInterval"
          >
            Refresh Interval (seconds)
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue={60}
            id="refreshInterval"
            max={3600}
            min={10}
            type="number"
          />
        </div>

        <div className="flex items-center">
          <input
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            id="enableNotifications"
            type="checkbox"
          />
          <label
            className="ml-2 block text-gray-700 text-sm"
            htmlFor="enableNotifications"
          >
            Enable notifications
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Export the module
export default {
  name: '@repo/sample-plugin',
  version: '1.0.0',
  components: {
    DashboardWidget,
    SettingsPanel,
  },
};
