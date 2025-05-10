import type { FC } from 'react';

interface AddonProps {
  name: string;
  id: string;
  description: string;
  installed: boolean;
  loading: boolean;
  onInstall: (id: string) => void;
}

export const AddonCard: FC<AddonProps> = ({ 
  name, 
  id, 
  description, 
  installed, 
  loading, 
  onInstall 
}: AddonProps) => {
  return (
    <div className="bg-white border dark:border-gray-700 dark:bg-gray-800 h-full hover:shadow-md p-6 rounded-lg shadow-sm transition-all">
      <div className="mb-4">
        <h3 className="dark:text-white font-medium text-gray-900 text-lg">{name}</h3>
        <p className="dark:text-gray-400 mt-1 text-gray-500 text-sm">{description}</p>
      </div>
      <div className="flex justify-end">
        <button
          className={`font-medium px-4 py-2 rounded-md text-sm transition-colors ${installed 
            ? 'bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 hover:bg-gray-200 text-gray-700' 
            : 'bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 hover:bg-blue-700 text-white'}`}
          disabled={installed || loading}
          onClick={() => onInstall(id)}
          type="button"
        >
          {installed
            ? 'Installed'
            : (loading ? 'Installing...' : 'Install')}
        </button>
      </div>
    </div>
  );
}
