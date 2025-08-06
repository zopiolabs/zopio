/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { FC, ReactNode, useState } from 'react';
import { addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/design-system/ui/popover';
import { Calendar } from '@repo/design-system/ui/calendar';
import { Input } from '@repo/design-system/ui/input';
import { Label } from '@repo/design-system/ui/label';
import { Button } from '@repo/design-system/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/ui/select';
import { cn } from '@repo/design-system/lib/utils';
import { GanttFeature, GanttStatus } from './types';

export type TaskAddPopoverProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusId: string;
  statuses: GanttStatus[];
  onAddTask: (newTask: Omit<GanttFeature, 'id'>) => void;
};

export const TaskAddPopover: FC<TaskAddPopoverProps> = ({
  children,
  open,
  onOpenChange,
  statusId,
  statuses,
  onAddTask
}) => {
  const today = new Date();
  const [taskName, setTaskName] = useState('New Task');
  const [startDate, setStartDate] = useState<Date>(today);
  const [duration, setDuration] = useState('3');
  const [selectedStatus, setSelectedStatus] = useState(statusId);

  const handleAddTask = () => {
    const status = statuses.find(s => s.id === selectedStatus) || statuses[0];
    const endDate = addDays(startDate, parseInt(duration, 10));
    
    onAddTask({
      name: taskName,
      startAt: startDate,
      endAt: endDate,
      status
    });
    
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Add New Task</h4>
          
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center">
                      <div 
                        className="h-2 w-2 rounded-full mr-2" 
                        style={{ backgroundColor: status.color }} 
                      />
                      {status.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              className={cn(
                "rounded-md border",
              )}
              initialFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 7, 14, 30].map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} {days === 1 ? 'day' : 'days'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
