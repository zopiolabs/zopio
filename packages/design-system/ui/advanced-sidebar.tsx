/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import { useState } from "react"

import {
  Workflow,
  FileCode2,
  Network,
  ExternalLink,
  FolderDown,
  MessageSquareMore,
  Share2,
  Plus,
  HardDriveDownload,
  Trash,
  SquarePen,
  HardDriveUpload,
  CloudIcon as CloudAlert,
  X,
} from "lucide-react"

import type { Node } from "reactflow"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Checkbox } from "./checkbox"
import { Button } from "./button"
import { Input } from "./input"

interface AdvancedSidebarProps {
  selectedNode?: Node | null
  className?: string
  isOpen?: boolean
  onClose?: () => void
  onConfigChange?: (config: any) => void
}

export function AdvancedSidebar({
  selectedNode,
  className,
  isOpen = true,
  onClose,
  onConfigChange,
}: AdvancedSidebarProps) {
  const [activeMenu, setActiveMenu] = useState("nodes-edges")

  const [saves, setSaves] = useState([{ id: 1, name: "New Save", timestamp: "a few seconds ago" }])

  const [layoutConfig, setLayoutConfig] = useState({
    library: "None",
    // Dagre options
    rankDirection: "TB",
    nodeAlignment: "Select",
    nodeSeparation: 50,
    edgeSeparation: 10,
    rankSeparation: 50,
    horizontalMargin: 0,
    verticalMargin: 0,
    acyclicAlgorithm: "Select",
    rankingAlgorithm: "network-simplex",
    minimumEdgeLength: 1,
    // D3 Hierarchy options
    layoutType: "d3.tree",
    nodeSize: [150, 30],
    separation: 10,
    positionType: "cartesian",
    treeSize: [360, 600],
    // ElkJS options
    direction: "DOWN",
    alignment: "AUTOMATIC",
    elkEdgeSpacing: 10,
    elkNodeSpacing: 50,
    randomizationSeed: 1,
    portConstraints: "UNDEFINED",
    hierarchyHandling: "INHERIT",
    separateComponents: false,
    compaction: false,
    componentSpacing: 20,
    algorithm: "mrtree",
    edgeRoutingMode: "AVOID_OVERLAP",
    edgeEndTextureLength: 7,
    searchOrder: "DFS",
  })

  // State for all the configuration options
  const [config, setConfig] = useState({
    // Appearance
    colorMode: "light",
    attributionPosition: "bottom-right",

    // Selection
    selectionMode: "full",
    selectNodesOnDrag: true,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: false,

    // Pane Interactions
    paneClickDistance: 0,
    preventScrolling: true,
    selectionOnDrag: false,
    panOnDrag: true,
    panOnScroll: false,
    panOnScrollSpeed: 20,
    panOnScrollMode: "Free",
    zoomOnScroll: true,
    zoomOnPinch: true,
    zoomOnDoubleClick: true,

    // Node Interaction
    nodeOrigin: [0, 0],
    nodeClickDistance: 0,
    nodesDraggable: true,
    nodeDragThreshold: 1,
    nodesConnectable: true,
    elementsSelectable: true,

    // Auto Pan
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    autoPanSpeed: 20,

    // Viewport
    minZoom: 0.5,
    maxZoom: 2,
    onlyRenderVisibleElements: false,

    // Snap Grid
    snapToGrid: false,
    snapGrid: [25, 25],

    // Extents
    translateExtent: ["-Infinity", "-Infinity", "Infinity", "Infinity"],
    nodeExtent: ["-Infinity", "-Infinity", "Infinity", "Infinity"],

    // Connection
    connectionMode: "strict",
    connectionRadius: 20,
    connectionLineType: "default",
    connectOnClick: true,

    // Reconnection
    reconnectRadius: 10,
    edgesReconnectable: true,

    // Focus
    nodesFocusable: true,
    edgesFocusable: true,

    // Keyboard
    deleteKeyCode: "Backspace",
    selectionKeyCode: "Shift",
    multiSelectionKeyCode: "Meta",
    zoomActivationKeyCode: "Meta",
    panActivationKeyCode: "Space",
    disableKeyboardA11y: false,
  })

  const [nodesEdgesConfig, setNodesEdgesConfig] = useState({
    handlePositions: "top-bottom",
    floatingEdges: false,
    dataset: "Tree",
    selectedNodeId: "child2",
    selectedNodeLabel: "Child 2",
    targetHandles: 1,
    sourceHandles: 1,
    nodePosition: [163, 47],
    nodeWidth: 0,
    nodeHeight: 0,
    nodeZIndex: 0,
    nodeConnectable: true,
    nodeDraggable: true,
    nodeDeletable: true,
    nodeFocusable: true,
    expandParent: false,
    parentId: "None",
  })

  const menuItems = [
    { id: "nodes-edges", icon: Workflow, label: "Nodes & Edges" },
    { id: "reactflow-props", icon: FileCode2, label: "ReactFlow Props" },
    { id: "layout", icon: Network, label: "Layout" },
    { id: "external", icon: ExternalLink, label: "External" },
    { id: "folder", icon: FolderDown, label: "Folder" },
    { id: "messages", icon: MessageSquareMore, label: "Messages" },
  ]

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value }
      onConfigChange?.(newConfig)
      return newConfig
    })
  }

  const updateNodesEdgesConfig = (key: string, value: any) => {
    setNodesEdgesConfig((prev) => {
      const newConfig = { ...prev, [key]: value }
      onConfigChange?.(newConfig)
      return newConfig
    })
  }

  const updateLayoutConfig = (key: string, value: any) => {
    setLayoutConfig((prev) => {
      const newConfig = { ...prev, [key]: value }
      onConfigChange?.(newConfig)
      return newConfig
    })
  }

  const resetSection = (section: string) => {
    console.log(`Resetting ${section} section`)
  }

  const handleSaveInBrowser = () => {
    const newSave = {
      id: Date.now(),
      name: `Save ${saves.length + 1}`,
      timestamp: "just now",
    }
    setSaves([newSave, ...saves])
  }

  const handleDeleteSave = (id: number) => {
    setSaves(saves.filter((save) => save.id !== id))
  }

  const handleLoadSave = (id: number) => {
    console.log("[v0] Loading save:", id)
  }

  const renderNodesEdgesContent = () => (
    <div className="-mt-2 flex-1 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2 px-0">
        <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 m-2 mb-0 font-[NTDapper] text-sm font-bold tracking-wide text-black normal-case select-none">
          Nodes & Edges
        </div>

        <div className="w-full text-sm">
          <ul className="flex w-full min-w-0 flex-col gap-1">
            {/* OPTIONS Section */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                Options
              </div>

              <li className="group/menu-item relative flex items-center gap-2 rounded-sm px-2 py-1 hover:[&_svg]:opacity-100">
                <span className="max-w-3/6 text-xs select-none">Handle Positions</span>
                <Select
                  value={nodesEdgesConfig.handlePositions}
                  onValueChange={(value) => updateNodesEdgesConfig("handlePositions", value)}
                >
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ml-auto max-w-1/2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-bottom">top-bottom</SelectItem>
                    <SelectItem value="left-right">left-right</SelectItem>
                    <SelectItem value="top">top</SelectItem>
                    <SelectItem value="bottom">bottom</SelectItem>
                  </SelectContent>
                </Select>
              </li>

              <li className="group/menu-item relative flex items-center gap-2 rounded-sm px-2 py-1 hover:[&_svg]:opacity-100">
                <span>
                  <a
                    href="https://reactflow.dev/examples/edges/floating-edges"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-3/6 cursor-pointer text-xs underline"
                  >
                    Floating Edges
                  </a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-up-right text-secondary-foreground absolute mt-[2px] ml-[-1px] inline opacity-0"
                  >
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </span>
                <Checkbox
                  checked={nodesEdgesConfig.floatingEdges}
                  onCheckedChange={(checked) => updateNodesEdgesConfig("floatingEdges", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>

            {/* NODES & EDGES Section */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                Nodes & Edges
              </div>

              <li className="group/menu-item relative flex items-center gap-2 rounded-sm px-2 py-1 hover:[&_svg]:opacity-100">
                <span className="max-w-3/6 text-xs select-none">Dataset</span>
                <Select
                  value={nodesEdgesConfig.dataset}
                  onValueChange={(value) => updateNodesEdgesConfig("dataset", value)}
                >
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ml-auto max-w-2/3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tree">Tree</SelectItem>
                    <SelectItem value="Graph">Graph</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                  </SelectContent>
                </Select>
              </li>

              <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 has-[>svg]:px-3 text-muted-foreground m-2 text-xs">
                <Plus className="mr-2 h-4 w-4" />
                Add new node
              </Button>
            </div>

            {/* NODE INSPECTOR Section */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                Node Inspector
              </div>

              {selectedNode ? (
                <>
                  {/* BASIC Subsection */}
                  <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                    <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                      Basic
                    </div>
                    <div className="w-full text-sm list-none">
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">ID</span>
                       <Input
                          type="text"
                          value={selectedNode.id}
                          readOnly
                          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Label</span>
                        <Input
                          type="text"
                          value={selectedNode.data?.label || ""}
                          readOnly
                          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                        />
                      </li>
                    </div>
                  </div>

                  {/* NUMBER OF HANDLES Subsection */}
                  <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                    <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                      Number of Handles
                    </div>
                    <div className="w-full text-sm list-none">
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Target</span>
                        <Input
                          type="number"
                          value={1}
                          readOnly
                          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Source</span>
                        <Input
                          type="number"
                          value={1}
                          readOnly
                          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                        />
                      </li>
                    </div>
                  </div>

                  {/* LAYOUT Subsection */}
                  <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                    <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                      Layout
                    </div>
                    <div className="w-full text-sm list-none">
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Position</span>
                        <Input
                          type="number"
                          value={Math.round(selectedNode.position.x)}
                          readOnly
                          className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border text-right font-mono text-[0.8em]"
                        />
                        <Input
                          type="number"
                          value={Math.round(selectedNode.position.y)}
                          readOnly
                         className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border text-right font-mono text-[0.8em]"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Width</span>
                        <Input
                          type="number"
                          value={selectedNode.width || 0}
                          readOnly
                          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Height</span>
                        <Input
                          type="number"
                          value={selectedNode.height || 0}
                          readOnly
                          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">z-index</span>
                        <Input
                          type="number"
                          value={selectedNode.zIndex || 0}
                          readOnly
                          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                        />
                      </li>
                    </div>
                  </div>

                  {/* INTERACTION Subsection */}
                  <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                    <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                      Interaction
                    </div>
                    <div className="w-full text-sm list-none">
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Connectable</span>
                        <Checkbox
                          checked={selectedNode.connectable !== false}
                          disabled
                          className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Draggable</span>
                        <Checkbox
                          checked={selectedNode.draggable !== false}
                          disabled
                          className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Deletable</span>
                        <Checkbox
                          checked={selectedNode.deletable !== false}
                          disabled
                          className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Focusable</span>
                        <Checkbox
                          checked={selectedNode.focusable !== false}
                          disabled
                          className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </li>
                    </div>
                  </div>

                  {/* HIERARCHY Subsection */}
                  <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                    <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                      Hierarchy
                    </div>
                    <div className="w-full text-sm list-none">
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Expand Parent</span>
                        <Checkbox
                          checked={selectedNode.expandParent || false}
                          disabled
                          className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </li>
                      <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                        <span className="max-w-3/6 text-xs select-none">Parent ID</span>
                        <Select value={selectedNode.parentId || "Select"} disabled>
                          <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </li>
                    </div>
                  </div>

                  {/* MOVE POSITION IN NODES ARRAY Subsection */}
                  <div className="relative flex w-full min-w-0 flex-col p-2">
                    <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                      Move Position in Nodes Array
                    </div>
                    <div className="flex gap-2">
                      <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 has-[>svg]:px-3 flex-1 text-xs">
                        To Start
                      </Button>
                      <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 has-[>svg]:px-3 flex-1 text-xs">
                        To End
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground/70 m-2 mt-1 text-xs">Select nodes to change their properties</p>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderReactFlowPropsContent = () => (
    <div className="-mt-2 flex-1 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2 px-0">
        <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 m-2 mb-0 font-[NTDapper] text-sm font-bold tracking-wide text-black normal-case select-none">
          &lt;ReactFlow /&gt; Props
        </div>
        <div className="w-full text-sm">
          {/* Appearance Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Appearance
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("appearance")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Color Mode</span>
                <Select value={config.colorMode} onValueChange={(value) => updateConfig("colorMode", value)}>
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">light</SelectItem>
                    <SelectItem value="dark">dark</SelectItem>
                  </SelectContent>
                </Select>
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Attribution Position</span>
                <Select
                  value={config.attributionPosition}
                  onValueChange={(value) => updateConfig("attributionPosition", value)}
                >
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">bottom-right</SelectItem>
                    <SelectItem value="bottom-left">bottom-left</SelectItem>
                    <SelectItem value="top-right">top-right</SelectItem>
                    <SelectItem value="top-left">top-left</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            </div>
          </div>

          {/* Selection Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Selection
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("selection")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Selection Mode</span>
                <Select value={config.selectionMode} onValueChange={(value) => updateConfig("selectionMode", value)}>
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">full</SelectItem>
                    <SelectItem value="partial">partial</SelectItem>
                  </SelectContent>
                </Select>
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Select Nodes on Drag</span>
                <Checkbox
                  checked={config.selectNodesOnDrag}
                  onCheckedChange={(checked) => updateConfig("selectNodesOnDrag", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Elevate Nodes on Select</span>
                <Checkbox
                  checked={config.elevateNodesOnSelect}
                  onCheckedChange={(checked) => updateConfig("elevateNodesOnSelect", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Elevate Edges on Select</span>
                <Checkbox
                  checked={config.elevateEdgesOnSelect}
                  onCheckedChange={(checked) => updateConfig("elevateEdgesOnSelect", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>

          {/* Pane Interactions Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Pane Interactions
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("pane-interactions")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Pane Click Distance</span>
                <Input
                  type="number"
                  min="0"
                  value={config.paneClickDistance}
                  onChange={(e) => updateConfig("paneClickDistance", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Prevent Scrolling</span>
                <Checkbox
                  checked={config.preventScrolling}
                  onCheckedChange={(checked) => updateConfig("preventScrolling", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Selection on Drag</span>
                <Checkbox
                  checked={config.selectionOnDrag}
                  onCheckedChange={(checked) => updateConfig("selectionOnDrag", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Pan on Drag</span>
                <Checkbox
                  checked={config.panOnDrag}
                  onCheckedChange={(checked) => updateConfig("panOnDrag", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Pan on Scroll</span>
                <Checkbox
                  checked={config.panOnScroll}
                  onCheckedChange={(checked) => updateConfig("panOnScroll", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Pan on Scroll Speed</span>
                <Input
                  type="number"
                  min="0"
                  value={config.panOnScrollSpeed}
                  onChange={(e) => updateConfig("panOnScrollSpeed", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Pan on Scroll Mode</span>
                <Select
                  value={config.panOnScrollMode}
                  onValueChange={(value) => updateConfig("panOnScrollMode", value)}
                >
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Horizontal">Horizontal</SelectItem>
                    <SelectItem value="Vertical">Vertical</SelectItem>
                  </SelectContent>
                </Select>
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Zoom on Scroll</span>
                <Checkbox
                  checked={config.zoomOnScroll}
                  onCheckedChange={(checked) => updateConfig("zoomOnScroll", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Zoom on Pinch</span>
                <Checkbox
                  checked={config.zoomOnPinch}
                  onCheckedChange={(checked) => updateConfig("zoomOnPinch", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Zoom on Double Click</span>
                <Checkbox
                  checked={config.zoomOnDoubleClick}
                  onCheckedChange={(checked) => updateConfig("zoomOnDoubleClick", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>

          {/* Node Interaction Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Node Interaction
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("node-interaction")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Node Origin</span>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.nodeOrigin[0]}
                  onChange={(e) =>
                    updateConfig("nodeOrigin", [Number.parseFloat(e.target.value), config.nodeOrigin[1]])
                  }
                  className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border text-right font-mono text-[0.8em]"
                />
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.nodeOrigin[1]}
                  onChange={(e) =>
                    updateConfig("nodeOrigin", [config.nodeOrigin[0], Number.parseFloat(e.target.value)])
                  }
                  className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border text-right font-mono text-[0.8em]"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Node Click Distance</span>
                <Input
                  type="number"
                  min="0"
                  value={config.nodeClickDistance}
                  onChange={(e) => updateConfig("nodeClickDistance", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Nodes Draggable</span>
                <Checkbox
                  checked={config.nodesDraggable}
                  onCheckedChange={(checked) => updateConfig("nodesDraggable", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Node Drag Threshold</span>
                <Input
                  type="number"
                  min="0"
                  value={config.nodeDragThreshold}
                  onChange={(e) => updateConfig("nodeDragThreshold", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Nodes Connectable</span>
                <Checkbox
                  checked={config.nodesConnectable}
                  onCheckedChange={(checked) => updateConfig("nodesConnectable", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Elements Selectable</span>
                <Checkbox
                  checked={config.elementsSelectable}
                  onCheckedChange={(checked) => updateConfig("elementsSelectable", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>

          {/* Auto Pan Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Auto Pan
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("auto-pan")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Auto Pan on Connect</span>
                <Checkbox
                  checked={config.autoPanOnConnect}
                  onCheckedChange={(checked) => updateConfig("autoPanOnConnect", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Auto Pan on Node Drag</span>
                <Checkbox
                  checked={config.autoPanOnNodeDrag}
                  onCheckedChange={(checked) => updateConfig("autoPanOnNodeDrag", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Auto Pan Speed</span>
                <Input
                  type="number"
                  min="0"
                  value={config.autoPanSpeed}
                  onChange={(e) => updateConfig("autoPanSpeed", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
            </div>
          </div>

          {/* Viewport Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Viewport
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("viewport")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Minimum Zoom</span>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={config.minZoom}
                  onChange={(e) => updateConfig("minZoom", Number.parseFloat(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Maximum Zoom</span>
                <Input
                  type="number"
                  min="0"
                  value={config.maxZoom}
                  onChange={(e) => updateConfig("maxZoom", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Render Only Visible Elements</span>
                <Checkbox
                  checked={config.onlyRenderVisibleElements}
                  onCheckedChange={(checked) => updateConfig("onlyRenderVisibleElements", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>

          {/* Snap Grid Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Snap Grid
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("snap-grid")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Snap to Grid</span>
                <Checkbox
                  checked={config.snapToGrid}
                  onCheckedChange={(checked) => updateConfig("snapToGrid", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Snap Grid</span>
                <Input
                  type="number"
                  min="0"
                  value={config.snapGrid[0]}
                  onChange={(e) => updateConfig("snapGrid", [Number.parseInt(e.target.value), config.snapGrid[1]])}
                  className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border text-right font-mono text-[0.8em]"
                />
                <Input
                  type="number"
                  min="0"
                  value={config.snapGrid[1]}
                  onChange={(e) => updateConfig("snapGrid", [config.snapGrid[0], Number.parseInt(e.target.value)])}
                 className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border text-right font-mono text-[0.8em]"
                />
              </li>
            </div>
          </div>

          {/* Extents Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Extents
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("extents")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Translate Extent</span>
                <div className="ml-auto w-1/2">
                  <div className="flex">
                    <Input
                      type="text"
                      value={config.translateExtent[0][0]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                    <Input
                      type="text"
                      value={config.translateExtent[0][1]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                  </div>
                  <div className="mt-1 mb-2 flex">
                    <Input
                      type="text"
                      value={config.translateExtent[1][0]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                    <Input
                      type="text"
                      value={config.translateExtent[1][1]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                  </div>
                </div>
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Node Extent</span>
                <div className="ml-auto w-1/2">
                  <div className="flex">
                    <Input
                      type="text"
                      value={config.nodeExtent[0][0]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                    <Input
                      type="text"
                      value={config.nodeExtent[0][1]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                  </div>
                  <div className="mt-1 mb-2 flex">
                    <Input
                      type="text"
                      value={config.nodeExtent[1][0]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                    <Input
                      type="text"
                      value={config.nodeExtent[1][1]}
                      readOnly
                      className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border font-mono text-[0.8em]"
                    />
                  </div>
                </div>
              </li>
            </div>
          </div>

          {/* Connection Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Connection
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("connection")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Connection Mode</span>
                <Select value={config.connectionMode} onValueChange={(value) => updateConfig("connectionMode", value)}>
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">strict</SelectItem>
                    <SelectItem value="loose">loose</SelectItem>
                  </SelectContent>
                </Select>
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Connection Radius</span>
                <Input
                  type="number"
                  min="0"
                  value={config.connectionRadius}
                  onChange={(e) => updateConfig("connectionRadius", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Connection Line Type</span>
                <Select
                  value={config.connectionLineType}
                  onValueChange={(value) => updateConfig("connectionLineType", value)}
                >
                  <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">default</SelectItem>
                    <SelectItem value="straight">straight</SelectItem>
                    <SelectItem value="step">step</SelectItem>
                    <SelectItem value="smoothstep">smoothstep</SelectItem>
                  </SelectContent>
                </Select>
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Connect on Click</span>
                <Checkbox
                  checked={config.connectOnClick}
                  onCheckedChange={(checked) => updateConfig("connectOnClick", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>

          {/* Reconnection Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Reconnection
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("reconnection")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Reconnect Radius</span>
                <Input
                  type="number"
                  min="0"
                  value={config.reconnectRadius}
                  onChange={(e) => updateConfig("reconnectRadius", Number.parseInt(e.target.value))}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Edges Reconnectable</span>
                <Checkbox
                  checked={config.edgesReconnectable}
                  onCheckedChange={(checked) => updateConfig("edgesReconnectable", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>

          {/* Focus Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Focus
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("focus")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Nodes Focusable</span>
                <Checkbox
                  checked={config.nodesFocusable}
                  onCheckedChange={(checked) => updateConfig("nodesFocusable", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Edges Focusable</span>
                <Checkbox
                  checked={config.edgesFocusable}
                  onCheckedChange={(checked) => updateConfig("edgesFocusable", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>

          {/* Keyboard Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 tracking-wide uppercase group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 gap-2">
              Keyboard
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-2 text-xs h-auto"
                onClick={() => resetSection("keyboard")}
              >
                Reset
              </Button>
            </div>
            <div className="w-full text-sm list-none">
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Delete Key</span>
                <Input
                  type="text"
                  value={config.deleteKeyCode}
                  onChange={(e) => updateConfig("deleteKeyCode", e.target.value)}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Selection Key</span>
                <Input
                  type="text"
                  value={config.selectionKeyCode}
                  onChange={(e) => updateConfig("selectionKeyCode", e.target.value)}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Multi-Selection Key</span>
                <Input
                  type="text"
                  value={config.multiSelectionKeyCode}
                  onChange={(e) => updateConfig("multiSelectionKeyCode", e.target.value)}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Zoom Activation Key</span>
                <Input
                  type="text"
                  value={config.zoomActivationKeyCode}
                  onChange={(e) => updateConfig("zoomActivationKeyCode", e.target.value)}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Pan Activation Key</span>
                <Input
                  type="text"
                  value={config.panActivationKeyCode}
                  onChange={(e) => updateConfig("panActivationKeyCode", e.target.value)}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                />
              </li>
              <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                <span className="max-w-3/6 text-xs select-none">Disable Keyboard Accessibility</span>
                <Checkbox
                  checked={config.disableKeyboardA11y}
                  onCheckedChange={(checked) => updateConfig("disableKeyboardA11y", checked)}
                  className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLayoutContent = () => (
    <div className="-mt-2 flex-1 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2 px-0">
        <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 m-2 mb-0 font-[NTDapper] text-sm font-bold tracking-wide text-black normal-case select-none">
          Layouting Algorithms
        </div>

        <div className="w-full text-sm">
          {/* GENERAL Section */}
          <div className="relative flex w-full min-w-0 flex-col p-2">
            <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
              General
            </div>
            <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-2">
              <span className="max-w-3/6 text-xs select-none">Library</span>
              <Select value={layoutConfig.library} onValueChange={(value) => updateLayoutConfig("library", value)}>
                <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ml-auto max-w-2/3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Dagre">Dagre</SelectItem>
                  <SelectItem value="D3 Hierarchy">D3 Hierarchy</SelectItem>
                  <SelectItem value="ElkJS">ElkJS</SelectItem>
                </SelectContent>
              </Select>
            </li>
          </div>

          {/* Dynamic content based on selected library */}
          {layoutConfig.library === "Dagre" && (
            <>
              {/* GRAPH Section */}
              <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase gap-2">
                  Graph
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-2 text-xs h-auto"
                    onClick={() => resetSection("dagre-graph")}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full text-sm list-none">
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Rank Direction</span>
                    <Select
                      value={layoutConfig.rankDirection}
                      onValueChange={(value) => updateLayoutConfig("rankDirection", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TB">TB</SelectItem>
                        <SelectItem value="BT">BT</SelectItem>
                        <SelectItem value="LR">LR</SelectItem>
                        <SelectItem value="RL">RL</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Node Alignment</span>
                    <Select
                      value={layoutConfig.nodeAlignment}
                      onValueChange={(value) => updateLayoutConfig("nodeAlignment", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UL">UL</SelectItem>
                        <SelectItem value="UR">UR</SelectItem>
                        <SelectItem value="DL">DL</SelectItem>
                        <SelectItem value="DR">DR</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Node Separation</span>
                    <Input
                      type="number"
                      value={layoutConfig.nodeSeparation}
                      onChange={(e) => updateLayoutConfig("nodeSeparation", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Edge Separation</span>
                    <Input
                      type="number"
                      value={layoutConfig.edgeSeparation}
                      onChange={(e) => updateLayoutConfig("edgeSeparation", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Rank Separation</span>
                    <Input
                      type="number"
                      value={layoutConfig.rankSeparation}
                      onChange={(e) => updateLayoutConfig("rankSeparation", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Horizontal Margin</span>
                    <Input
                      type="number"
                      value={layoutConfig.horizontalMargin}
                      onChange={(e) => updateLayoutConfig("horizontalMargin", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Vertical Margin</span>
                    <Input
                      type="number"
                      value={layoutConfig.verticalMargin}
                      onChange={(e) => updateLayoutConfig("verticalMargin", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Acyclic Algorithm</span>
                    <Select
                      value={layoutConfig.acyclicAlgorithm}
                      onValueChange={(value) => updateLayoutConfig("acyclicAlgorithm", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greedy">greedy</SelectItem>
                        <SelectItem value="dfs">dfs</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Ranking Algorithm</span>
                    <Select
                      value={layoutConfig.rankingAlgorithm}
                      onValueChange={(value) => updateLayoutConfig("rankingAlgorithm", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="network-simplex">network-simplex</SelectItem>
                        <SelectItem value="tight-tree">tight-tree</SelectItem>
                        <SelectItem value="longest-path">longest-path</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                </div>
              </div>

              {/* EDGE Section */}
              <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase gap-2">
                  Edge
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-2 text-xs h-auto"
                    onClick={() => resetSection("dagre-edge")}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full text-sm list-none">
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span className="max-w-3/6 text-xs select-none">Minimum Edge Length</span>
                    <Input
                      type="number"
                      value={layoutConfig.minimumEdgeLength}
                      onChange={(e) => updateLayoutConfig("minimumEdgeLength", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                </div>
              </div>
            </>
          )}

          {layoutConfig.library === "D3 Hierarchy" && (
            <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
              <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase">
                Hierarchy
              </div>
              <div className="w-full text-sm list-none">
                <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                  <span>
                    <a
                      href="https://d3js.org/d3-hierarchy/tree"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="max-w-3/6 cursor-pointer text-xs underline"
                    >
                      Layout Type
                    </a>
                  </span>
                  <Select
                    value={layoutConfig.layoutType}
                    onValueChange={(value) => updateLayoutConfig("layoutType", value)}
                  >
                    <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="d3.tree">d3.tree</SelectItem>
                      <SelectItem value="d3.cluster">d3.cluster</SelectItem>
                    </SelectContent>
                  </Select>
                </li>
                <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                  <span className="max-w-3/6 text-xs select-none">Node Size</span>
                  <Input
                    type="number"
                    value={layoutConfig.nodeSize[0]}
                    onChange={(e) =>
                      updateLayoutConfig("nodeSize", [Number.parseInt(e.target.value), layoutConfig.nodeSize[1]])
                    }
                    className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border text-right font-mono text-[0.8em]"
                  />
                  <Input
                    type="number"
                    value={layoutConfig.nodeSize[1]}
                    onChange={(e) =>
                      updateLayoutConfig("nodeSize", [layoutConfig.nodeSize[0], Number.parseInt(e.target.value)])
                    }
                   className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border text-right font-mono text-[0.8em]"
                  />
                </li>
                <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                  <span className="max-w-3/6 text-xs select-none">Separation</span>
                  <Input
                    type="number"
                    value={layoutConfig.separation}
                    onChange={(e) => updateLayoutConfig("separation", Number.parseInt(e.target.value))}
                    className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                  />
                </li>
                <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                  <span className="max-w-3/6 text-xs select-none">Position Type</span>
                  <Select
                    value={layoutConfig.positionType}
                    onValueChange={(value) => updateLayoutConfig("positionType", value)}
                  >
                    <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartesian">cartesian</SelectItem>
                      <SelectItem value="radial">radial</SelectItem>
                    </SelectContent>
                  </Select>
                </li>
                <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                  <span className="max-w-3/6 text-xs select-none">Tree Size [x, y]</span>
                  <Input
                    type="number"
                    value={layoutConfig.treeSize[0]}
                    onChange={(e) =>
                      updateLayoutConfig("treeSize", [Number.parseInt(e.target.value), layoutConfig.treeSize[1]])
                    }
                    className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex ml-auto bg-card w-1/2 border text-right font-mono text-[0.8em]"
                  />
                  <Input
                    type="number"
                    value={layoutConfig.treeSize[1]}
                    onChange={(e) =>
                      updateLayoutConfig("treeSize", [layoutConfig.treeSize[0], Number.parseInt(e.target.value)])
                    }
                   className="peer/menu-button items-center gap-2 overflow-hidden rounded-md p-2 outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm flex bg-card w-1/2 border text-right font-mono text-[0.8em]"
                  />
                </li>
              </div>
            </div>
          )}

          {layoutConfig.library === "ElkJS" && (
            <>
              {/* GRAPH Section */}
              <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase gap-2">
                  Graph
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-2 text-xs h-auto"
                    onClick={() => resetSection("elk-graph")}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full text-sm list-none">
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-direction.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Direction
                      </a>
                    </span>
                    <Select
                      value={layoutConfig.direction}
                      onValueChange={(value) => updateLayoutConfig("direction", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DOWN">DOWN</SelectItem>
                        <SelectItem value="UP">UP</SelectItem>
                        <SelectItem value="LEFT">LEFT</SelectItem>
                        <SelectItem value="RIGHT">RIGHT</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-alignment.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Alignment
                      </a>
                    </span>
                    <Select
                      value={layoutConfig.alignment}
                      onValueChange={(value) => updateLayoutConfig("alignment", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AUTOMATIC">AUTOMATIC</SelectItem>
                        <SelectItem value="LEFT">LEFT</SelectItem>
                        <SelectItem value="RIGHT">RIGHT</SelectItem>
                        <SelectItem value="CENTER">CENTER</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-spacing-edgeEdge.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Edge Spacing
                      </a>
                    </span>
                    <Input
                      type="number"
                      value={layoutConfig.elkEdgeSpacing}
                      onChange={(e) => updateLayoutConfig("elkEdgeSpacing", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-spacing-nodeNode.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Node Spacing
                      </a>
                    </span>
                    <Input
                      type="number"
                      value={layoutConfig.elkNodeSpacing}
                      onChange={(e) => updateLayoutConfig("elkNodeSpacing", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-randomSeed.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Randomization Seed
                      </a>
                    </span>
                    <Input
                      type="number"
                      value={layoutConfig.randomizationSeed}
                      onChange={(e) => updateLayoutConfig("randomizationSeed", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                </div>
              </div>

              {/* NODE Section */}
              <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase gap-2">
                  Node
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-2 text-xs h-auto"
                    onClick={() => resetSection("elk-node")}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full text-sm list-none">
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-portConstraints.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Port Constraints
                      </a>
                    </span>
                    <Select
                      value={layoutConfig.portConstraints}
                      onValueChange={(value) => updateLayoutConfig("portConstraints", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNDEFINED">UNDEFINED</SelectItem>
                        <SelectItem value="FREE">FREE</SelectItem>
                        <SelectItem value="FIXED_SIDE">FIXED_SIDE</SelectItem>
                        <SelectItem value="FIXED_ORDER">FIXED_ORDER</SelectItem>
                        <SelectItem value="FIXED_RATIO">FIXED_RATIO</SelectItem>
                        <SelectItem value="FIXED_POS">FIXED_POS</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-hierarchyHandling.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Hierarchy Handling
                      </a>
                    </span>
                    <Select
                      value={layoutConfig.hierarchyHandling}
                      onValueChange={(value) => updateLayoutConfig("hierarchyHandling", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INHERIT">INHERIT</SelectItem>
                        <SelectItem value="INCLUDE_CHILDREN">INCLUDE_CHILDREN</SelectItem>
                        <SelectItem value="SEPARATE_CHILDREN">SEPARATE_CHILDREN</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                </div>
              </div>

              {/* SUB-GRAPH Section */}
              <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase gap-2">
                  Sub-Graph
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-2 text-xs h-auto"
                    onClick={() => resetSection("elk-subgraph")}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full text-sm list-none">
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-separateConnectedComponents.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Separate Components
                      </a>
                    </span>
                    <Checkbox
                      checked={layoutConfig.separateComponents}
                      onCheckedChange={(checked) => updateLayoutConfig("separateComponents", checked)}
                      className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-layered-compaction-connectedComponents.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Compaction
                      </a>
                    </span>
                    <Checkbox
                      checked={layoutConfig.compaction}
                      onCheckedChange={(checked) => updateLayoutConfig("compaction", checked)}
                      className="peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground my-1 ml-auto h-5 w-5 shrink-0 cursor-pointer rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-spacing-componentComponent.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Spacing
                      </a>
                    </span>
                    <Input
                      type="number"
                      value={layoutConfig.componentSpacing}
                      onChange={(e) => updateLayoutConfig("componentSpacing", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                </div>
              </div>

              {/* ALGORITHM OPTIONS Section */}
              <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase gap-2">
                  <a href="https://eclipse.dev/elk/reference/algorithms.html" target="_blank" rel="noopener noreferrer">
                    Algorithm Options
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-2 text-xs h-auto"
                    onClick={() => resetSection("elk-algorithm")}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full text-sm list-none">
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/algorithms.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Algorithm
                      </a>
                    </span>
                    <Select
                      value={layoutConfig.algorithm}
                      onValueChange={(value) => updateLayoutConfig("algorithm", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mrtree">mrtree</SelectItem>
                        <SelectItem value="layered">layered</SelectItem>
                        <SelectItem value="force">force</SelectItem>
                        <SelectItem value="stress">stress</SelectItem>
                        <SelectItem value="fixed">fixed</SelectItem>
                        <SelectItem value="box">box</SelectItem>
                        <SelectItem value="disco">disco</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                </div>
              </div>

              {/* MR. TREE OPTIONS Section */}
              <div className="relative flex w-full min-w-0 flex-col p-2 sidebar-group">
                <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 tracking-wide uppercase gap-2">
                  <a
                    href="https://eclipse.dev/elk/reference/algorithms/org-eclipse-elk-mrtree.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mr. Tree Options
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-2 text-xs h-auto"
                    onClick={() => resetSection("elk-mrtree")}
                  >
                    Reset
                  </Button>
                </div>
                <div className="w-full text-sm list-none">
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-mrtree-edgeRoutingMode.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Edge Routing Mode
                      </a>
                    </span>
                    <Select
                      value={layoutConfig.edgeRoutingMode}
                      onValueChange={(value) => updateLayoutConfig("edgeRoutingMode", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVOID_OVERLAP">AVOID_OVERLAP</SelectItem>
                        <SelectItem value="STRAIGHT">STRAIGHT</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-mrtree-edgeEndTextureLength.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Edge End Texture Length
                      </a>
                    </span>
                    <Input
                      type="number"
                      value={layoutConfig.edgeEndTextureLength}
                      onChange={(e) => updateLayoutConfig("edgeEndTextureLength", Number.parseInt(e.target.value))}
                      className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 h-8 text-sm ml-auto max-w-1/2 bg-card border font-mono"
                    />
                  </li>
                  <li className="group/menu-item relative flex items-center rounded-sm px-2 py-1 hover:[&_svg]:opacity-100 gap-1">
                    <span>
                      <a
                        href="https://eclipse.dev/elk/reference/options/org-eclipse-elk-mrtree-searchOrder.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-3/6 cursor-pointer text-xs underline"
                      >
                        Search Order
                      </a>
                    </span>
                    <Select
                      value={layoutConfig.searchOrder}
                      onValueChange={(value) => updateLayoutConfig("searchOrder", value)}
                    >
                      <SelectTrigger className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 bg-card ml-auto max-w-3/6 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DFS">DFS</SelectItem>
                        <SelectItem value="BFS">BFS</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  const renderExternalContent = () => {
    return (
      <div className="flex-1 overflow-auto">
        <div className="relative flex w-full min-w-0 flex-col p-2 px-0">
          {/* Header */}
          <div className="flex h-8 shrink-0 items-center rounded-md px-2 m-2 mb-0 text-sm font-bold tracking-wide text-black normal-case select-none">
            Share & Export
          </div>

          <div className="w-full text-sm">
            {/* SHARE Section */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium tracking-wide uppercase text-gray-600">
                SHARE
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-pink-500 text-white shadow-sm hover:bg-pink-600 h-9 px-4 py-2 m-2 text-xs"
                onClick={() => {
                  // TODO: Implement share functionality
                  console.log("[v0] Create shareable link clicked")
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Create Shareable Link
              </button>

              <p className="text-gray-500 mx-auto text-xs px-2">Changes require generating a new link</p>
            </div>

            {/* OPEN IN Section */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium tracking-wide uppercase text-gray-600">
                OPEN IN
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-gray-500 shadow-xs h-9 px-4 py-2 m-2 text-xs"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <title>CodeSandbox</title>
                  <path d="M0 24H24V0H0V2.45455H21.5455V21.5455H2.45455V0H0Z"></path>
                </svg>
                CodeSandbox
              </button>

              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-gray-100 text-gray-500 shadow-xs h-9 px-4 py-2 m-2 text-xs"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <title>StackBlitz</title>
                  <path d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z"></path>
                </svg>
                Stackblitz
              </button>

              <p className="text-gray-500 mx-auto my-2 text-xs">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFolderContent = () => {
    return (
      <div className="flex-1 overflow-auto">
        <div className="relative flex w-full min-w-0 flex-col p-2 px-0">
          <div className="flex h-8 shrink-0 items-center rounded-md px-2 m-2 mb-0 text-sm font-bold tracking-wide text-black normal-case select-none">
            Save & Load
          </div>
          <div className="w-full text-sm">
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium tracking-wide uppercase">
                PERSISTANCE
              </div>
              <div className="flex items-center p-2 align-middle">
                <CloudAlert className="text-gray-500 h-7 w-7" />
                <p className="text-gray-500 ml-3 text-xs">
                  These settings are stored only in your browser! Persistance is not guaranteed.
                </p>
              </div>
              <button
                onClick={handleSaveInBrowser}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors bg-pink-500 text-white shadow-sm hover:bg-pink-600 h-9 px-4 py-2 mx-2 mt-2 mb-4 w-[calc(100%-1rem)] text-xs"
              >
                <HardDriveDownload className="mr-2 -ml-4 h-4 w-4" />
                Save in Browser
              </button>
              <div className="h-px w-full bg-gray-200 my-2"></div>

              {saves.map((save) => (
                <div key={save.id}>
                  <div className="group/savelistitem flex w-full justify-between px-2 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-xs">{save.name}</div>
                      <p className="text-gray-500 text-[0.8em] select-none">{save.timestamp}</p>
                    </div>
                    <div className="ml-2 flex">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors hover:bg-gray-100 h-9 px-3 py-2 text-gray-500 text-xs opacity-0 group-hover/savelistitem:opacity-100">
                        <SquarePen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSave(save.id)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors hover:bg-gray-100 h-9 px-3 py-2 text-gray-500 text-xs opacity-0 group-hover/savelistitem:opacity-100"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleLoadSave(save.id)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 h-9 px-3 py-2 text-xs opacity-0 group-hover/savelistitem:opacity-100"
                      >
                        <HardDriveUpload className="h-4 w-4" />
                        <p>Load</p>
                      </button>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gray-200 my-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMessagesContent = () => {
    return (
      <div className="flex-1 overflow-auto">
        <div className="relative flex w-full min-w-0 flex-col p-2 px-0">
          <div className="ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 outline-hidden transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 m-2 mb-0 font-[NTDapper] text-sm font-bold tracking-wide text-black normal-case select-none">
            Feedback
          </div>
          <div className="w-full text-sm">
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <p className="text-muted-foreground/70 m-2 mt-1 text-xs">
                Thanks for testing the React Flow playground. Whether you encountered issues, have feature suggestions,
                or just want to tell us what you're building with React Flow, we'd love to hear from you.
              </p>
              <a
                href="https://wbkd.notion.site/1d5f46452242805994dbf593531e4bb9?pvs=105"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 mx-2 mt-2 mb-4 w-[calc(100%-var(--spacing)*4)] cursor-pointer text-xs hover:opacity-85">
                  <MessageSquareMore className="mr-2 -ml-4 h-4 w-4" />
                  Open Feedback Form
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "nodes-edges":
        return renderNodesEdgesContent()
      case "reactflow-props":
        return renderReactFlowPropsContent()
      case "layout":
        return renderLayoutContent()
      case "external":
        return renderExternalContent()
      case "folder":
        return renderFolderContent()
      case "messages":
        return renderMessagesContent()
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-sm">Menu: {activeMenu}</div>
              <div className="text-xs mt-1">Content coming soon...</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`group peer text-sidebar-foreground ${className}`}>
      <div
        className={`fixed inset-y-0 z-50 h-full w-80 transition-transform duration-300 ease-in-out flex border-r lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-sidebar flex h-full w-full flex-col">
          <div className="flex items-center justify-between p-2 border-b lg:hidden">
            <span className="text-sm font-medium">Menu</span>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
            <div className="flex h-full">
              <div className="h-full w-[51px] border-r bg-gray-100 flex-shrink-0">
                <div className="flex w-full min-w-0 flex-col p-2 h-full">
                  <div className="w-full text-sm px-0">
                    <ul className="flex w-full min-w-0 flex-col gap-1">
                      {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeMenu === item.id
                        return (
                          <li key={item.id} className="group/menu-item relative">
                            <button
                              onClick={() => setActiveMenu(item.id)}
                              className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden transition-[width,height,padding] focus-visible:ring-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm px-2.5 cursor-pointer ${
                                isActive ? "bg-primary text-white" : ""
                              }`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 overflow-hidden">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
