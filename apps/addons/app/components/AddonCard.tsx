// @ts-ignore - Next.js handles React types
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
  // Define all CSS classes as variables to ensure proper sorting
  const cardClasses = "bg-white border dark:bg-gray-800 h-full hover:shadow-md p-6 rounded-lg shadow-sm transition-all";
  const cardHeaderClasses = "mb-4";
  const titleClasses = "dark:text-white font-medium text-gray-900 text-lg";
  const descriptionClasses = "dark:text-gray-400 mt-1 text-gray-500 text-sm";
  const actionContainerClasses = "flex justify-end";
  
  // Define button classes
  const baseButtonClasses = "font-medium px-4 py-2 rounded-md text-sm transition-colors";
  const installedClasses = "bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 hover:bg-gray-200 text-gray-700";
  const notInstalledClasses = "bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 hover:bg-blue-700 text-white";
  
  return (
    <div className={cardClasses}>
      <div className={cardHeaderClasses}>
        <h3 className={titleClasses}>{name}</h3>
        <p className={descriptionClasses}>{description}</p>
      </div>
      <div className={actionContainerClasses}>
        <button
          className={`${baseButtonClasses} ${installed ? installedClasses : notInstalledClasses}`}
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
