/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Calendar, Download, Filter, Plus, Settings } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Kanban,
  KanbanBoard,
  type KanbanCardType,
  KanbanControls,
  type KanbanData,
  KanbanHeader,
  useKanban,
} from '@repo/design-system/ui/kanban';

/**
 * A Kanban board component for visualizing and managing tasks across different stages with drag-and-drop functionality.
 */
const meta: Meta<typeof Kanban> = {
  title: 'ui/Kanban',
  component: Kanban,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'ghost', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Read-only mode',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample Kanban data
const sampleKanbanData: KanbanData = {
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      color: '#64748b',
      cards: [
        {
          id: '1',
          title: 'User Authentication System',
          description:
            'Implement login, signup, and password reset functionality',
          priority: 'high',
          assignee: 'John Doe',
          tags: ['backend', 'security'],
          dueDate: new Date('2024-02-15'),
        },
        {
          id: '2',
          title: 'Dashboard Analytics',
          description:
            'Create comprehensive analytics dashboard with charts and metrics',
          priority: 'medium',
          assignee: 'Jane Smith',
          tags: ['frontend', 'analytics'],
        },
        {
          id: '3',
          title: 'Mobile Responsive Design',
          description: 'Ensure all pages work perfectly on mobile devices',
          priority: 'low',
          tags: ['frontend', 'mobile'],
        },
      ],
    },
    {
      id: 'todo',
      title: 'To Do',
      color: '#f59e0b',
      limit: 5,
      cards: [
        {
          id: '4',
          title: 'API Documentation',
          description:
            'Write comprehensive API documentation for all endpoints',
          priority: 'medium',
          assignee: 'Mike Johnson',
          tags: ['documentation'],
          dueDate: new Date('2024-02-10'),
        },
        {
          id: '5',
          title: 'Unit Tests',
          description: 'Write unit tests for core business logic',
          priority: 'high',
          assignee: 'Sarah Wilson',
          tags: ['testing'],
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#3b82f6',
      limit: 3,
      cards: [
        {
          id: '6',
          title: 'Database Migration',
          description: 'Migrate from SQLite to PostgreSQL',
          priority: 'high',
          assignee: 'John Doe',
          tags: ['backend', 'database'],
          color: '#ef4444',
        },
        {
          id: '7',
          title: 'Payment Integration',
          description: 'Integrate Stripe payment processing',
          priority: 'medium',
          assignee: 'Jane Smith',
          tags: ['backend', 'payments'],
          color: '#10b981',
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      color: '#8b5cf6',
      cards: [
        {
          id: '8',
          title: 'Code Review Guidelines',
          description: 'Establish code review process and guidelines',
          priority: 'low',
          assignee: 'Mike Johnson',
          tags: ['process'],
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: '#10b981',
      cards: [
        {
          id: '9',
          title: 'Project Setup',
          description: 'Initial project setup with build tools and CI/CD',
          priority: 'high',
          assignee: 'Sarah Wilson',
          tags: ['setup', 'devops'],
        },
        {
          id: '10',
          title: 'Design System',
          description: 'Create comprehensive design system with components',
          priority: 'medium',
          assignee: 'Jane Smith',
          tags: ['design', 'frontend'],
        },
      ],
    },
  ],
};

const simpleKanbanData: KanbanData = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
        { id: '3', title: 'Task 3' },
      ],
    },
    {
      id: 'doing',
      title: 'Doing',
      cards: [{ id: '4', title: 'Task 4' }],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        { id: '5', title: 'Task 5' },
        { id: '6', title: 'Task 6' },
      ],
    },
  ],
};

/**
 * Basic Kanban board with default settings.
 */
export const Default: Story = {
  render: () => (
    <div className="h-96 w-full">
      <Kanban data={sampleKanbanData}>
        <KanbanBoard />
      </Kanban>
    </div>
  ),
};

