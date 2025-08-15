/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import { useState } from "react"
import { Header } from "./header-kg"
import { Button } from "../button"
import { Edit, Save, X, XIcon } from "lucide-react"
import { ProjectRoadmap } from "./project-roadmap"
import { Calendar } from "./calendar-kg"
import { Timeline } from "./timeline-kg"
import { Badge } from "../badge"
import { Input } from "../input"
import { Textarea } from "../textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"


export interface Task {
  id: string
  title: string
  duration: string
  status: "active" | "planned" | "todo" | "review"
  category: string
  description?: string
  startDate?: Date
  endDate?: Date
  assignee?: string
  priority?: "low" | "medium" | "high"
}

interface KanbanGanttProps {
  initialTasks?: Task[]
  defaultViewMode?: "calendar" | "timeline"
  defaultSidebarOpen?: boolean
  className?: string
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Expedite magnetic infrastructures",
    duration: "9 months",
    status: "active",
    category: "Deliver plug-and-play networks",
    description: "Develop and deploy high-performance magnetic infrastructure systems",
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2025, 0, 31),
    assignee: "Engineering Team",
    priority: "high",
  },
  {
    id: "2",
    title: "Extend virtual platforms",
    duration: "8 months",
    status: "planned",
    category: "Deliver plug-and-play networks",
    description: "Expand virtual platform capabilities and integrations",
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2025, 0, 31),
    assignee: "Platform Team",
    priority: "medium",
  },
  {
    id: "3",
    title: "Evolve sticky e-commerce",
    duration: "7 months",
    status: "review",
    category: "Deliver plug-and-play networks",
    description: "Transform e-commerce platform with enhanced user engagement",
    startDate: new Date(2024, 4, 15),
    endDate: new Date(2024, 11, 15),
    assignee: "Commerce Team",
    priority: "high",
  },
  {
    id: "4",
    title: "Embrace decentralized solutions",
    duration: "8 months",
    status: "todo",
    category: "Exploit granular partnerships",
    description: "Implement decentralized architecture and blockchain solutions",
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2025, 1, 28),
    assignee: "Blockchain Team",
    priority: "medium",
  },
  {
    id: "5",
    title: "Monetize rich schemas",
    duration: "3 months",
    status: "planned",
    category: "Exploit granular partnerships",
    description: "Develop monetization strategies for data schema products",
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 8, 30),
    assignee: "Business Team",
    priority: "low",
  },
  {
    id: "6",
    title: "Generate revolutionary blockchains",
    duration: "10 months",
    status: "active",
    category: "Innovate open-source architectures",
    description: "Create next-generation blockchain technology and protocols",
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2025, 2, 31),
    assignee: "Research Team",
    priority: "high",
  },
]

export function KanbanGantt({
  initialTasks = defaultTasks,
  defaultViewMode = "calendar",
  defaultSidebarOpen = true,
  className = "",
}: KanbanGanttProps) {
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">(defaultViewMode)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const addTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    }
    setTasks((prev) => [...prev, task])
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, ...updatedTask } : null))
    }
  }

  const handleEditTask = () => {
    if (selectedTask) {
      setEditingTask({ ...selectedTask })
      setIsEditing(true)
    }
  }

  const handleSaveTask = () => {
    if (editingTask) {
      updateTask(editingTask.id, editingTask)
      setIsEditing(false)
      setEditingTask(null)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingTask(null)
  }

  const updateEditingTask = (field: keyof Task, value: any) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, [field]: value })
    }
  }

  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 pt-20">
        <div
          className={`fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-foreground mb-1">Project Roadmap</h1>
              <p className="text-sm text-muted-foreground">Track project milestones</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6 h-full overflow-y-auto">
            <ProjectRoadmap
              tasks={tasks}
              onAddTask={addTask}
              onTaskClick={setSelectedTask}
              selectedTask={selectedTask}
              onUpdateTaskStatus={updateTaskStatus}
              showDetails={false}
            />
          </div>
        </div>

        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-80" : "ml-0"} ${selectedTask ? "mr-80" : "mr-0"}`}
        >
          {viewMode === "calendar" ? (
            <Calendar
              tasks={tasks}
              selectedTask={selectedTask}
              onTaskClick={setSelectedTask}
              selectedDate={selectedDate}
              onDateClick={setSelectedDate}
            />
          ) : (
            <Timeline tasks={tasks} selectedTask={selectedTask} onTaskClick={setSelectedTask} />
          )}
        </div>

        {selectedTask && (
          <div className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 bg-white border-l border-gray-200 z-40 shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Mission Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)} className="hover:bg-gray-100">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        selectedTask.status === "active"
                          ? "bg-green-500"
                          : selectedTask.status === "planned"
                            ? "bg-blue-500"
                            : selectedTask.status === "review"
                              ? "bg-orange-500"
                              : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{selectedTask.title}</h3>
                      {selectedTask.priority && (
                        <Badge
                          variant={
                            selectedTask.priority === "high"
                              ? "destructive"
                              : selectedTask.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="mb-3"
                        >
                          {selectedTask.priority} priority
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                    <p className="text-sm">{selectedTask.description || "No description available"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                      <p className="text-sm font-medium">{selectedTask.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                      <p className="text-sm font-medium capitalize">{selectedTask.status}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Assignee</h4>
                    <p className="text-sm font-medium">{selectedTask.assignee || "Unassigned"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Timeline</h4>
                    <p className="text-sm font-medium">
                      {selectedTask.startDate?.toLocaleDateString()} - {selectedTask.endDate?.toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                    <p className="text-sm font-medium">{selectedTask.category}</p>
                  </div>

                  <Button onClick={handleEditTask} className="w-full mt-6">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Mission
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={editingTask?.title || ""}
                      onChange={(e) => updateEditingTask("title", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={editingTask?.description || ""}
                      onChange={(e) => updateEditingTask("description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Input
                      value={editingTask?.duration || ""}
                      onChange={(e) => updateEditingTask("duration", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={editingTask?.status} onValueChange={(value) => updateEditingTask("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select
                      value={editingTask?.priority}
                      onValueChange={(value) => updateEditingTask("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Assignee</label>
                    <Input
                      value={editingTask?.assignee || ""}
                      onChange={(e) => updateEditingTask("assignee", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Input
                      value={editingTask?.category || ""}
                      onChange={(e) => updateEditingTask("category", e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveTask} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} className="flex-1 bg-transparent">
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
