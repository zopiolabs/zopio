/**
 * SPDX-License-Identifier: MIT
 */

import type {
  Connection,
  Edge,
  EdgeTypes,
  FitViewOptions,
  Node,
  NodeTypes,
} from '@xyflow/react';
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { type FC, useCallback, useMemo } from 'react';
import '@xyflow/react/dist/style.css';

export interface XYFlowPluginProps {
  /**
   * Initial nodes to render in the flow
   */
  nodes?: Node[];
  /**
   * Initial edges to render in the flow
   */
  edges?: Edge[];
  /**
   * Custom node types for specialized rendering
   */
  nodeTypes?: NodeTypes;
  /**
   * Custom edge types for specialized rendering
   */
  edgeTypes?: EdgeTypes;
  /**
   * Height of the flow container
   */
  height?: string;
  /**
   * Whether to show the minimap
   */
  showMiniMap?: boolean;
  /**
   * Whether to show the background
   */
  showBackground?: boolean;
  /**
   * Background variant (dots, lines, cross)
   */
  backgroundVariant?: BackgroundVariant;
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Whether to show controls
   */
  showControls?: boolean;
  /**
   * Whether to enable node dragging
   */
  nodesDraggable?: boolean;
  /**
   * Whether to fit the view on initial render
   */
  fitView?: boolean;
  /**
   * Options for fit view
   */
  fitViewOptions?: FitViewOptions;
  /**
   * Connection line type
   */
  connectionLineType?: ConnectionLineType;
  /**
   * CSS class name for the container
   */
  className?: string;
}

const defaultNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Default Node' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Output Node' },
    position: { x: 400, y: 100 },
    type: 'output',
  },
];

const defaultEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

const XYFlowPlugin: FC<XYFlowPluginProps> = ({
  nodes: initialNodes = defaultNodes,
  edges: initialEdges = defaultEdges,
  nodeTypes = {},
  edgeTypes = {},
  height = '500px',
  showMiniMap = true,
  showBackground = true,
  backgroundVariant = BackgroundVariant.Dots,
  backgroundColor = '#f8f8f8',
  showControls = true,
  nodesDraggable = true,
  fitView = true,
  fitViewOptions = {},
  connectionLineType = ConnectionLineType.Bezier,
  className = '',
}) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const flowStyle = useMemo(
    () => ({
      backgroundColor,
      height,
      width: '100%',
    }),
    [backgroundColor, height]
  );

  return (
    <div className={className}>
      <ReactFlowProvider>
        <div style={flowStyle}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView={fitView}
            fitViewOptions={fitViewOptions}
            connectionLineType={connectionLineType}
            nodesDraggable={nodesDraggable}
          >
            {showBackground && <Background variant={backgroundVariant} />}
            {showControls && <Controls />}
            {showMiniMap && <MiniMap />}
            <Panel position="top-right">
              <div className="rounded bg-white/80 p-2 shadow-sm">
                XYFlow Plugin
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

// Export the component as a named export and default export for compatibility
export { XYFlowPlugin };
export default XYFlowPlugin;
