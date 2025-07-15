/**
 * SPDX-License-Identifier: MIT
 */

import { DashboardWidget } from '@repo/sample-plugin';
import type { FC } from 'react';

/**
 * Example usage of the sample plugin
 * This demonstrates how to use the DashboardWidget component from the sample plugin
 */
export const SamplePluginDemo: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
      {/* Default variant */}
      <div>
        <h3 className="mb-2 font-medium text-base">Default Widget</h3>
        <DashboardWidget title="System Status" />
      </div>

      {/* Compact variant */}
      <div>
        <h3 className="mb-2 font-medium text-base">Compact Widget</h3>
        <DashboardWidget title="System Status" variant="compact" />
      </div>

      {/* Expanded variant */}
      <div className="col-span-1 md:col-span-2">
        <h3 className="mb-2 font-medium text-base">Expanded Widget</h3>
        <DashboardWidget title="System Status" variant="expanded" />
      </div>

      {/* Without header */}
      <div>
        <h3 className="mb-2 font-medium text-base">No Header Widget</h3>
        <DashboardWidget showHeader={false} />
      </div>
    </div>
  );
};

export default SamplePluginDemo;
