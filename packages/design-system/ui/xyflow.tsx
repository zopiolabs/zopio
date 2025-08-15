/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import type React from "react"

import { useState, useCallback } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"

import { Plus, Minus, Maximize2, Menu } from "lucide-react"
import { Button } from "./button"
import { AdvancedSidebar } from "./advanced-sidebar"

const initialNodes: Node[] = [
  {
    id: "root",
    type: "default",
    position: { x: 400, y: 50 },
    data: { label: "Root" },
  },
  {
    id: "child1",
    type: "default",
    position: { x: 200, y: 200 },
    data: { label: "Child 1" },
  },
  {
    id: "child2",
    type: "default",
    position: { x: 400, y: 200 },
    data: { label: "Child 2" },
  },
  {
    id: "child3",
    type: "default",
    position: { x: 600, y: 200 },
    data: { label: "Child 3" },
  },
  {
    id: "grandchild1",
    type: "default",
    position: { x: 100, y: 350 },
    data: { label: "Grandchild 1" },
  },
  {
    id: "grandchild2",
    type: "default",
    position: { x: 250, y: 350 },
    data: { label: "Grandchild 2" },
  },
  {
    id: "grandchild4",
    type: "default",
    position: { x: 350, y: 350 },
    data: { label: "Grandchild 4" },
  },
  {
    id: "grandchild5",
    type: "default",
    position: { x: 450, y: 350 },
    data: { label: "Grandchild 5" },
  },
  {
    id: "grandchild7",
    type: "default",
    position: { x: 550, y: 350 },
    data: { label: "Grandchild 7" },
  },
  {
    id: "grandchild8",
    type: "default",
    position: { x: 650, y: 350 },
    data: { label: "Grandchild 8" },
  },
]

const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "root",
    target: "child1",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e2",
    source: "root",
    target: "child2",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e3",
    source: "root",
    target: "child3",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e4",
    source: "child1",
    target: "grandchild1",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e5",
    source: "child1",
    target: "grandchild2",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e6",
    source: "child2",
    target: "grandchild4",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e7",
    source: "child2",
    target: "grandchild5",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e8",
    source: "child3",
    target: "grandchild7",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
  {
    id: "e9",
    source: "child3",
    target: "grandchild8",
    type: "smoothstep",
    style: { strokeDasharray: "5,5", stroke: "#666" },
  },
]

interface ReactFlowPlaygroundProps {
  className?: string
  initialNodesData?: Node[]
  initialEdgesData?: Edge[]
  showHeader?: boolean
  showControls?: boolean
  showBackground?: boolean
  backgroundVariant?: BackgroundVariant
}

export function ReactFlowPlayground({
  className = "",
  initialNodesData = initialNodes,
  initialEdgesData = initialEdges,
  showHeader = true,
  showControls = true,
  showBackground = true,
  backgroundVariant = BackgroundVariant.Dots,
}: ReactFlowPlaygroundProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesData)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesData)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [hasChanges, setHasChanges] = useState(false)
  const [originalConfig, setOriginalConfig] = useState<any>(null)
  const [currentConfig, setCurrentConfig] = useState<any>(null)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const newFullscreen = !prev
      if (newFullscreen) {
        setSidebarOpen(false)
      }
      return newFullscreen
    })
  }, [])

  const onConfigChange = useCallback(
    (config: any) => {
      setCurrentConfig(config)
      if (!originalConfig) {
        setOriginalConfig(config)
      }
      setHasChanges(true)
    },
    [originalConfig],
  )

  const handleNodesChange = useCallback(
    (changes: any[]) => {
      const hasPositionChange = changes.some((change) => change.type === "position" && change.dragging === false)
      onNodesChange(changes)
      if (hasPositionChange) {
        onConfigChange({ type: "nodePosition", timestamp: Date.now() })
      }
    },
    [onNodesChange, onConfigChange],
  )

  const handleApplyChanges = useCallback(() => {
    if (currentConfig) {
      setOriginalConfig(currentConfig)
      setHasChanges(false)
    }
  }, [currentConfig])

  const handleDiscardChanges = useCallback(() => {
    if (originalConfig) {
      setCurrentConfig(originalConfig)
      setNodes(initialNodesData)
    }
    setHasChanges(false)
  }, [originalConfig, setNodes, initialNodesData])

  return (
    <div className={`h-screen w-full flex flex-col bg-background overflow-hidden ${className}`}>
      {!isFullscreen && showHeader && (
        <div className="flex items-center justify-between p-4 border-b bg-card shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-2 hover:bg-gray-100">
              <Menu className="w-4 h-4" />
            </Button>
            <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-lg font-semibold">React Flow Playground</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasChanges}
              onClick={handleDiscardChanges}
              className={!hasChanges ? "opacity-50 cursor-not-allowed" : ""}
            >
              Discard
            </Button>
            <Button
              size="sm"
              disabled={!hasChanges}
              onClick={handleApplyChanges}
              className={`${hasChanges ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!isFullscreen && (
          <AdvancedSidebar
            selectedNode={selectedNode}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onConfigChange={onConfigChange}
          />
        )}

        {!isFullscreen && sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : "flex-1 relative min-w-0"}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            className="w-full h-full bg-gray-50"
          >
            {showControls && (
              <Controls className="absolute bottom-4 left-4">
                <div className="flex flex-col gap-1">
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-transparent">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-transparent">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 bg-transparent"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </Controls>
            )}
            {showBackground && <Background variant={backgroundVariant} gap={20} size={1} />}
          </ReactFlow>

          {!isFullscreen && (
            <div className="absolute bottom-4 right-4 flex gap-4 text-sm text-muted-foreground">
              <span>Node Inspector</span>
              <span>Viewport Logger</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
