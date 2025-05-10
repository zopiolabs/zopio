'use client';

import { useState } from 'react';

const libraries = [
  { name: 'Friendlier Words', id: 'friendlier-words' },
  { name: 'Zustand', id: 'zustand' },
  { name: 'NUQS', id: 'nuqs' },
  { name: 'Tiptap', id: 'tiptap' },
  { name: 'react-pdf', id: 'react-pdf' },
  { name: 'pdf-lib', id: 'pdf-lib' },
];

const tools = [
  { name: 'Metabase', id: 'metabase' },
  { name: 'Dub', id: 'dub' },
];

export default function AddonsHome() {
  const [installed, setInstalled] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const installAddon = async (id: string) => {
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
        setInstalled((prev) => [...prev, id]);
      } else {
        throw new Error('Install failed');
      }
    } catch (err) {
      setError(`Failed to install ${id}`);
    } finally {
      setLoading(null);
    }
  };

  const renderList = (title: string, list: { name: string; id: string }[]) => (
    <div>
      <h2 className="mb-2 font-semibold text-xl">{title}</h2>
      <ul className="space-y-2">
        {list.map((addon) => (
          <li
            key={addon.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <span>{addon.name}</span>
            <button
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:bg-gray-400"
              disabled={installed.includes(addon.id) || loading === addon.id}
              onClick={() => installAddon(addon.id)}
            >
              {installed.includes(addon.id)
                ? 'Installed'
                : loading === addon.id
                  ? 'Installing...'
                  : 'Install'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">Addons</h1>
      <p className="text-muted-foreground">
        Manage and install libraries and tools for your app.
      </p>
      {renderList('Libraries', libraries)}
      {renderList('Tools', tools)}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
