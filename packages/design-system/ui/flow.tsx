/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from "../lib/utils";
import { Check, X, ZoomIn, ZoomOut, Maximize } from "lucide-react";

// Types
type FlowPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type FlowNodeState = 'default' | 'selected' | 'connected' | 'highlighted';
type FlowEdgeType = 'default' | 'step' | 'bezier' | 'straight';

// Interfaces
export interface IFlowNode {
  id: string;
  position: { x: number; y: number };
  data?: Record<string, any>;
  type?: string;
  width?: number;
  height?: number;
  selected?: boolean;
  draggable?: boolean;
  connectable?: boolean;
}

export interface IFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: FlowEdgeType;
  label?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  selected?: boolean;
}

export interface IFlowProps {
  nodes: IFlowNode[];
  edges: IFlowEdge[];
  onNodesChange?: (nodes: IFlowNode[]) => void;
  onEdgesChange?: (edges: IFlowEdge[]) => void;
  onConnect?: (params: { source: string; target: string }) => void;
  onNodeClick?: (event: React.MouseEvent, node: IFlowNode) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: IFlowEdge) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  fitView?: boolean;
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  nodeTypes?: Record<string, React.ComponentType<IFlowNodeProps>>;
  edgeTypes?: Record<string, React.ComponentType<IFlowEdgeProps>>;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface IFlowNodeProps {
  id: string;
  data?: Record<string, any>;
  selected?: boolean;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export interface IFlowEdgeProps {
  id: string;
  source: string;
  target: string;
  type?: FlowEdgeType;
  label?: string;
  animated?: boolean;
  selected?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  d?: string; // SVG path data
}

export interface IFlowPanelProps {
  position?: FlowPosition;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface IFlowControlsProps {
  position?: FlowPosition;
  className?: string;
  style?: React.CSSProperties;
  showZoom?: boolean;
  showFitView?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

export interface IFlowMiniMapProps {
  position?: FlowPosition;
  className?: string;
  style?: React.CSSProperties;
  nodeColor?: string | ((node: IFlowNode) => string);
  nodeStrokeColor?: string | ((node: IFlowNode) => string);
  nodeBorderRadius?: number;
  maskColor?: string;
}

export interface IFlowBackgroundProps {
  variant?: 'lines' | 'dots' | 'cross';
  gap?: number;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Helper functions
const calculateNodePosition = (node: IFlowNode, zoom: number, panOffset: { x: number; y: number }) => {
  return {
    x: node.position.x * zoom + panOffset.x,
    y: node.position.y * zoom + panOffset.y,
  };
};

// Components
export const FlowNode = forwardRef<HTMLDivElement, IFlowNodeProps>(
  ({ id, data, selected, className, style, onClick, children, ...props }, ref) => {
    const nodeClasses = cn(
      'absolute bg-white border rounded-md shadow-sm p-3 min-w-[150px] min-h-[40px] cursor-move',
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200',
      className
    );

    return (
      <div
        ref={ref}
        className={nodeClasses}
        style={style}
        onClick={onClick}
        data-node-id={id}
        {...props}
      >
        {children || (data && <div>{JSON.stringify(data)}</div>)}
      </div>
    );
  }
);

FlowNode.displayName = 'FlowNode';

export const FlowEdge = forwardRef<SVGPathElement, IFlowEdgeProps>(
  ({ id, source, target, type = 'default', animated, selected, className, style, onClick, ...props }, ref) => {
    const edgeClasses = cn(
      'stroke-2',
      selected ? 'stroke-primary' : 'stroke-gray-300',
      animated && 'animate-dash',
      className
    );

    // This is a simplified edge representation
    return (
      <path
        ref={ref}
        className={edgeClasses}
        style={style}
        onClick={onClick}
        data-edge-id={id}
        data-source={source}
        data-target={target}
        {...props}
      />
    );
  }
);

FlowEdge.displayName = 'FlowEdge';

export const FlowPanel = forwardRef<HTMLDivElement, IFlowPanelProps>(
  ({ position = 'top-left', className, style, children, ...props }, ref) => {
    const positionClasses = position.split('-');

    const panelClasses = cn(
      'absolute z-10 p-2',
      positionClasses.includes('top') ? 'top-4' : 'bottom-4',
      positionClasses.includes('left') ? 'left-4' : positionClasses.includes('right') ? 'right-4' : 'left-1/2 transform -translate-x-1/2',
      className
    );

    return (
      <div ref={ref} className={panelClasses} style={style} {...props}>
        {children}
      </div>
    );
  }
);

FlowPanel.displayName = 'FlowPanel';

export const FlowControls = forwardRef<HTMLDivElement, IFlowControlsProps>(
  ({
    position = 'bottom-right',
    className,
    style,
    showZoom = true,
    showFitView = true,
    onZoomIn,
    onZoomOut,
    onFitView,
    ...props
  }, ref) => {
    const controlsClasses = cn(
      'flex flex-col gap-1 bg-background/80 backdrop-blur-sm rounded-md shadow-sm border border-border',
      className
    );

    const buttonClasses = 'p-2 hover:bg-accent rounded-sm transition-colors';

    return (
      <FlowPanel position={position} className={controlsClasses} style={style} ref={ref} {...props}>
        {showZoom && (
          <>
            <button className={buttonClasses} onClick={onZoomIn} aria-label="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button className={buttonClasses} onClick={onZoomOut} aria-label="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </button>
          </>
        )}
        {showFitView && (
          <button className={buttonClasses} onClick={onFitView} aria-label="Fit view">
            <Maximize className="h-4 w-4" />
          </button>
        )}
      </FlowPanel>
    );
  }
);

FlowControls.displayName = 'FlowControls';

export const FlowMiniMap = forwardRef<HTMLDivElement, IFlowMiniMapProps>(
  ({
    position = 'bottom-left',
    className,
    style,
    nodeColor = '#e2e2e2',
    nodeStrokeColor = 'transparent',
    nodeBorderRadius = 5,
    maskColor = 'rgba(240, 240, 240, 0.6)',
    ...props
  }, ref) => {
    // Handle function or string for node colors
    const getNodeColor = typeof nodeColor === 'function' ? nodeColor : () => nodeColor as string;
    const getNodeStrokeColor = typeof nodeStrokeColor === 'function' ? nodeStrokeColor : () => nodeStrokeColor as string;
    const miniMapClasses = cn(
      'bg-background/80 backdrop-blur-sm rounded-md shadow-sm border border-border p-1',
      className
    );

    return (
      <FlowPanel position={position} className={miniMapClasses} style={style} ref={ref} {...props}>
        <svg width="200" height="150" viewBox="0 0 200 150" className="overflow-visible">
          {/* This would render a simplified version of the nodes and viewport */}
          <rect x="0" y="0" width="200" height="150" fill="transparent" stroke="#ddd" strokeWidth="1" />
          <rect x="50" y="40" width="30" height="20" rx={nodeBorderRadius} fill={getNodeColor({ id: '1', position: { x: 0, y: 0 } } as IFlowNode)} stroke={getNodeStrokeColor({ id: '1', position: { x: 0, y: 0 } } as IFlowNode)} />
          <rect x="120" y="90" width="30" height="20" rx={nodeBorderRadius} fill={getNodeColor({ id: '2', position: { x: 0, y: 0 } } as IFlowNode)} stroke={getNodeStrokeColor({ id: '2', position: { x: 0, y: 0 } } as IFlowNode)} />
          <path d="M80,50 L120,90" stroke="#ccc" strokeWidth="1" />

          {/* Viewport indicator */}
          <path
            d="M0,0 H200 V150 H0 Z M40,30 H160 V120 H40 Z"
            fill={maskColor}
            fillRule="evenodd"
            pointerEvents="none"
          />
        </svg>
      </FlowPanel>
    );
  }
);

FlowMiniMap.displayName = 'FlowMiniMap';

export const FlowBackground = forwardRef<HTMLDivElement, IFlowBackgroundProps>(
  ({ variant = 'dots', gap = 20, size = 1, color = '#f0f0f0', className, style, ...props }, ref) => {
    const backgroundClasses = cn(
      'absolute inset-0 pointer-events-none',
      className
    );

    const getBackgroundStyle = () => {
      switch (variant) {
        case 'lines':
          return {
            backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
            backgroundSize: `${gap}px ${gap}px`,
          };
        case 'cross':
          return {
            backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
            backgroundSize: `${gap}px ${gap}px`,
            backgroundPosition: `-0.5px -0.5px`,
          };
        case 'dots':
        default:
          return {
            backgroundImage: `radial-gradient(${color} ${size}px, transparent 0)`,
            backgroundSize: `${gap}px ${gap}px`,
          };
      }
    };

    return (
      <div
        ref={ref}
        className={backgroundClasses}
        style={{ ...getBackgroundStyle(), ...style }}
        {...props}
      />
    );
  }
);

FlowBackground.displayName = 'FlowBackground';

export const Flow = forwardRef<HTMLDivElement, IFlowProps>(
  ({
    nodes = [],
    edges = [],
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    className,
    style,
    children,
    fitView = false,
    snapToGrid = false,
    snapGrid = [15, 15],
    nodeTypes = {},
    edgeTypes = {},
    defaultZoom = 1,
    minZoom = 0.1,
    maxZoom = 2,
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(defaultZoom);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    const [nodeDragStart, setNodeDragStart] = useState({ x: 0, y: 0 });
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

    // Handle zoom
    const handleZoomIn = useCallback(() => {
      setZoom((prev) => Math.min(prev * 1.2, maxZoom));
    }, [maxZoom]);

    const handleZoomOut = useCallback(() => {
      setZoom((prev) => Math.max(prev / 1.2, minZoom));
    }, [minZoom]);

    const handleFitView = useCallback(() => {
      if (nodes.length === 0 || !containerRef.current) return;

      // Calculate bounds
      const bounds = nodes.reduce(
        (acc, node) => {
          const x = node.position.x;
          const y = node.position.y;
          const width = node.width || 150;
          const height = node.height || 40;

          return {
            minX: Math.min(acc.minX, x),
            minY: Math.min(acc.minY, y),
            maxX: Math.max(acc.maxX, x + width),
            maxY: Math.max(acc.maxY, y + height),
          };
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const boundsWidth = bounds.maxX - bounds.minX;
      const boundsHeight = bounds.maxY - bounds.minY;

      // Calculate zoom to fit
      const zoomX = containerWidth / (boundsWidth + 100);
      const zoomY = containerHeight / (boundsHeight + 100);
      const newZoom = Math.min(Math.min(zoomX, zoomY), maxZoom);

      // Calculate center position
      const centerX = bounds.minX + boundsWidth / 2;
      const centerY = bounds.minY + boundsHeight / 2;

      // Calculate pan offset
      const newPanOffset = {
        x: containerWidth / 2 - centerX * newZoom,
        y: containerHeight / 2 - centerY * newZoom,
      };

      setZoom(newZoom);
      setPanOffset(newPanOffset);
    }, [nodes, maxZoom]);

    // Handle mouse events for panning
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button

      const target = e.target as HTMLElement;
      const nodeElement = target.closest('[data-node-id]');

      if (nodeElement) {
        // Handle node dragging
        const nodeId = nodeElement.getAttribute('data-node-id');
        if (nodeId) {
          const node = nodes.find(n => n.id === nodeId);
          if (node && (node.draggable !== false)) { // Default to draggable if not specified
            e.stopPropagation();
            setDraggedNode(nodeId);
            setNodeDragStart({ x: e.clientX, y: e.clientY });
          }
        }
        return;
      }

      // Handle canvas panning
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }, [nodes]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      // Handle node dragging
      if (draggedNode) {
        const dx = (e.clientX - nodeDragStart.x) / zoom;
        const dy = (e.clientY - nodeDragStart.y) / zoom;

        const updatedNodes = nodes.map(node => {
          if (node.id === draggedNode) {
            return {
              ...node,
              position: {
                x: node.position.x + dx,
                y: node.position.y + dy
              }
            };
          }
          return node;
        });

        if (onNodesChange) {
          onNodesChange(updatedNodes);
        }

        setNodeDragStart({ x: e.clientX, y: e.clientY });
        return;
      }

      // Handle canvas panning
      if (!isDragging) return;

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setPanOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }, [isDragging, dragStart, draggedNode, nodeDragStart, nodes, onNodesChange, zoom]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      setDraggedNode(null);
    }, []);

    // Handle node click
    const handleNodeClick = useCallback((e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      setSelectedNodes([nodeId]);
      setSelectedEdges([]);

      if (onNodeClick && node) {
        onNodeClick(e, node);
      }
    }, [nodes, onNodeClick]);

    // Handle edge click
    const handleEdgeClick = useCallback((e: React.MouseEvent, edgeId: string) => {
      e.stopPropagation();

      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) return;

      setSelectedEdges([edgeId]);
      setSelectedNodes([]);

      if (onEdgeClick && edge) {
        onEdgeClick(e, edge);
      }
    }, [edges, onEdgeClick]);

    // Handle background click to clear selection
    const handleBackgroundClick = useCallback(() => {
      setSelectedNodes([]);
      setSelectedEdges([]);
    }, []);

    // Apply fitView on initial render if specified
    useEffect(() => {
      if (fitView) {
        handleFitView();
      }
    }, [fitView, handleFitView]);

    // Render nodes with correct position
    const renderNodes = () => {
      return nodes.map((node) => {
        const { x, y } = calculateNodePosition(node, zoom, panOffset);
        const isSelected = selectedNodes.includes(node.id);

        // Use custom node type if provided
        const NodeType = node.type && nodeTypes[node.type]
          ? nodeTypes[node.type]
          : FlowNode;

        return (
          <NodeType
            key={node.id}
            id={node.id}
            data={node.data}
            selected={isSelected}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              width: node.width ? `${node.width}px` : undefined,
              height: node.height ? `${node.height}px` : undefined,
            }}
            onClick={(e) => handleNodeClick(e, node.id)}
          />
        );
      });
    };

    // Simplified edge rendering (in a real implementation, this would calculate actual paths)
    const renderEdges = () => {
      return edges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        const sourcePos = calculateNodePosition(sourceNode, zoom, panOffset);
        const targetPos = calculateNodePosition(targetNode, zoom, panOffset);

        // Add width/height to get center of nodes
        const sourceWidth = sourceNode.width || 150;
        const sourceHeight = sourceNode.height || 40;
        const targetWidth = targetNode.width || 150;
        const targetHeight = targetNode.height || 40;

        const sourceX = sourcePos.x + sourceWidth / 2;
        const sourceY = sourcePos.y + sourceHeight / 2;
        const targetX = targetPos.x + targetWidth / 2;
        const targetY = targetPos.y + targetHeight / 2;

        const isSelected = selectedEdges.includes(edge.id);

        // Use custom edge type if provided
        const EdgeType = edge.type && edgeTypes[edge.type]
          ? edgeTypes[edge.type]
          : FlowEdge;

        return (
          <EdgeType
            key={edge.id}
            id={edge.id}
            source={edge.source}
            target={edge.target}
            selected={isSelected}
            animated={edge.animated}
            onClick={(e) => handleEdgeClick(e, edge.id)}
            d={`M${sourceX},${sourceY} L${targetX},${targetY}`}
            style={{...edge.style}}
          />
        );
      });
    };

    const flowClasses = cn(
      'relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900',
      isDragging && 'cursor-grabbing',
      draggedNode && 'cursor-grabbing',
      className
    );

    return (
      <div
        ref={(el) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(el);
            } else {
              ref.current = el;
            }
          }
          containerRef.current = el;
        }}
        className={flowClasses}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleBackgroundClick}
        {...props}
      >
        <FlowBackground />

        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <g>{renderEdges()}</g>
          </svg>

          {renderNodes()}
        </div>

        {children}

        <FlowControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
        />
      </div>
    );
  }
);

Flow.displayName = 'Flow';
