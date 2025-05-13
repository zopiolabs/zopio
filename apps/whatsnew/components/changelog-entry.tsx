import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

type ChangeType = 'feature' | 'fix' | 'improvement' | 'breaking';

interface Change {
  type: ChangeType;
  description: string;
}

interface ChangelogEntryProps {
  version: string;
  date: string;
  changes: Change[];
}

export function ChangelogEntry({ version, date, changes }: ChangelogEntryProps) {
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Version {version}</h2>
        <div className="flex items-center mt-2 md:mt-0 text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <time dateTime={date}>{date}</time>
        </div>
      </div>
      
      <div className="space-y-6">
        {changes.length > 0 ? (
          changes.map((change, index) => (
            <ChangeItem key={index} type={change.type} description={change.description} />
          ))
        ) : (
          <p className="text-gray-500 italic">No changes documented for this version.</p>
        )}
      </div>
    </div>
  );
}

interface ChangeItemProps {
  type: ChangeType;
  description: string;
}

function ChangeItem({ type, description }: ChangeItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 pt-1">
        <span className={cn(
          "inline-flex items-center justify-center rounded-full p-1",
          type === 'feature' && "bg-green-100",
          type === 'fix' && "bg-blue-100",
          type === 'improvement' && "bg-purple-100",
          type === 'breaking' && "bg-red-100"
        )}>
          <Tag className={cn(
            "h-4 w-4",
            type === 'feature' && "text-green-700",
            type === 'fix' && "text-blue-700",
            type === 'improvement' && "text-purple-700",
            type === 'breaking' && "text-red-700"
          )} />
        </span>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            type === 'feature' && "bg-green-100 text-green-800",
            type === 'fix' && "bg-blue-100 text-blue-800",
            type === 'improvement' && "bg-purple-100 text-purple-800",
            type === 'breaking' && "bg-red-100 text-red-800"
          )}>
            {type}
          </span>
        </div>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
}
