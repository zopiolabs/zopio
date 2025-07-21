/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  MoreHorizontal,
  Settings,
  User,
} from 'lucide-react';
import { useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/ui/avatar';
import { Badge } from '@repo/design-system/ui/badge';
import { Button } from '@repo/design-system/ui/button';
import {
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableCardTrigger,
} from '@repo/design-system/ui/expandable-card';
import { ProjectStatusCard } from '@repo/design-system/ui/project-status-card';
import { Switch } from '@repo/design-system/ui/switch';

/**
 * The ExpandableCard component provides a collapsible container that can reveal additional content.
 * It's useful for progressive disclosure of information, saving screen space while allowing users
 * to access more details when needed.
 */
const meta: Meta<typeof ExpandableCard> = {
  title: 'UI/ExpandableCard',
  component: ExpandableCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ExpandableCard>;

/**
 * Basic expandable card with header, content, and footer.
 */
export const Basic: Story = {
  render: () => (
    <ExpandableCard className="w-[350px]">
      <ExpandableCardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Account Settings</h3>
          <p className="text-muted-foreground text-sm">
            Manage your account preferences
          </p>
        </div>
        <ExpandableCardTrigger>
          {({ isExpanded }) => (
            <Button variant="ghost" size="sm">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </ExpandableCardTrigger>
      </ExpandableCardHeader>
      <ExpandableCardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Settings className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">Notifications</p>
              <p className="text-muted-foreground text-xs">
                Receive email updates
              </p>
            </div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">Profile Visibility</p>
              <p className="text-muted-foreground text-xs">
                Control who can see your profile
              </p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">Calendar Sync</p>
              <p className="text-muted-foreground text-xs">
                Connect to external calendars
              </p>
            </div>
          </div>
          <Switch />
        </div>
      </ExpandableCardContent>
      <ExpandableCardFooter>
        <Button className="mt-4 w-full">Save Changes</Button>
      </ExpandableCardFooter>
    </ExpandableCard>
  ),
};

/**
 * Expandable card with custom styling for expanded and collapsed states.
 */
export const CustomStyling: Story = {
  render: () => (
    <ExpandableCard
      className="w-[350px] transition-all duration-300"
      expandedClassName="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
      collapsedClassName="bg-card"
    >
      <ExpandableCardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-lg">Notifications</h3>
        </div>
        <ExpandableCardTrigger>
          {({ isExpanded }) => (
            <Button variant="ghost" size="sm" className="text-blue-500">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </ExpandableCardTrigger>
      </ExpandableCardHeader>
      <ExpandableCardContent className="space-y-3">
        <div className="rounded-lg bg-background p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New feature available</p>
              <p className="text-muted-foreground text-sm">
                Check out our latest update
              </p>
            </div>
            <Badge>New</Badge>
          </div>
        </div>
        <div className="rounded-lg bg-background p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System maintenance</p>
              <p className="text-muted-foreground text-sm">
                Scheduled for tomorrow
              </p>
            </div>
            <Badge variant="outline">Info</Badge>
          </div>
        </div>
        <div className="rounded-lg bg-background p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Your subscription</p>
              <p className="text-muted-foreground text-sm">
                Will renew in 7 days
              </p>
            </div>
            <Badge variant="secondary">Reminder</Badge>
          </div>
        </div>
      </ExpandableCardContent>
      <ExpandableCardFooter>
        <Button variant="outline" size="sm" className="mt-2 w-full">
          View All Notifications
        </Button>
      </ExpandableCardFooter>
    </ExpandableCard>
  ),
};

/**
 * Multiple expandable cards in a grid layout.
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-4">
      <ExpandableCard>
        <ExpandableCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Documents</h3>
            <ExpandableCardTrigger>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </ExpandableCardTrigger>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent className="space-y-2 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>Annual Report.pdf</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-500" />
            <span>Budget Forecast.xlsx</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <span>Project Proposal.docx</span>
          </div>
        </ExpandableCardContent>
      </ExpandableCard>

      <ExpandableCard>
        <ExpandableCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Team</h3>
            <ExpandableCardTrigger>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </ExpandableCardTrigger>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <div className="flex flex-col gap-3 pb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Alex" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">Alex Johnson</p>
                <p className="text-muted-foreground text-xs">Product Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatars/02.png" alt="Sarah" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">Sarah Williams</p>
                <p className="text-muted-foreground text-xs">Lead Designer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatars/03.png" alt="Michael" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">Michael Chen</p>
                <p className="text-muted-foreground text-xs">Developer</p>
              </div>
            </div>
          </div>
        </ExpandableCardContent>
      </ExpandableCard>

      <ExpandableCard>
        <ExpandableCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Analytics</h3>
            <ExpandableCardTrigger>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </ExpandableCardTrigger>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <div className="space-y-4 pb-4">
            <div className="flex justify-between">
              <span className="text-sm">Page Views</span>
              <span className="font-medium text-sm">12,543</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Conversion Rate</span>
              <span className="font-medium text-sm">3.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Bounce Rate</span>
              <span className="font-medium text-sm">42.1%</span>
            </div>
          </div>
        </ExpandableCardContent>
      </ExpandableCard>

      <ExpandableCard>
        <ExpandableCardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Tasks</h3>
            <ExpandableCardTrigger>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </ExpandableCardTrigger>
          </div>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <div className="space-y-2 pb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="task1"
                className="rounded border-gray-300"
              />
              <label htmlFor="task1" className="text-sm">
                Update documentation
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="task2"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label
                htmlFor="task2"
                className="text-muted-foreground text-sm line-through"
              >
                Review pull requests
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="task3"
                className="rounded border-gray-300"
              />
              <label htmlFor="task3" className="text-sm">
                Prepare presentation
              </label>
            </div>
          </div>
        </ExpandableCardContent>
      </ExpandableCard>
    </div>
  ),
};

/**
 * Project status card example using the expandable card component.
 */
export const ProjectStatus: Story = {
  render: () => (
    <div className="w-[400px]">
      <ProjectStatusCard
        title="Design System"
        progress={75}
        dueDate="Aug 15, 2025"
        contributors={[
          { name: 'Alex Johnson', image: '/avatars/01.png' },
          { name: 'Sarah Williams', image: '/avatars/02.png' },
          { name: 'Michael Chen', image: '/avatars/03.png' },
        ]}
        tasks={[
          { title: 'Create component library', completed: true },
          { title: 'Document usage guidelines', completed: true },
          { title: 'Implement dark mode', completed: false },
          { title: 'Add animation variants', completed: false },
        ]}
        githubStars={124}
        openIssues={7}
        lastUpdated="3 hours ago"
      />
    </div>
  ),
};

/**
 * Dark theme example of the expandable card.
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="w-[350px] space-y-6">
      <ExpandableCard defaultExpanded>
        <ExpandableCardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Account Settings</h3>
            <p className="text-muted-foreground text-sm">
              Manage your account preferences
            </p>
          </div>
          <ExpandableCardTrigger>
            {({ isExpanded }) => (
              <Button variant="ghost" size="sm">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </ExpandableCardTrigger>
        </ExpandableCardHeader>
        <ExpandableCardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">Notifications</p>
                <p className="text-muted-foreground text-xs">
                  Receive email updates
                </p>
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <User className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">Profile Visibility</p>
                <p className="text-muted-foreground text-xs">
                  Control who can see your profile
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </ExpandableCardContent>
        <ExpandableCardFooter>
          <Button className="mt-4 w-full">Save Changes</Button>
        </ExpandableCardFooter>
      </ExpandableCard>

      <ProjectStatusCard
        title="Mobile App"
        progress={90}
        dueDate="Sep 30, 2025"
        contributors={[
          { name: 'Emma Davis', image: '/avatars/04.png' },
          { name: 'James Wilson', image: '/avatars/05.png' },
          { name: 'Olivia Martin', image: '/avatars/06.png' },
        ]}
        tasks={[
          { title: 'UI/UX design', completed: true },
          { title: 'Core functionality', completed: true },
          { title: 'Testing', completed: true },
          { title: 'App store submission', completed: false },
        ]}
        githubStars={87}
        openIssues={3}
        lastUpdated="1 day ago"
      />
    </div>
  ),
};

/**
 * Controlled expandable card example.
 */
export const Controlled: Story = {
  render: () => {
    // Use React.useState in a function component wrapper
    return <ControlledExample />;
  },
};

// Helper component for controlled example
function ControlledExample() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-[350px] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Card Controls</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(true)}
            disabled={isExpanded}
          >
            Expand
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(false)}
            disabled={!isExpanded}
          >
            Collapse
          </Button>
        </div>
      </div>

      <ExpandableCard
        defaultExpanded={isExpanded}
        onExpandChange={setIsExpanded}
      >
        <ExpandableCardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Controlled Card</h3>
            <p className="text-muted-foreground text-sm">
              External state controls this card
            </p>
          </div>
          <ExpandableCardTrigger>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </ExpandableCardTrigger>
        </ExpandableCardHeader>
        <ExpandableCardContent>
          <p className="py-4">
            This card's expanded state is controlled externally. Use the buttons
            above to expand or collapse it.
          </p>
        </ExpandableCardContent>
        <ExpandableCardFooter>
          <p className="text-muted-foreground text-sm">
            Current state: {isExpanded ? 'Expanded' : 'Collapsed'}
          </p>
        </ExpandableCardFooter>
      </ExpandableCard>
    </div>
  );
}
