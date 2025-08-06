/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@repo/design-system/ui/calendar';
import { Input } from '@repo/design-system/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/design-system/ui/popover';
import { Label } from '@repo/design-system/ui/label';
import { Button } from '@repo/design-system/ui/button';
import { CalendarIcon } from 'lucide-react';
import { GanttFeature } from './types';

export interface TaskPopoverProps {
  feature: GanttFeature;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpdate?: (updatedFeature: GanttFeature) => void;
}

export const TaskPopover: FC<TaskPopoverProps> = ({
  feature,
  children,
  open,
  onOpenChange,
  onUpdate,
}) => {
  // Local state for task editing
  const [name, setName] = useState(feature.name);
  const [startDate, setStartDate] = useState<Date>(feature.startAt);
  const [endDate, setEndDate] = useState<Date | null>(feature.endAt);
  
  // Sync with external state immediately when feature changes
  useEffect(() => {
    setName(feature.name);
    setStartDate(feature.startAt);
    setEndDate(feature.endAt);
  }, [feature.id, feature.name, feature.startAt, feature.endAt]);

  // Handle field updates (now just updates local state without propagating)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
  };
  
  // Handle explicit update button click
  const handleUpdate = () => {
    if (onUpdate) {
      // Create the updated feature object
      const updatedFeature = {
        ...feature,
        name,
        startAt: startDate,
        endAt: endDate
      };
      
      // Update both sidebar and timetable by passing the complete updated feature
      onUpdate(updatedFeature);
      
      // Close the popover after updating
      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setStartDate(date);
    
    // If the end date exists and is before the new start date, adjust it
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) {
      setEndDate(null);
      return;
    }
    
    // Don't allow end date to be before start date
    if (date < startDate) {
      return;
    }
    
    setEndDate(date);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Task Details</h4>
            <div className="h-1 w-8 rounded-full" style={{ backgroundColor: feature.status.color }} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input 
              id="task-name" 
              value={name} 
              onChange={handleNameChange} 
              placeholder="Enter task name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    id="start-date"
                    variant="outline" 
                    className="flex-1 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'MMM dd, yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end-date">End Date</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    id="end-date"
                    variant="outline" 
                    className="flex-1 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'MMM dd, yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate || undefined}
                    onSelect={handleEndDateChange}
                    initialFocus
                    disabled={(date) => date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              className="bg-primary hover:bg-primary/90"
            >
              Update
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
