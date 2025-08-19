"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@repo/design-system/ui/button"

interface CalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())

  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağu",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of the month and how many days in the month
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Get previous month's last days
  const prevMonth = new Date(year, month - 1, 0)
  const daysInPrevMonth = prevMonth.getDate()

  // Generate calendar days
  const calendarDays = []

  // Previous month's days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    })
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false,
      date: new Date(year, month, day),
    })
  }

  // Next month's days to fill the grid
  const remainingCells = 42 - calendarDays.length
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPrevMonth: false,
      date: new Date(year, month + 1, day),
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(month - 1)
    } else {
      newDate.setMonth(month + 1)
    }
    setCurrentDate(newDate)
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-fit">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-gray-50 border-gray-200 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium"
          >
            {months[month]}
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            className="bg-gray-50 border-gray-200 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium"
          >
            {year}
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.slice(0, 42).map((calendarDay, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(calendarDay.date)}
            className={`
              w-10 h-10 text-sm rounded-lg transition-colors hover:bg-gray-100
              ${calendarDay.isCurrentMonth ? "text-gray-900 font-medium" : "text-gray-400"}
              ${isSelected(calendarDay.date) ? "bg-gray-900 text-white hover:bg-gray-800" : ""}
            `}
          >
            {calendarDay.day}
          </button>
        ))}
      </div>
    </div>
  )
}
