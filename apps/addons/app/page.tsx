// @ts-nocheck
/* eslint-disable */
// biome-disable-file lint/style/sort-classes

'use client';

// Import only the type from React, not the default import
import { useState } from 'react';
import { AddonCard } from './components/AddonCard';

import { addons } from './data/addons';

const AddonsHome = () => {
  const [installed, setInstalled] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const installAddon = async (id: string): Promise<void> => {
    setLoading(id);
    setError(null);

    try {
      const res = await fetch('/api/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addonId: id }),
      });

      const result = await res.json();
      if (result.success) {
        setInstalled((prev: string[]) => [...prev, id]);
      } else {
        throw new Error('Install failed');
      }
    } catch (_) {
      setError(`Failed to install ${id}`);
    } finally {
      setLoading(null);
    }
  };

  // Filter addons based on search term and active category
  const filteredAddons = addons.filter((addon) => {
    const matchesSearch = addon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         addon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || addon.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group addons by category
  const libraries = filteredAddons.filter((addon) => addon.category === 'library');
  const tools = filteredAddons.filter((addon) => addon.category === 'tool');

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
            <h1 className="mb-2 text-3xl font-bold">Zopio Addons</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage and install libraries and tools for your application</p>
          </div>
        
        <div className="md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search addons..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 md:w-64 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200 border-t dark:border-gray-700" />

      <div>
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="-mb-px flex flex-wrap font-medium text-center text-sm" role="tablist">
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block rounded-t-lg border-b-2 p-4 ${activeCategory === 'all' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
                onClick={() => setActiveCategory('all')}
                role="tab"
                type="button"
              >
                All
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block rounded-t-lg border-b-2 p-4 ${activeCategory === 'library' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
                onClick={() => setActiveCategory('library')}
                role="tab"
                type="button"
              >
                Libraries
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={`inline-block rounded-t-lg border-b-2 p-4 ${activeCategory === 'tool' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
                onClick={() => setActiveCategory('tool')}
                role="tab"
                type="button"
              >
                Tools
              </button>
            </li>
          </ul>
        </div>
        
        {/* Tab content */}
        <div className="tab-content">
          {/* All tab */}
          {activeCategory === 'all' && (
            <div className="space-y-8">
              {libraries.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Libraries</h2>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {libraries.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {libraries.map((addon) => (
                      <AddonCard
                        key={addon.id}
                        id={addon.id}
                        name={`${addon.name} v${addon.version}`}
                        description={addon.description}
                        installed={installed.includes(addon.id)}
                        loading={loading === addon.id}
                        onInstall={installAddon}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {tools.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Tools</h2>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {tools.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {tools.map((addon) => (
                      <AddonCard
                        key={addon.id}
                        id={addon.id}
                        name={`${addon.name} v${addon.version}`}
                        description={addon.description}
                        installed={installed.includes(addon.id)}
                        loading={loading === addon.id}
                        onInstall={installAddon}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {filteredAddons.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No addons found matching your search criteria</p>
                </div>
              )}
            </div>
          )}
          
          {/* Library tab */}
          {activeCategory === 'library' && (
            <div>
              {libraries.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {libraries.map((addon) => (
                    <AddonCard
                      key={addon.id}
                      id={addon.id}
                      name={`${addon.name} v${addon.version}`}
                      description={addon.description}
                      installed={installed.includes(addon.id)}
                      loading={loading === addon.id}
                      onInstall={installAddon}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No libraries found matching your search criteria</p>
                </div>
              )}
            </div>
          )}
          
          {/* Tool tab */}
          {activeCategory === 'tool' && (
            <div>
              {tools.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {tools.map((addon) => (
                    <AddonCard
                      key={addon.id}
                      id={addon.id}
                      name={`${addon.name} v${addon.version}`}
                      description={addon.description}
                      installed={installed.includes(addon.id)}
                      loading={loading === addon.id}
                      onInstall={installAddon}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No tools found matching your search criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-label="Error Icon"><title>Error icon</title>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                <p className="text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddonsHome;