/**
 * Different visual variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <div className="h-64 w-full">
          <Kanban variant="default" data={simpleKanbanData}>
            <KanbanBoard />
          </Kanban>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <div className="h-64 w-full">
          <Kanban variant="ghost" data={simpleKanbanData}>
            <KanbanBoard />
          </Kanban>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <div className="h-64 w-full">
          <Kanban variant="outline" data={simpleKanbanData}>
            <KanbanBoard />
          </Kanban>
        </div>
      </div>
    </div>
  ),
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <div className="h-48 w-full">
          <Kanban size="sm" data={simpleKanbanData}>
            <KanbanBoard />
          </Kanban>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <div className="h-56 w-full">
          <Kanban size="md" data={simpleKanbanData}>
            <KanbanBoard />
          </Kanban>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <div className="h-64 w-full">
          <Kanban size="lg" data={simpleKanbanData}>
            <KanbanBoard />
          </Kanban>
        </div>
      </div>
    </div>
  ),
};

/**
 * Read-only Kanban board.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className="h-96 w-full">
      <Kanban data={sampleKanbanData} readonly>
        <KanbanHeader>
          <h3 className="font-semibold">Project Status (Read-Only)</h3>
          <div className="text-muted-foreground text-sm">View-only mode</div>
        </KanbanHeader>
        <KanbanBoard />
      </Kanban>
    </div>
  ),
};

/**
 * Simple Kanban with minimal data.
 */
export const Simple: Story = {
  render: () => (
    <div className="h-64 w-full">
      <Kanban data={simpleKanbanData}>
        <KanbanBoard />
      </Kanban>
    </div>
  ),
};

/**
 * Software development workflow.
 */
export const SoftwareDevelopment: Story = {
  render: () => {
    const [kanbanData, setKanbanData] = useState<KanbanData>(sampleKanbanData);

    const handleCardMove = (
      _cardId: string,
      _sourceColumnId: string,
      _destinationColumnId: string,
      _destinationIndex: number
    ) => {
      // TODO: Implement card move logic for Storybook demo
      // For now, this is a placeholder function for the demo
    };

    const handleCardAdd = (
      columnId: string,
      card: Omit<KanbanCardType, 'id'>
    ) => {
      const newCard = {
        ...card,
        id: Date.now().toString(),
      };

      setKanbanData((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
        ),
      }));
    };

    return (
      <div className="h-96 w-full">
        <Kanban
          data={kanbanData}
          onCardMove={handleCardMove}
          onCardAdd={handleCardAdd}
        >
          <KanbanHeader>
            <div>
              <h3 className="font-semibold text-lg">
                Web Application Development
              </h3>
              <p className="text-muted-foreground text-sm">
                Sprint 1 - February 2024
              </p>
            </div>
            <KanbanControls>
              <Button className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
              <Button className="flex items-center gap-2 rounded border px-4 py-2 font-medium text-sm hover:bg-muted">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </KanbanControls>
          </KanbanHeader>
          <KanbanBoard />
        </Kanban>
      </div>
    );
  },
};

/**
 * Bug tracking workflow.
 */
