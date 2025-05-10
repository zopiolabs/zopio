export interface Addon {
  id: string;
  name: string;
  description: string;
  category: 'library' | 'tool';
  version: string;
}

export const addons: Addon[] = [
  {
    id: 'friendlier-words',
    name: 'Friendlier Words',
    description: 'A library for generating friendly and memorable word combinations',
    category: 'library',
    version: '1.2.0',
  },
  {
    id: 'zustand',
    name: 'Zustand',
    description: 'A small, fast and scalable state management solution',
    category: 'library',
    version: '4.5.0',
  },
  {
    id: 'nuqs',
    name: 'NUQS',
    description: 'Next.js URL Query State - Sync state to URL query parameters',
    category: 'library',
    version: '2.3.0',
  },
  {
    id: 'tiptap',
    name: 'Tiptap',
    description: 'Headless rich text editor framework for modern web applications',
    category: 'library',
    version: '2.2.0',
  },
  {
    id: 'react-pdf',
    name: 'React PDF',
    description: 'Display PDFs in your React application',
    category: 'library',
    version: '7.7.0',
  },
  {
    id: 'pdf-lib',
    name: 'PDF-Lib',
    description: 'Create and modify PDF documents in any JavaScript environment',
    category: 'library',
    version: '1.20.0',
  },
  {
    id: 'metabase',
    name: 'Metabase',
    description: 'Business intelligence, dashboards, and data visualization tool',
    category: 'tool',
    version: '0.47.0',
  },
  {
    id: 'dub',
    name: 'Dub',
    description: 'Open-source link management tool for modern marketing teams',
    category: 'tool',
    version: '1.5.0',
  },
];
