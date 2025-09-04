/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "../card"
import { Button } from "../button"
import { Input } from "../input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { Textarea } from "../textarea"
import { Plus, X, Eye, User, AlertCircle, LayoutGrid, Calendar } from "lucide-react"

interface Task {
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

interface ProjectRoadmapProps {
  tasks: Task[]
  onAddTask: (task: Omit<Task, "id">) => void
  onTaskClick: (task: Task) => void
  selectedTask: Task | null
  onUpdateTaskStatus: (taskId: string, newStatus: Task["status"]) => void
  showDetails?: boolean // Added optional prop to control details display
}

const categories = [
  "Deliver plug-and-play networks",
  "Exploit granular partnerships",
  "Innovate open-source architectures",
]

const kanbanColumns = [
  { id: "todo", title: "To Do", status: "todo" as const },
  { id: "planned", title: "Planned", status: "planned" as const },
  { id: "active", title: "Active", status: "active" as const },
  { id: "review", title: "Review", status: "review" as const },
]

export function ProjectRoadmap({
  tasks,
  onAddTask,
  onTaskClick,
  selectedTask,
  onUpdateTaskStatus,
  showDetails = true, // Default to true for backward compatibility
}: ProjectRoadmapProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [newTask, setNewTask] = useState({
    title: "",
    duration: "",
    status: "todo" as Task["status"],
    category: categories[0],
    description: "",
    assignee: "",
    priority: "medium" as "low" | "medium" | "high",
    startDate: new Date().toISOString().split("T")[0], // Default to today in YYYY-MM-DD format
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.title.trim() && newTask.duration.trim()) {
      const startDate = new Date(newTask.startDate)
      const durationMatch = newTask.duration.match(/(\d+)\s*(month|day|week)s?/i)
      const endDate = new Date(startDate)

      if (durationMatch) {
        const amount = Number.parseInt(durationMatch[1])
        const unit = durationMatch[2].toLowerCase()

        if (unit === "month") {
          endDate.setMonth(endDate.getMonth() + amount)
        } else if (unit === "week") {
          endDate.setDate(endDate.getDate() + amount * 7)
        } else if (unit === "day") {
          endDate.setDate(endDate.getDate() + amount)
        }
      }

      onAddTask({
        ...newTask,
        startDate,
        endDate,
      })
      setNewTask({
        title: "",
        duration: "",
        status: "todo",
        category: categories[0],
        description: "",
        assignee: "",
        priority: "medium",
        startDate: new Date().toISOString().split("T")[0], // Reset start date to today
      })
      setShowAddForm(false)
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-500"
      case "planned":
        return "bg-blue-500"
      case "active":
        return "bg-green-500"
      case "review":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")
    onUpdateTaskStatus(taskId, newStatus)
  }

  return (
    <div className="w-full">
      {/* Header with distributed content label */}
      <div className="flex justify-center mb-4">
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-xs font-medium">
          distributed content
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="flex-1"
        >
          List View
        </Button>
        <Button
          variant={viewMode === "kanban" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("kanban")}
          className="flex-1"
        >
          <LayoutGrid className="w-4 h-4 mr-1" />
          Kanban
        </Button>
      </div>

      <div className="mb-6">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full"
          variant={showAddForm ? "outline" : "default"}
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Mission
            </>
          )}
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Mission title"
                value={newTask.title}
                onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Textarea
                placeholder="Mission description"
                value={newTask.description}
                onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full"
                rows={3}
              />
            </div>
            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  value={newTask.startDate}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full pl-10"
                  placeholder="Start date"
                />
              </div>
            </div>
            <div>
              <Input
                placeholder="Duration (e.g., 6 months)"
                value={newTask.duration}
                onChange={(e) => setNewTask((prev) => ({ ...prev, duration: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Input
                placeholder="Assignee (e.g., Engineering Team)"
                value={newTask.assignee}
                onChange={(e) => setNewTask((prev) => ({ ...prev, assignee: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={newTask.category}
                onValueChange={(value) => setNewTask((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newTask.status}
                onValueChange={(value: Task["status"]) => setNewTask((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newTask.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setNewTask((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Add Mission
            </Button>
          </form>
        </Card>
      )}

      {viewMode === "list" ? (
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryTasks = tasks.filter((task) => task.category === category)

            return (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-gray-200 pb-1">{category}</h3>

                <div className="space-y-2">
                  {categoryTasks.map((task) => (
                    <Card
                      key={task.id}
                      className={`p-3 transition-all cursor-pointer ${
                        selectedTask?.id === task.id
                          ? "bg-blue-100 border-blue-300 shadow-md"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getStatusColor(task.status)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>
                            <Eye className="w-3 h-3 text-gray-400" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{task.duration}</span>
                            {task.priority && (
                              <>
                                <span>•</span>
                                <AlertCircle className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                              </>
                            )}
                          </div>
                          {task.assignee && (
                            <div className="flex items-center gap-1 mt-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-muted-foreground">{task.assignee}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {kanbanColumns.map((column) => (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg p-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(column.status)}`} />
                <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                <span className="text-xs text-muted-foreground">
                  ({tasks.filter((task) => task.status === column.status).length})
                </span>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status === column.status)
                  .map((task) => (
                    <Card
                      key={task.id}
                      className={`p-2 cursor-move transition-all hover:shadow-md ${
                        selectedTask?.id === task.id ? "bg-blue-100 border-blue-300" : "bg-white hover:bg-gray-50"
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground leading-tight mb-1">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{task.duration}</span>
                            {task.priority && <AlertCircle className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />}
                          </div>
                        </div>
                        <Eye className="w-3 h-3 text-gray-400" />
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