export const BugTracking: Story = {
  render: () => {
    const bugTrackingData: KanbanData = {
      columns: [
        {
          id: 'reported',
          title: 'Reported',
          color: '#ef4444',
          cards: [
            {
              id: 'bug-1',
              title: 'Login form validation error',
              description: 'Email validation not working properly on Safari',
              priority: 'high',
              assignee: 'John Doe',
              tags: ['frontend', 'safari', 'validation'],
              dueDate: new Date('2024-02-08'),
            },
            {
              id: 'bug-2',
              title: 'Dashboard loading slowly',
              description:
                'Dashboard takes 10+ seconds to load with large datasets',
              priority: 'medium',
              assignee: 'Jane Smith',
              tags: ['performance', 'backend'],
            },
          ],
        },
        {
          id: 'investigating',
          title: 'Investigating',
          color: '#f59e0b',
          cards: [
            {
              id: 'bug-3',
              title: 'Memory leak in data processing',
              description: 'Application crashes after processing large files',
              priority: 'high',
              assignee: 'Mike Johnson',
              tags: ['memory', 'backend'],
            },
          ],
        },
        {
          id: 'fixing',
          title: 'Fixing',
          color: '#3b82f6',
          cards: [
            {
              id: 'bug-4',
              title: 'Mobile menu not responsive',
              description: 'Navigation menu overlaps content on mobile devices',
              priority: 'medium',
              assignee: 'Sarah Wilson',
              tags: ['mobile', 'css'],
            },
          ],
        },
        {
          id: 'testing',
          title: 'Testing',
          color: '#8b5cf6',
          cards: [
            {
              id: 'bug-5',
              title: 'Search functionality broken',
              description: 'Search returns no results for valid queries',
              priority: 'high',
              assignee: 'John Doe',
              tags: ['search', 'backend'],
            },
          ],
        },
        {
          id: 'resolved',
          title: 'Resolved',
          color: '#10b981',
          cards: [
            {
              id: 'bug-6',
              title: 'Image upload size limit',
              description: 'Users unable to upload images larger than 1MB',
              priority: 'low',
              assignee: 'Jane Smith',
              tags: ['upload', 'backend'],
            },
          ],
        },
      ],
    };

    return (
      <div className="h-96 w-full">
        <Kanban data={bugTrackingData}>
          <KanbanHeader>
            <div>
              <h3 className="font-semibold">Bug Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Active issues and resolutions
              </p>
            </div>
            <KanbanControls>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-red-500" />
                  High Priority
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-yellow-500" />
                  Medium Priority
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-500" />
                  Low Priority
                </div>
              </div>
            </KanbanControls>
          </KanbanHeader>
          <KanbanBoard />
        </Kanban>
      </div>
    );
  },
};

/**
 * Content creation workflow.
 */
export const ContentCreation: Story = {
  render: () => {
    const contentData: KanbanData = {
      columns: [
        {
          id: 'ideas',
          title: 'Ideas',
          color: '#64748b',
          cards: [
            {
              id: 'content-1',
              title: 'React Performance Tips',
              description: 'Blog post about optimizing React applications',
              assignee: 'Content Team',
              tags: ['blog', 'react', 'performance'],
            },
            {
              id: 'content-2',
              title: 'API Design Best Practices',
              description: 'Comprehensive guide on REST API design',
              assignee: 'Tech Writer',
              tags: ['guide', 'api', 'backend'],
            },
          ],
        },
        {
          id: 'research',
          title: 'Research',
          color: '#f59e0b',
          cards: [
            {
              id: 'content-3',
              title: 'TypeScript Migration Guide',
              description:
                'Step-by-step guide for migrating JavaScript to TypeScript',
              assignee: 'Senior Developer',
              tags: ['tutorial', 'typescript'],
              dueDate: new Date('2024-02-20'),
            },
          ],
        },
        {
          id: 'writing',
          title: 'Writing',
          color: '#3b82f6',
          cards: [
            {
              id: 'content-4',
              title: 'Database Optimization Techniques',
              description:
                'Advanced techniques for database performance tuning',
              assignee: 'Database Expert',
              tags: ['database', 'optimization'],
            },
          ],
        },
        {
          id: 'review',
          title: 'Review',
          color: '#8b5cf6',
          cards: [
            {
              id: 'content-5',
              title: 'CSS Grid vs Flexbox',
              description: 'Comparison guide for modern CSS layout methods',
              assignee: 'Frontend Lead',
              tags: ['css', 'layout', 'comparison'],
            },
          ],
        },
        {
          id: 'published',
          title: 'Published',
          color: '#10b981',
          cards: [
            {
              id: 'content-6',
              title: 'Getting Started with Next.js',
              description:
                'Beginner-friendly introduction to Next.js framework',
              assignee: 'Content Team',
              tags: ['nextjs', 'tutorial', 'beginner'],
            },
          ],
        },
      ],
    };

    return (
      <div className="h-96 w-full">
        <Kanban data={contentData}>
          <KanbanHeader>
            <div>
              <h3 className="font-semibold">Content Pipeline</h3>
              <p className="text-muted-foreground text-sm">
                Editorial workflow management
              </p>
            </div>
            <KanbanControls>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Calendar className="h-3 w-3" />
                Schedule
              </Button>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Settings className="h-3 w-3" />
                Settings
              </Button>
            </KanbanControls>
          </KanbanHeader>
          <KanbanBoard />
        </Kanban>
      </div>
    );
  },
};

