/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Calendar,
  Download,
  Filter,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  List,
  ListContainer,
  ListControls,
  type ListData,
  ListHeader,
  type ListItemType,
  useList,
} from '@repo/design-system/ui/list';

/**
 * A List component for displaying tasks grouped by status and ranked by priority with drag-and-drop functionality.
 */
const meta: Meta<typeof List> = {
  title: 'ui/List',
  component: List,
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

// Sample List data
const sampleListData: ListData = {
  groups: [
    {
      id: 'planned',
      title: 'Planned',
      color: '#64748b',
      items: [
        {
          id: '1',
          title: 'Redefine visionary initiatives',
          description:
            'Establish clear goals and objectives for the upcoming quarter',
          priority: 'high',
          assignee: 'John Doe',
          tags: ['strategy', 'planning'],
          dueDate: new Date('2024-02-15'),
        },
        {
          id: '2',
          title: 'Synthesize compelling methodologies',
          description: 'Develop new approaches for project management',
          priority: 'medium',
          assignee: 'Jane Smith',
          tags: ['methodology', 'process'],
        },
        {
          id: '3',
          title: 'Orchestrate next-generation markets',
          description: 'Research and analyze emerging market opportunities',
          priority: 'low',
          tags: ['research', 'market'],
        },
        {
          id: '4',
          title: 'Mesh customized synergies',
          description: 'Identify collaboration opportunities between teams',
          priority: 'medium',
          assignee: 'Mike Johnson',
          tags: ['collaboration'],
        },
        {
          id: '5',
          title: 'Maximize strategic AI',
          description: 'Implement AI solutions for business optimization',
          priority: 'high',
          assignee: 'Sarah Wilson',
          tags: ['ai', 'optimization'],
          dueDate: new Date('2024-02-20'),
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#3b82f6',
      items: [
        {
          id: '6',
          title: 'Implement decentralized functionalities',
          description: 'Build distributed system architecture',
          priority: 'high',
          assignee: 'John Doe',
          tags: ['backend', 'architecture'],
          color: '#ef4444',
        },
        {
          id: '7',
          title: 'Maximize open-source models',
          description: 'Evaluate and integrate open-source solutions',
          priority: 'medium',
          assignee: 'Jane Smith',
          tags: ['open-source', 'evaluation'],
        },
        {
          id: '8',
          title: 'Syndicate synergistic content',
          description: 'Create content distribution strategy',
          priority: 'low',
          assignee: 'Mike Johnson',
          tags: ['content', 'marketing'],
        },
        {
          id: '9',
          title: 'Evolve value-added interfaces',
          description: 'Improve user interface design and usability',
          priority: 'medium',
          assignee: 'Sarah Wilson',
          tags: ['ui', 'design'],
          dueDate: new Date('2024-02-18'),
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: '#10b981',
      items: [
        {
          id: '10',
          title: 'Redefine open-source interfaces',
          description: 'Completed redesign of API interfaces',
          priority: 'high',
          assignee: 'John Doe',
          tags: ['api', 'interface'],
          completed: true,
        },
        {
          id: '11',
          title: 'Repurpose cross-media smart contracts',
          description: 'Successfully implemented smart contract system',
          priority: 'medium',
          assignee: 'Jane Smith',
          tags: ['blockchain', 'contracts'],
          completed: true,
        },
        {
          id: '12',
          title: 'Transition back-end markets',
          description: 'Migrated to new backend infrastructure',
          priority: 'high',
          assignee: 'Mike Johnson',
          tags: ['backend', 'migration'],
          completed: true,
        },
      ],
    },
  ],
};

const simpleListData: ListData = {
  groups: [
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
        { id: '3', title: 'Task 3' },
      ],
    },
    {
      id: 'doing',
      title: 'Doing',
      items: [{ id: '4', title: 'Task 4' }],
    },
    {
      id: 'done',
      title: 'Done',
      items: [
        { id: '5', title: 'Task 5', completed: true },
        { id: '6', title: 'Task 6', completed: true },
      ],
    },
  ],
};

/**
 * Basic List with default settings.
 */
export const Default: Story = {
  render: () => {
    const [listData, setListData] = useState<ListData>(sampleListData);

    const handleItemMove = (
      itemId: string,
      sourceGroupId: string,
      destinationGroupId: string,
      destinationIndex: number
    ) => {
      setListData((prev) => {
        // Find the item to move
        let itemToMove: ListItemType | null = null;
        const newGroups = prev.groups.map((group) => {
          if (group.id === sourceGroupId) {
            const itemIndex = group.items.findIndex(
              (item) => item.id === itemId
            );
            if (itemIndex !== -1) {
              itemToMove = group.items[itemIndex];
              return {
                ...group,
                items: group.items.filter((item) => item.id !== itemId),
              };
            }
          }
          return group;
        });

        // Add the item to the destination group
        if (itemToMove) {
          const updatedGroups = newGroups.map((group) => {
            if (group.id === destinationGroupId) {
              const newItems = [...group.items];
              newItems.splice(destinationIndex, 0, itemToMove as ListItemType);
              return {
                ...group,
                items: newItems,
              };
            }
            return group;
          });

          return {
            ...prev,
            groups: updatedGroups,
          };
        }

        return prev;
      });
    };

    return (
      <div className="h-full w-full overflow-auto">
        <List data={listData} onItemMove={handleItemMove}>
          <ListContainer />
        </List>
      </div>
    );
  },
};

/**
 * Different visual variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <div className="h-64 w-full overflow-auto">
          <List variant="default" data={simpleListData}>
            <ListContainer />
          </List>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <div className="h-64 w-full overflow-auto">
          <List variant="ghost" data={simpleListData}>
            <ListContainer />
          </List>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <div className="h-64 w-full overflow-auto">
          <List variant="outline" data={simpleListData}>
            <ListContainer />
          </List>
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
        <div className="h-48 w-full overflow-auto">
          <List size="sm" data={simpleListData}>
            <ListContainer />
          </List>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <div className="h-56 w-full overflow-auto">
          <List size="md" data={simpleListData}>
            <ListContainer />
          </List>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <div className="h-64 w-full overflow-auto">
          <List size="lg" data={simpleListData}>
            <ListContainer />
          </List>
        </div>
      </div>
    </div>
  ),
};

/**
 * Read-only List.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className="h-full w-full overflow-auto">
      <List data={sampleListData} readonly>
        <ListHeader>
          <h3 className="font-semibold">Project Tasks (Read-Only)</h3>
          <div className="text-muted-foreground text-sm">View-only mode</div>
        </ListHeader>
        <ListContainer />
      </List>
    </div>
  ),
};

/**
 * Simple List with minimal data.
 */
export const Simple: Story = {
  render: () => (
    <div className="h-full w-full overflow-auto">
      <List data={simpleListData}>
        <ListContainer />
      </List>
    </div>
  ),
};

/**
 * Task management workflow.
 */
export const TaskManagement: Story = {
  render: () => {
    const [listData, setListData] = useState<ListData>(sampleListData);

    const handleItemAdd = (groupId: string, item: Omit<ListItemType, 'id'>) => {
      const newItem = {
        ...item,
        id: Date.now().toString(),
      };

      setListData((prev) => ({
        ...prev,
        groups: prev.groups.map((group) =>
          group.id === groupId
            ? { ...group, items: [...group.items, newItem] }
            : group
        ),
      }));
    };

    const handleItemToggle = (itemId: string, groupId: string) => {
      setListData((prev) => ({
        ...prev,
        groups: prev.groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                items: group.items.map((item) =>
                  item.id === itemId
                    ? { ...item, completed: !item.completed }
                    : item
                ),
              }
            : group
        ),
      }));
    };

    const totalTasks = listData.groups.reduce(
      (sum, group) => sum + group.items.length,
      0
    );
    const completedTasks = listData.groups.reduce(
      (sum, group) => sum + group.items.filter((item) => item.completed).length,
      0
    );

    return (
      <div className="h-full w-full overflow-auto">
        <List
          data={listData}
          onItemAdd={handleItemAdd}
          onItemToggle={handleItemToggle}
        >
          <ListHeader>
            <div>
              <h3 className="font-semibold">Task Management</h3>
              <p className="text-muted-foreground text-sm">
                {completedTasks}/{totalTasks} tasks completed
              </p>
            </div>
            <ListControls>
              <Button className="flex items-center gap-2 rounded bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90">
                <Plus className="h-3 w-3" />
                New Task
              </Button>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Filter className="h-3 w-3" />
                Filter
              </Button>
            </ListControls>
          </ListHeader>
          <ListContainer />
        </List>
      </div>
    );
  },
};

/**
 * Bug tracking workflow.
 */
export const BugTracking: Story = {
  render: () => {
    const bugListData: ListData = {
      groups: [
        {
          id: 'reported',
          title: 'Reported',
          color: '#ef4444',
          items: [
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
            {
              id: 'bug-3',
              title: 'Mobile menu not responsive',
              description: 'Navigation menu overlaps content on mobile devices',
              priority: 'low',
              assignee: 'Mike Johnson',
              tags: ['mobile', 'css'],
            },
          ],
        },
        {
          id: 'investigating',
          title: 'Investigating',
          color: '#f59e0b',
          items: [
            {
              id: 'bug-4',
              title: 'Memory leak in data processing',
              description: 'Application crashes after processing large files',
              priority: 'high',
              assignee: 'Sarah Wilson',
              tags: ['memory', 'backend'],
            },
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
          items: [
            {
              id: 'bug-6',
              title: 'Image upload size limit',
              description: 'Users unable to upload images larger than 1MB',
              priority: 'medium',
              assignee: 'Jane Smith',
              tags: ['upload', 'backend'],
              completed: true,
            },
            {
              id: 'bug-7',
              title: 'Broken link in footer',
              description: 'Privacy policy link returns 404 error',
              priority: 'low',
              assignee: 'Mike Johnson',
              tags: ['frontend', 'links'],
              completed: true,
            },
          ],
        },
      ],
    };

    return (
      <div className="h-full w-full overflow-auto">
        <List data={bugListData}>
          <ListHeader>
            <div>
              <h3 className="font-semibold">Bug Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Active issues and resolutions
              </p>
            </div>
            <ListControls>
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
            </ListControls>
          </ListHeader>
          <ListContainer />
        </List>
      </div>
    );
  },
};

/**
 * Feature development workflow.
 */
export const FeatureDevelopment: Story = {
  render: () => {
    const featureListData: ListData = {
      groups: [
        {
          id: 'backlog',
          title: 'Backlog',
          color: '#64748b',
          collapsible: true,
          items: [
            {
              id: 'feature-1',
              title: 'User Profile Management',
              description: 'Allow users to update their profile information',
              priority: 'medium',
              tags: ['frontend', 'user-management'],
            },
            {
              id: 'feature-2',
              title: 'Advanced Search Filters',
              description: 'Add date range and category filters to search',
              priority: 'low',
              tags: ['frontend', 'search'],
            },
            {
              id: 'feature-3',
              title: 'Email Notifications',
              description: 'Send email notifications for important events',
              priority: 'high',
              tags: ['backend', 'notifications'],
            },
          ],
        },
        {
          id: 'development',
          title: 'In Development',
          color: '#3b82f6',
          items: [
            {
              id: 'feature-4',
              title: 'Real-time Chat',
              description: 'Implement WebSocket-based chat system',
              priority: 'high',
              assignee: 'John Doe',
              tags: ['backend', 'websocket'],
              dueDate: new Date('2024-02-25'),
            },
            {
              id: 'feature-5',
              title: 'File Upload System',
              description: 'Support multiple file formats and cloud storage',
              priority: 'medium',
              assignee: 'Jane Smith',
              tags: ['backend', 'storage'],
            },
          ],
        },
        {
          id: 'testing',
          title: 'Testing',
          color: '#8b5cf6',
          items: [
            {
              id: 'feature-6',
              title: 'Two-Factor Authentication',
              description: 'Add 2FA support for enhanced security',
              priority: 'high',
              assignee: 'Sarah Wilson',
              tags: ['security', 'authentication'],
            },
          ],
        },
        {
          id: 'deployed',
          title: 'Deployed',
          color: '#10b981',
          items: [
            {
              id: 'feature-7',
              title: 'Dark Mode Theme',
              description: 'Toggle between light and dark themes',
              priority: 'low',
              assignee: 'Mike Johnson',
              tags: ['frontend', 'theme'],
              completed: true,
            },
            {
              id: 'feature-8',
              title: 'API Rate Limiting',
              description: 'Implement rate limiting for API endpoints',
              priority: 'medium',
              assignee: 'John Doe',
              tags: ['backend', 'security'],
              completed: true,
            },
          ],
        },
      ],
    };

    return (
      <div className="h-full w-full overflow-auto">
        <List data={featureListData}>
          <ListHeader>
            <div>
              <h3 className="font-semibold">Feature Development</h3>
              <p className="text-muted-foreground text-sm">
                Sprint planning and progress tracking
              </p>
            </div>
            <ListControls>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Users className="h-3 w-3" />
                Assign
              </Button>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Calendar className="h-3 w-3" />
                Sprint
              </Button>
            </ListControls>
          </ListHeader>
          <ListContainer />
        </List>
      </div>
    );
  },
};

/**
 * Content creation workflow.
 */
export const ContentCreation: Story = {
  render: () => {
    const contentListData: ListData = {
      groups: [
        {
          id: 'ideas',
          title: 'Ideas',
          color: '#64748b',
          items: [
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
          id: 'writing',
          title: 'Writing',
          color: '#3b82f6',
          items: [
            {
              id: 'content-3',
              title: 'TypeScript Migration Guide',
              description:
                'Step-by-step guide for migrating JavaScript to TypeScript',
              assignee: 'Senior Developer',
              tags: ['tutorial', 'typescript'],
              dueDate: new Date('2024-02-20'),
            },
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
          id: 'published',
          title: 'Published',
          color: '#10b981',
          items: [
            {
              id: 'content-5',
              title: 'Getting Started with Next.js',
              description:
                'Beginner-friendly introduction to Next.js framework',
              assignee: 'Content Team',
              tags: ['nextjs', 'tutorial', 'beginner'],
              completed: true,
            },
            {
              id: 'content-6',
              title: 'CSS Grid vs Flexbox',
              description: 'Comparison guide for modern CSS layout methods',
              assignee: 'Frontend Lead',
              tags: ['css', 'layout', 'comparison'],
              completed: true,
            },
          ],
        },
      ],
    };

    return (
      <div className="h-full w-full overflow-auto">
        <List data={contentListData}>
          <ListHeader>
            <div>
              <h3 className="font-semibold">Content Pipeline</h3>
              <p className="text-muted-foreground text-sm">
                Editorial workflow management
              </p>
            </div>
            <ListControls>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Calendar className="h-3 w-3" />
                Schedule
              </Button>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Download className="h-3 w-3" />
                Export
              </Button>
            </ListControls>
          </ListHeader>
          <ListContainer />
        </List>
      </div>
    );
  },
};

/**
 * Collapsible groups.
 */
export const CollapsibleGroups: Story = {
  render: () => {
    const collapsibleData: ListData = {
      groups: [
        {
          id: 'urgent',
          title: 'Urgent Tasks',
          color: '#ef4444',
          collapsible: true,
          items: [
            {
              id: 'urgent-1',
              title: 'Fix critical security vulnerability',
              priority: 'high',
              assignee: 'Security Team',
              tags: ['security', 'critical'],
            },
            {
              id: 'urgent-2',
              title: 'Restore backup system',
              priority: 'high',
              assignee: 'DevOps Team',
              tags: ['backup', 'infrastructure'],
            },
          ],
        },
        {
          id: 'normal',
          title: 'Normal Tasks',
          color: '#3b82f6',
          collapsible: true,
          collapsed: true,
          items: [
            {
              id: 'normal-1',
              title: 'Update documentation',
              priority: 'medium',
              assignee: 'Tech Writer',
              tags: ['documentation'],
            },
            {
              id: 'normal-2',
              title: 'Code review',
              priority: 'medium',
              assignee: 'Senior Developer',
              tags: ['review', 'code'],
            },
            {
              id: 'normal-3',
              title: 'Refactor legacy code',
              priority: 'low',
              assignee: 'Developer',
              tags: ['refactor', 'legacy'],
            },
          ],
        },
        {
          id: 'completed',
          title: 'Completed Tasks',
          color: '#10b981',
          collapsible: true,
          items: [
            {
              id: 'completed-1',
              title: 'Deploy new features',
              priority: 'high',
              assignee: 'DevOps Team',
              tags: ['deployment'],
              completed: true,
            },
            {
              id: 'completed-2',
              title: 'Performance optimization',
              priority: 'medium',
              assignee: 'Performance Team',
              tags: ['optimization'],
              completed: true,
            },
          ],
        },
      ],
    };

    return (
      <div className="h-full w-full overflow-auto">
        <List data={collapsibleData}>
          <ListHeader>
            <h3 className="font-semibold">Task List with Collapsible Groups</h3>
            <ListControls>
              <Button className="flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-muted">
                <Settings className="h-3 w-3" />
                Settings
              </Button>
            </ListControls>
          </ListHeader>
          <ListContainer />
        </List>
      </div>
    );
  },
};

// Custom list info component for stories
const ListInfo = () => {
  const { data, readonly } = useList();

  const totalItems = data.groups.reduce(
    (sum, group) => sum + group.items.length,
    0
  );
  const completedItems = data.groups.reduce(
    (sum, group) => sum + group.items.filter((item) => item.completed).length,
    0
  );
  const highPriorityItems = data.groups.reduce(
    (sum, group) =>
      sum + group.items.filter((item) => item.priority === 'high').length,
    0
  );

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <span className="font-medium">Groups:</span>
          <div>{data.groups.length}</div>
        </div>
        <div>
          <span className="font-medium">Total Items:</span>
          <div>{totalItems}</div>
        </div>
        <div>
          <span className="font-medium">Completed:</span>
          <div>{completedItems}</div>
        </div>
        <div>
          <span className="font-medium">High Priority:</span>
          <div>{highPriorityItems}</div>
        </div>
        <div>
          <span className="font-medium">Progress:</span>
          <div>
            {totalItems > 0
              ? Math.round((completedItems / totalItems) * 100)
              : 0}
            %
          </div>
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
 * Using the List context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="h-full w-full overflow-auto">
        <List data={simpleListData}>
          <ListContainer />
          <ListInfo />
        </List>
      </div>
    </div>
  ),
};
