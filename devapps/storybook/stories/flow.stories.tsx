/**
 * SPDX-License-Identifier: MIT
 */

import { cn } from '@repo/design-system/lib/utils';
import { Button } from '@repo/design-system/ui/button';
import {
  Flow,
  FlowBackground,
  FlowControls,
  FlowMiniMap,
  FlowPanel,
  type IFlowEdge,
  type IFlowNode,
} from '@repo/design-system/ui/flow';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Minus, Pencil, Plus } from 'lucide-react';
import { type CSSProperties, type MouseEvent, useState } from 'react';

const meta: Meta<typeof Flow> = {
  title: 'UI/Flow',
  component: Flow,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Flow>;

// Initial nodes and edges for the examples
const defaultNodes: IFlowNode[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Node 1' },
    draggable: true,
  },
  {
    id: '2',
    position: { x: 300, y: 100 },
    data: { label: 'Node 2' },
    draggable: true,
  },
  {
    id: '3',
    position: { x: 200, y: 250 },
    data: { label: 'Node 3' },
    draggable: true,
  },
];

const initialEdges: IFlowEdge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'default' },
  { id: 'e1-3', source: '1', target: '3', type: 'default' },
  { id: 'e2-3', source: '2', target: '3', type: 'default', animated: true },
];

// Custom node component
interface CustomNodeProps {
  id: string;
  data?: {
    label?: string;
    description?: string;
    notes?: string[];
    onDeleteNote?: (nodeId: string, noteIndex: number) => void;
  };
  selected?: boolean;
  style?: CSSProperties;
  onClick?: (event: MouseEvent) => void;
}

