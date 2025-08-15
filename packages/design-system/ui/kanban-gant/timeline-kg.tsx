/**
 * SPDX-License-Identifier: MIT
 */

"use client"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns"
import { useEffect, useRef, useState } from "react"

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

interface TimelineProps {
  tasks: Task[]
  selectedTask: Task | null
  onTaskClick: (task: Task) => void
}

export function Timeline({ tasks, selectedTask, onTaskClick }: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [centerMonthIndex, setCenterMonthIndex] = useState(12) // Start at month 12 (current month)
  const [isScrolling, setIsScrolling] = useState(false)

  const visibleMonthsCount = 25 // Show 25 months at a time
  const currentDate = new Date()
  const months = Array.from({ length: visibleMonthsCount }, (_, i) => {
    const monthOffset = i - Math.floor(visibleMonthsCount / 2) + centerMonthIndex - 12
    return addMonths(currentDate, monthOffset)
  })

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || isScrolling) return

      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth

      // Check if scrolled near the beginning (add months to the left)
      if (scrollLeft < clientWidth * 0.5) {
        setIsScrolling(true)
        setCenterMonthIndex((prev) => prev - 6)
        setTimeout(() => {
          if (container) {
            container.scrollLeft = scrollLeft + clientWidth * 0.5
          }
          setIsScrolling(false)
        }, 50)
      }
      // Check if scrolled near the end (add months to the right)
      else if (scrollLeft > scrollWidth - clientWidth * 1.5) {
        setIsScrolling(true)
        setCenterMonthIndex((prev) => prev + 6)
        setTimeout(() => {
          if (container) {
            container.scrollLeft = scrollLeft - clientWidth * 0.5
          }
          setIsScrolling(false)
        }, 50)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [isScrolling])

  useEffect(() => {
    if (scrollContainerRef.current && !isScrolling) {
      const container = scrollContainerRef.current
      const centerPosition = (container.scrollWidth - container.clientWidth) / 2
      container.scrollLeft = centerPosition
    }
  }, [months, isScrolling])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "planned":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
      case "review":
        return "bg-orange-500"
      default:
        return "bg-gray-400"
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-red-500"
      case "medium":
        return "border-yellow-500"
      case "low":
        return "border-green-500"
      default:
        return "border-gray-300"
    }
  }

  const calculateTaskPosition = (task: Task, startMonth: Date, endMonth: Date) => {
    if (!task.startDate || !task.endDate) return null

    const timelineStart = startOfMonth(months[0])
    const timelineEnd = endOfMonth(months[months.length - 1])

    // Check if task overlaps with visible timeline
    if (task.endDate < timelineStart || task.startDate > timelineEnd) {
      return null // Task is outside visible range
    }

    // Calculate total timeline width in days
    const totalTimelineDays = eachDayOfInterval({ start: timelineStart, end: timelineEnd }).length

    // Calculate task start position relative to timeline start
    const taskStart = task.startDate < timelineStart ? timelineStart : task.startDate
    const taskEnd = task.endDate > timelineEnd ? timelineEnd : task.endDate

    const daysFromTimelineStart = eachDayOfInterval({ start: timelineStart, end: taskStart }).length - 1
    const taskDurationDays = eachDayOfInterval({ start: taskStart, end: taskEnd }).length

    const leftPercent = Math.max(0, (daysFromTimelineStart / totalTimelineDays) * 100)
    const widthPercent = Math.min(100 - leftPercent, (taskDurationDays / totalTimelineDays) * 100)

    return { left: `${leftPercent}%`, width: `${widthPercent}%` }
  }

  const timelineStart = startOfMonth(months[0])
  const timelineEnd = endOfMonth(months[months.length - 1])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto" ref={scrollContainerRef}>
          <div className="min-w-[2000px]">
            {/* Month Headers */}
            <div className="flex mb-8">
              {months.map((month, index) => (
                <div key={`${centerMonthIndex}-${index}`} className="flex-1 text-center min-w-[83px]">
                  <h3 className="text-lg font-semibold text-gray-900">{format(month, "MMM")}</h3>
                </div>
              ))}
            </div>

            {/* Timeline Grid */}
            <div className="relative">
              {/* Month Grid Lines */}
              <div className="flex absolute inset-0 pointer-events-none">
                {months.map((_, index) => (
                  <div
                    key={`grid-${centerMonthIndex}-${index}`}
                    className="flex-1 border-r border-gray-200 last:border-r-0 min-w-[83px]"
                  />
                ))}
              </div>

              {/* Tasks */}
              <div className="space-y-4 py-4">
                {tasks.map((task, taskIndex) => {
                  const position = calculateTaskPosition(task, timelineStart, timelineEnd)
                  if (!position) return null

                  return (
                    <div key={task.id} className="relative h-12 flex items-center">
                      {/* Task Bar */}
                      <div
                        className={`absolute h-8 rounded-md cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${getStatusColor(
                          task.status,
                        )} ${getPriorityColor(task.priority)} ${
                          selectedTask?.id === task.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
                        }`}
                        style={position}
                        onClick={() => onTaskClick(task)}
                      >
                        <div className="px-3 py-1 h-full flex items-center">
                          <span className="text-white text-sm font-medium truncate">{task.title}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-600">To Do</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
