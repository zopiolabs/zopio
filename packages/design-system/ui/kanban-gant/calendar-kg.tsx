/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import { Plus } from "lucide-react"
import { Card } from "../card"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { Badge } from "../badge"
import { Button } from "../button"

interface Task {
  id: string
  title: string
  duration: string
  status: "active" | "planned" | "todo" | "review" // Updated status types
  category: string
  description?: string
  startDate?: Date
  endDate?: Date
  assignee?: string
  priority?: "low" | "medium" | "high"
}

interface CalendarProps {
  tasks: Task[]
  selectedTask: Task | null
  onTaskClick: (task: Task | null) => void
  selectedDate: Date | null // Added selectedDate prop
  onDateClick: (date: Date | null) => void // Added onDateClick prop
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = ["May", "June", "July", "August", "September", "October"]

// Generate calendar days for multiple months
const generateCalendarDays = (month: number, year = 2024) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return days
}

export function Calendar({ tasks, selectedTask, onTaskClick, selectedDate, onDateClick }: CalendarProps) {
  const currentDate = new Date()
  const currentMonth = 4 // May (0-indexed)

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.startDate || !task.endDate) return false
      const taskStart = new Date(task.startDate)
      const taskEnd = new Date(task.endDate)
      return date >= taskStart && date <= taskEnd
    })
  }

  const hasTasksOnDate = (date: Date) => {
    return getTasksForDate(date).length > 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-400"
      case "planned":
        return "bg-blue-400"
      case "active":
        return "bg-green-400"
      case "review":
        return "bg-orange-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="h-full bg-gray-50 p-6 flex">
      <div className="flex-1">
        {/* Calendar Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Calendar View</h2>
          <p className="text-muted-foreground">Project timeline and scheduling</p>
        </div>

        {/* Multiple Month View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {months.slice(0, 6).map((monthName, index) => {
            const monthIndex = currentMonth + index
            const days = generateCalendarDays(monthIndex)

            return (
              <Card key={monthName} className="p-4 bg-white">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-center text-foreground">{monthName} 2024</h3>
                </div>

                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, dayIndex) => {
                    if (!day) return <div key={dayIndex} />

                    const date = new Date(2024, monthIndex, day)
                    const isToday = day === currentDate.getDate() && monthIndex === currentDate.getMonth()
                    const dayTasks = getTasksForDate(date)
                    const hasTasks = dayTasks.length > 0

                    return (
                      <div key={dayIndex}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              className={`
                                min-h-[40px] p-2 text-sm rounded-md border cursor-pointer hover:bg-gray-100 transition-colors relative
                                ${isToday ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600" : "bg-white border-gray-200"}
                              `}
                              onClick={() => onDateClick(date)}
                            >
                              <div className={`text-center ${isToday ? "text-white" : "text-foreground"}`}>{day}</div>
                              {hasTasks && (
                                <div className="flex gap-1 justify-center mt-1">
                                  {dayTasks.slice(0, 3).map((task, idx) => (
                                    <div
                                      key={idx}
                                      className={`w-1.5 h-1.5 rounded-full ${getStatusColor(task.status)}`}
                                    />
                                  ))}
                                  {dayTasks.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                                </div>
                              )}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="start">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-foreground">
                                  {date.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </h4>
                              </div>

                              {dayTasks.length > 0 ? (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-foreground">Active Tasks:</p>
                                  {dayTasks.map((task) => (
                                    <div
                                      key={task.id}
                                      className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                                      onClick={() => onTaskClick(task)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                                          <p className="text-xs text-muted-foreground">{task.duration}</p>
                                          {task.priority && (
                                            <Badge
                                              variant="outline"
                                              className={`${getPriorityColor(task.priority)} text-xs mt-1`}
                                            >
                                              {task.priority}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">No tasks scheduled for this day</div>
                              )}

                              <Button size="sm" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Task for This Day
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
