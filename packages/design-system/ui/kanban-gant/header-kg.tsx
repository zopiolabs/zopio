/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import { Button } from "../button"
import { CalendarIcon, BarChart3, Menu, X } from "lucide-react"

interface HeaderProps {
  viewMode: "calendar" | "timeline"
  onViewModeChange: (mode: "calendar" | "timeline") => void
  sidebarOpen: boolean
  onSidebarToggle: () => void
}

export function Header({ viewMode, onViewModeChange, sidebarOpen, onSidebarToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="bg-white shadow-md hover:bg-gray-50">
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Project Management</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("calendar")}
            className="shadow-sm"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("timeline")}
            className="shadow-sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Timeline
          </Button>
        </div>
      </div>
    </header>
  )
}