const CustomNode = ({
  id,
  data,
  selected,
  style,
  onClick,
}: CustomNodeProps) => {
  const onDeleteNote = data?.onDeleteNote;
  return (
    <button
      type="button"
      className={cn(
        'absolute',
        'bg-gradient-to-r',
        'from-blue-500',
        'p-4',
        'rounded-lg',
        'shadow-md',
        'text-white',
        'to-purple-500',
        selected && 'ring-2 ring-yellow-400'
      )}
      style={style}
      onClick={onClick}
      data-node-id={id}
    >
      <h3 className="font-medium">{data?.label || 'Node'}</h3>
      {data?.description && <p className="mt-1 text-xs">{data.description}</p>}
      {data?.notes && Array.isArray(data.notes) && data.notes.length > 0 && (
        <div className={cn('border-t', 'border-white/30', 'mt-2', 'pt-1')}>
          <p className="font-medium text-xs">Notes:</p>
          <ul className={cn('list-disc', 'mt-1', 'pl-4', 'text-xs')}>
            {data.notes.map((note: string, index: number) => (
              <li key={index} className="flex items-center justify-between">
                <span>{note}</span>
                {onDeleteNote && (
                  <button
                    type="button"
                    className={cn(
                      'ml-1',
                      'text-white/70',
                      'hover:text-white',
                      'rounded-full',
                      'h-4',
                      'w-4',
                      'flex',
                      'items-center',
                      'justify-center',
                      'text-xs'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(id, index);
                    }}
                    aria-label="Delete note"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </button>
  );
};

/**
 * Default flow with basic nodes and edges
 */
/**
 * Flow with draggable nodes
 *
 * This example demonstrates how nodes can be dragged around the canvas.
 * The nodes have the `draggable` property set to true, which allows users
 * to move them by clicking and dragging.
 */
export const DraggableNodes: Story = {
  render: () => {
    const [flowNodes, setFlowNodes] = useState<IFlowNode[]>([
      {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Drag me!' },
        draggable: true,
      },
      {
        id: '2',
        position: { x: 300, y: 100 },
        data: { label: 'Drag me too!' },
        draggable: true,
      },
      {
        id: '3',
        position: { x: 200, y: 250 },
        data: { label: 'Also draggable' },
        draggable: true,
      },
      {
        id: '4',
        position: { x: 400, y: 250 },
        data: { label: 'Not draggable' },
        draggable: false,
        width: 150,
        height: 60,
      },
    ]);

    const flowEdges: IFlowEdge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ];

    return (
      <div className="h-[500px] rounded-md border border-gray-200">
        <Flow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={setFlowNodes}
          fitView
        >
          <FlowControls position="bottom-right" />
          <FlowPanel
            position="top-left"
            className="rounded-md border border-gray-200 bg-white p-2 shadow-sm"
          >
            <div className="font-medium text-sm">Draggable Nodes Demo</div>
            <div className="mt-1 text-gray-500 text-xs">
              Try dragging the nodes (except the bottom right one)
            </div>
          </FlowPanel>
        </Flow>
      </div>
    );
  },
};

export const Default: Story = {
  render: () => {
    const [nodes, setNodes] = useState(defaultNodes);

    return (
      <div className="h-[600px] rounded-md border border-gray-200">
        <Flow
          nodes={nodes}
          edges={initialEdges}
          onNodesChange={setNodes}
          fitView
        />
      </div>
    );
  },
};

/**
 * Flow with custom node styling
 */
export const CustomNodes: Story = {
  render: () => {
    const [customNodes, setCustomNodes] = useState<IFlowNode[]>([
      {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Start', description: 'Beginning of the flow' },
        width: 200,
        height: 80,
        type: 'custom',
        draggable: true,
      },
      {
        id: '2',
        position: { x: 400, y: 100 },
        data: { label: 'Process', description: 'Processing step' },
        width: 200,
        height: 80,
        type: 'custom',
        draggable: true,
      },
      {
        id: '3',
        position: { x: 250, y: 300 },
        data: { label: 'End', description: 'End of the flow' },
        width: 200,
        height: 80,
        type: 'custom',
        draggable: true,
      },
    ]);

    const customEdges: IFlowEdge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ];

    return (
      <div className="h-[600px] rounded-md border border-gray-200">
        <Flow
          nodes={customNodes}
          edges={customEdges}
          nodeTypes={{ custom: CustomNode }}
          onNodesChange={setCustomNodes}
          fitView
        />
      </div>
    );
  },
};

/**
 * Interactive flow with controls for adding nodes
 */
export const Interactive: Story = {
  render: () => {
    // Using function component for state management
    const InteractiveFlow = () => {
      const [nodes, setNodes] = useState<IFlowNode[]>([
        {
          id: '1',
          position: { x: 100, y: 100 },
          data: { label: 'Node 1', notes: [] },
          type: 'custom',
          draggable: true,
        },
        {
          id: '2',
          position: { x: 300, y: 100 },
          data: { label: 'Node 2', notes: [] },
          type: 'custom',
          draggable: true,
        },
        {
          id: '3',
          position: { x: 200, y: 250 },
          data: { label: 'Also draggable', notes: [] },
          type: 'custom',
          draggable: true,
        },
      ]);

      const [edges, setEdges] = useState<IFlowEdge[]>([
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
      ]);

      const [selectedNode, setSelectedNode] = useState<string | null>(null);
      const [noteText, setNoteText] = useState<string>('');
      const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

      const handleAddNode = () => {
        const newNode: IFlowNode = {
          id: `${nodes.length + 1}`,
          position: { x: 200, y: 200 },
          data: { label: `Node ${nodes.length + 1}`, notes: [] },
          type: 'custom',
          draggable: true,
        };
        setNodes([...nodes, newNode]);
      };

      const handleConnect = (params: { source: string; target: string }) => {
        const newEdge: IFlowEdge = {
          id: `e${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
          type: 'default',
        };
        setEdges([...edges, newEdge]);
      };

      const handleNodeClick = (_: MouseEvent, node: IFlowNode) => {
        setSelectedNode(node.id);
      };

      const handleRemoveNode = () => {
        if (!selectedNode) {
          return;
        }

        setNodes(nodes.filter((node) => node.id !== selectedNode));
        setEdges(
          edges.filter(
            (edge) =>
              edge.source !== selectedNode && edge.target !== selectedNode
          )
        );
        setSelectedNode(null);
        setShowNoteInput(false);
      };

      const handleAddNote = () => {
        if (selectedNode && noteText.trim()) {
          const updatedNodes = nodes.map((node) => {
            if (node.id === selectedNode) {
              const currentNotes = node.data?.notes || [];
              return {
                ...node,
                data: {
                  ...node.data,
                  notes: [...currentNotes, noteText.trim()],
                },
              };
            }
            return node;
          });
          setNodes(updatedNodes);
          setNoteText('');
        }
      };

      const handleDeleteNote = (nodeId: string, noteIndex: number) => {
        const updatedNodes = nodes.map((node) => {
          if (node.id === nodeId && node.data?.notes) {
            const updatedNotes = [...node.data.notes];
            updatedNotes.splice(noteIndex, 1);
            return {
              ...node,
              data: {
                ...node.data,
                notes: updatedNotes,
              },
            };
          }
          return node;
        });
        setNodes(updatedNodes);
      };

      const toggleNoteInput = () => {
        setShowNoteInput(!showNoteInput);
        if (!showNoteInput) {
          setNoteText('');
        }
      };

      return (
        <div className="relative h-[600px] rounded-md border border-gray-200">
          <Flow
            nodes={nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                onDeleteNote: handleDeleteNote,
              },
            }))}
            edges={edges}
            onNodeClick={handleNodeClick}
            onConnect={handleConnect}
            onNodesChange={setNodes}
            nodeTypes={{ custom: CustomNode }}
            fitView
          >
            <FlowPanel
              position="top-right"
              className="rounded-md border border-gray-200 bg-white p-2 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={handleAddNode}>
                  <Plus className="mr-1 h-4 w-4" /> Add Node
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveNode}
                  disabled={!selectedNode}
                >
                  <Minus className="mr-1 h-4 w-4" /> Remove Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleNoteInput}
                  disabled={!selectedNode}
                >
                  <Pencil className="mr-1 h-4 w-4" />{' '}
                  {showNoteInput ? 'Cancel Note' : 'Add Note'}
                </Button>
                {showNoteInput && selectedNode && (
                  <div className={cn('flex', 'flex-col', 'gap-2', 'mt-2')}>
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter note..."
                      className={cn(
                        'border',
                        'border-gray-300',
                        'px-2',
                        'py-1',
                        'rounded-md',
                        'text-sm'
                      )}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                    >
                      Save Note
                    </Button>
                  </div>
                )}
              </div>
            </FlowPanel>
            <FlowMiniMap position="bottom-left" />
            <FlowPanel
              position="bottom-right"
              className={cn(
                'bg-white',
                'border',
                'border-gray-200',
                'p-2',
                'rounded-md',
                'shadow-sm'
              )}
            >
              <div className="font-medium text-sm">Notes Feature Guide</div>
              <div className="mt-1 text-gray-500 text-xs">
                How to use notes:
              </div>
              <ol
                className={cn(
                  'list-decimal',
                  'ml-4',
                  'mt-1',
                  'space-y-1',
                  'text-xs',
                  'text-gray-500'
                )}
              >
                <li>Select a node by clicking on it</li>
                <li>Click "Add Note" button</li>
                <li>Enter your note text</li>
                <li>Click "Save Note" to add it to the node</li>
              </ol>
            </FlowPanel>
          </Flow>
        </div>
      );
    };

    return <InteractiveFlow />;
  },
};

/**
 * Flow with different background patterns
 */
export const BackgroundVariants: Story = {
  render: () => {
    // Using function component for state management
    const BackgroundFlow = () => {
      const [backgroundType, setBackgroundType] = useState<
        'dots' | 'lines' | 'cross'
      >('dots');
      const [nodes, setNodes] = useState(defaultNodes);

      return (
        <div className="relative h-[600px] rounded-md border border-gray-200">
          <Flow
            nodes={nodes}
            edges={initialEdges}
            onNodesChange={setNodes}
            fitView
          >
            <FlowBackground variant={backgroundType} gap={20} />
            <FlowPanel
              position="top-right"
              className="rounded-md border border-gray-200 bg-white p-2 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant={backgroundType === 'dots' ? 'default' : 'outline'}
                  onClick={() => setBackgroundType('dots')}
                >
                  Dots
                </Button>
                <Button
                  size="sm"
                  variant={backgroundType === 'lines' ? 'default' : 'outline'}
                  onClick={() => setBackgroundType('lines')}
                >
                  Lines
                </Button>
                <Button
                  size="sm"
                  variant={backgroundType === 'cross' ? 'default' : 'outline'}
                  onClick={() => setBackgroundType('cross')}
                >
                  Cross
                </Button>
              </div>
            </FlowPanel>
          </Flow>
        </div>
      );
    };

    return <BackgroundFlow />;
  },
};

/**
 * Dark theme flow
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => {
    const [nodes, setNodes] = useState(defaultNodes);

    return (
      <div className="h-[600px] rounded-md border border-gray-700 bg-gray-950">
        <Flow
          nodes={nodes}
          edges={initialEdges}
          onNodesChange={setNodes}
          className="bg-gray-950"
          fitView
        >
          <FlowBackground color="#333" />
          <FlowMiniMap
            position="bottom-left"
            nodeColor="#555"
            nodeStrokeColor="#888"
            maskColor="rgba(20, 20, 20, 0.6)"
          />
        </Flow>
      </div>
    );
  },
};

/**
 * Complex workflow example
 */
export const WorkflowExample: Story = {
  render: () => {
    const [workflowNodes, setWorkflowNodes] = useState<IFlowNode[]>([
      {
        id: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Start' },
        width: 150,
        height: 50,
        draggable: true,
      },
      {
        id: 'check',
        position: { x: 250, y: 150 },
        data: { label: 'Check Condition' },
        width: 150,
        height: 50,
      },
      {
        id: 'process1',
        position: { x: 100, y: 250 },
        data: { label: 'Process A' },
        width: 150,
        height: 50,
      },
      {
        id: 'process2',
        position: { x: 400, y: 250 },
        data: { label: 'Process B' },
        width: 150,
        height: 50,
      },
      {
        id: 'join',
        position: { x: 250, y: 350 },
        data: { label: 'Join' },
        width: 150,
        height: 50,
      },
      {
        id: 'end',
        position: { x: 250, y: 450 },
        data: { label: 'End' },
        width: 150,
        height: 50,
      },
    ]);

    const workflowEdges: IFlowEdge[] = [
      { id: 'e-start-check', source: 'start', target: 'check', animated: true },
      { id: 'e-check-process1', source: 'check', target: 'process1' },
      { id: 'e-check-process2', source: 'check', target: 'process2' },
      { id: 'e-process1-join', source: 'process1', target: 'join' },
      { id: 'e-process2-join', source: 'process2', target: 'join' },
      { id: 'e-join-end', source: 'join', target: 'end' },
    ];

    return (
      <div className="h-[700px] rounded-md border border-gray-200">
        <Flow
          nodes={workflowNodes}
          edges={workflowEdges}
          onNodesChange={setWorkflowNodes}
          fitView
        >
          <FlowControls position="bottom-right" />
          <FlowMiniMap position="top-left" />
        </Flow>
      </div>
    );
  },
};
