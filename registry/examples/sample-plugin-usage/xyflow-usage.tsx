/**
 * SPDX-License-Identifier: MIT
 */

import {
  BackgroundVariant,
  ConnectionLineType,
  type Edge,
  type Node,
} from '@xyflow/react';
// Import the plugin directly from the plugins directory
import { XYFlowPlugin } from '../../plugins/xylow-plugin/index.js';

// Sample custom nodes for the demo
const customNodes: Node[] = [
  {
    id: 'node-1',
    type: 'input',
    data: { label: 'Start Process' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'node-2',
    data: { label: 'Process Data' },
    position: { x: 100, y: 100 },
  },
  {
    id: 'node-3',
    data: { label: 'Decision Point' },
    position: { x: 250, y: 200 },
  },
  {
    id: 'node-4',
    data: { label: 'Output Result' },
    position: { x: 400, y: 300 },
    type: 'output',
  },
];

// Sample custom edges for the demo
const customEdges: Edge[] = [
  { id: 'edge-1-2', source: 'node-1', target: 'node-2', label: 'Process' },
  { id: 'edge-2-3', source: 'node-2', target: 'node-3', animated: true },
  {
    id: 'edge-3-4',
    source: 'node-3',
    target: 'node-4',
    type: 'step',
    label: 'Complete',
  },
];

const PluginDemo = () => (
  <div className="p-4">
    <h2 className="mb-4 font-bold text-xl">XYFlow Plugin Example</h2>

    {/* Basic usage */}
    <div className="mb-8">
      <h3 className="mb-2 font-medium text-lg">Basic Usage</h3>
      <div className="rounded-md border border-gray-200">
        <XYFlowPlugin height="300px" />
      </div>
    </div>

    {/* Advanced usage with custom nodes and edges */}
    <div className="mb-8">
      <h3 className="mb-2 font-medium text-lg">Custom Nodes and Edges</h3>
      <div className="rounded-md border border-gray-200">
        <XYFlowPlugin
          nodes={customNodes}
          edges={customEdges}
          height="400px"
          backgroundColor="#f0f9ff"
          backgroundVariant={BackgroundVariant.Lines}
          connectionLineType={ConnectionLineType.Step}
          fitView={true}
        />
      </div>
    </div>

    {/* Minimal configuration */}
    <div>
      <h3 className="mb-2 font-medium text-lg">Minimal Configuration</h3>
      <div className="rounded-md border border-gray-200">
        <XYFlowPlugin showMiniMap={false} showControls={false} height="250px" />
      </div>
    </div>
  </div>
);

export default PluginDemo;