/**
 * Sales pipeline workflow.
 */
export const SalesPipeline: Story = {
  render: () => {
    const salesData: KanbanData = {
      columns: [
        {
          id: 'leads',
          title: 'Leads',
          color: '#64748b',
          cards: [
            {
              id: 'lead-1',
              title: 'Acme Corporation',
              description: 'Enterprise software solution - $50K potential',
              assignee: 'Sales Rep 1',
              tags: ['enterprise', 'software'],
              dueDate: new Date('2024-02-15'),
            },
            {
              id: 'lead-2',
              title: 'StartupXYZ',
              description: 'SaaS platform integration - $15K potential',
              assignee: 'Sales Rep 2',
              tags: ['startup', 'saas'],
            },
          ],
        },
        {
          id: 'qualified',
          title: 'Qualified',
          color: '#f59e0b',
          cards: [
            {
              id: 'lead-3',
              title: 'TechCorp Inc',
              description: 'Cloud migration services - $75K potential',
              assignee: 'Senior Sales',
              tags: ['cloud', 'migration'],
              priority: 'high',
            },
          ],
        },
        {
          id: 'proposal',
          title: 'Proposal',
          color: '#3b82f6',
          cards: [
            {
              id: 'lead-4',
              title: 'Global Industries',
              description: 'Custom development project - $120K potential',
              assignee: 'Account Manager',
              tags: ['custom', 'development'],
              priority: 'high',
              dueDate: new Date('2024-02-12'),
            },
          ],
        },
        {
          id: 'negotiation',
          title: 'Negotiation',
          color: '#8b5cf6',
          cards: [
            {
              id: 'lead-5',
              title: 'Regional Bank',
              description: 'Security audit and compliance - $30K potential',
              assignee: 'Sales Director',
              tags: ['security', 'compliance'],
              priority: 'medium',
            },
          ],
        },
        {
          id: 'closed',
          title: 'Closed Won',
          color: '#10b981',
          cards: [
            {
              id: 'lead-6',
              title: 'E-commerce Plus',
              description: 'Platform optimization - $25K closed',
              assignee: 'Sales Rep 1',
              tags: ['ecommerce', 'optimization'],
            },
          ],
        },
      ],
    };

    return (
      <div className="h-96 w-full">
        <Kanban data={salesData}>
          <KanbanHeader>
            <div>
              <h3 className="font-semibold">Sales Pipeline</h3>
              <p className="text-muted-foreground text-sm">
                Q1 2024 Opportunities
              </p>
            </div>
            <KanbanControls>
              <div className="text-muted-foreground text-sm">
                Total Pipeline: $315K
              </div>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Download className="h-3 w-3" />
                Export
              </Button>
            </KanbanControls>
          </KanbanHeader>
          <KanbanBoard />
        </Kanban>
      </div>
    );
  },
};

// Custom kanban info component for stories
const KanbanInfo = () => {
  const { data, readonly } = useKanban();

  const totalCards = data.columns.reduce(
    (sum, col) => sum + col.cards.length,
    0
  );
  const completedCards =
    data.columns.find((col) => col.id === 'done')?.cards.length || 0;

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <span className="font-medium">Columns:</span>
          <div>{data.columns.length}</div>
        </div>
        <div>
          <span className="font-medium">Total Cards:</span>
          <div>{totalCards}</div>
        </div>
        <div>
          <span className="font-medium">Completed:</span>
          <div>{completedCards}</div>
        </div>
        <div>
          <span className="font-medium">Mode:</span>
          <div>{readonly ? 'Read-only' : 'Interactive'}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Using the Kanban context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="h-64 w-full">
        <Kanban data={simpleKanbanData}>
          <KanbanBoard />
          <KanbanInfo />
        </Kanban>
      </div>
    </div>
  ),
};
