/**
 * SPDX-License-Identifier: MIT
 */

import React, { FC, useState, useEffect } from 'react';
import { GanttFeature } from './types';

export interface GanttEditFeatureModalProps {
  feature: GanttFeature | null;
  onClose: () => void;
  onSave: (feature: GanttFeature) => void;
}

export const GanttEditFeatureModal: FC<GanttEditFeatureModalProps> = ({
  feature,
  onClose,
  onSave,
}) => {
  const [editedFeature, setEditedFeature] = useState<GanttFeature | null>(null);

  useEffect(() => {
    if (feature) {
      setEditedFeature({ ...feature });
    }
  }, [feature]);

  if (!feature || !editedFeature) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedFeature) {
      onSave(editedFeature);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedFeature(prev => prev ? { ...prev, name: e.target.value } : null);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedFeature(prev => prev ? { ...prev, startAt: new Date(e.target.value) } : null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value ? new Date(e.target.value) : null;
    setEditedFeature(prev => prev ? { ...prev, endAt: endDate } : null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statusName = e.target.value;
    // Map status name to color
    const colorMap: Record<string, string> = {
      'Completed': '#10b981',
      'In Progress': '#f59e0b',
      'Planned': '#3b82f6',
      'Not Started': '#94a3b8',
    };

    setEditedFeature(prev => 
      prev ? { 
        ...prev, 
        status: { 
          ...prev.status, 
          name: statusName,
          color: colorMap[statusName] || prev.status.color
        } 
      } : null
    );
  };

  // Format dates for input
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="task-name">
              Task Name
            </label>
            <input
              id="task-name"
              type="text"
              className="w-full border rounded p-2"
              value={editedFeature.name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="start-date">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              className="w-full border rounded p-2"
              value={formatDateForInput(editedFeature.startAt)}
              onChange={handleStartDateChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="end-date">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              className="w-full border rounded p-2"
              value={formatDateForInput(editedFeature.endAt)}
              onChange={handleEndDateChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="w-full border rounded p-2"
              value={editedFeature.status.name}
              onChange={handleStatusChange}
            >
              <option value="Not Started">Not Started</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
