/**
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Bookmark,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share,
} from 'lucide-react';

import {
  Glimpse,
  GlimpseActions,
  GlimpseBadge,
  GlimpseBody,
  GlimpseContent,
  GlimpseFooter,
  GlimpseHeader,
  GlimpseVisibilityToggle,
  useGlimpse,
} from '@repo/design-system/ui/glimpse';

/**
 * A content preview component that shows a glimpse of text or content with expand/collapse functionality.
 */
const meta: Meta<typeof Glimpse> = {
  title: 'ui/Glimpse',
  component: Glimpse,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'card', 'ghost', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
    },
    maxLines: {
      control: { type: 'number' },
      description: 'Maximum lines to show when collapsed',
    },
    expandable: {
      control: { type: 'boolean' },
      description: 'Whether content can be expanded',
    },
    showToggle: {
      control: { type: 'boolean' },
      description: 'Show expand/collapse toggle',
    },
    initialExpanded: {
      control: { type: 'boolean' },
      description: 'Initial expanded state',
    },
    initialVisible: {
      control: { type: 'boolean' },
      description: 'Initial visibility state',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`;

/**
 * Basic glimpse with expandable content.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Glimpse>
        <GlimpseBody>{longText}</GlimpseBody>
        <GlimpseFooter />
      </Glimpse>
    </div>
  ),
};

/**
 * Different visual variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <Glimpse variant="default">
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Card</h4>
        <Glimpse variant="card">
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Ghost</h4>
        <Glimpse variant="ghost">
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Outline</h4>
        <Glimpse variant="outline">
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>
    </div>
  ),
};

/**
 * Different text sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <Glimpse size="sm">
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <Glimpse size="md">
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <Glimpse size="lg">
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>
    </div>
  ),
};

/**
 * Different maximum line limits.
 */
export const MaxLines: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">1 Line</h4>
        <Glimpse maxLines={1}>
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">2 Lines</h4>
        <Glimpse maxLines={2}>
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">5 Lines</h4>
        <Glimpse maxLines={5}>
          <GlimpseBody>{longText}</GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>
    </div>
  ),
};

/**
 * Non-expandable glimpse.
 */
export const NonExpandable: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Glimpse expandable={false}>
        <GlimpseBody>{longText}</GlimpseBody>
        <GlimpseFooter>
          <span className="text-muted-foreground text-xs">
            Content is truncated and cannot be expanded
          </span>
        </GlimpseFooter>
      </Glimpse>
    </div>
  ),
};

/**
 * Initially expanded glimpse.
 */
export const InitiallyExpanded: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Glimpse initialExpanded>
        <GlimpseBody>{longText}</GlimpseBody>
        <GlimpseFooter />
      </Glimpse>
    </div>
  ),
};

/**
 * Glimpse with header and badges.
 */
export const WithHeader: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Glimpse variant="card">
        <GlimpseHeader>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Article Title</h3>
            <GlimpseBadge variant="info">New</GlimpseBadge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">5 min read</span>
            <GlimpseVisibilityToggle />
          </div>
        </GlimpseHeader>
        <GlimpseBody>{longText}</GlimpseBody>
        <GlimpseFooter>
          <GlimpseActions>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              <Heart className="mr-1 h-4 w-4" />
              Like
            </Button>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              <MessageCircle className="mr-1 h-4 w-4" />
              Comment
            </Button>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              <Share className="mr-1 h-4 w-4" />
              Share
            </Button>
          </GlimpseActions>
        </GlimpseFooter>
      </Glimpse>
    </div>
  ),
};

/**
 * Blog post preview.
 */
export const BlogPost: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Glimpse variant="card" maxLines={4}>
        <GlimpseHeader>
          <div>
            <h2 className="mb-1 font-bold text-xl">
              Understanding React Hooks
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>By John Doe</span>
              <span>•</span>
              <span>March 15, 2024</span>
              <span>•</span>
              <GlimpseBadge variant="success">Published</GlimpseBadge>
            </div>
          </div>
          <GlimpseActions>
            <Button className="rounded p-2 hover:bg-muted">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button className="rounded p-2 hover:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </GlimpseActions>
        </GlimpseHeader>
        <GlimpseBody>
          React Hooks have revolutionized the way we write React components.
          They allow us to use state and other React features without writing a
          class component. In this comprehensive guide, we'll explore the most
          commonly used hooks and learn how to create custom hooks for your
          specific needs. useState is probably the most fundamental hook you'll
          encounter. It allows functional components to have local state,
          something that was previously only possible with class components. The
          hook returns an array with two elements: the current state value and a
          function to update it. useEffect is another crucial hook that lets you
          perform side effects in functional components. It serves the same
          purpose as componentDidMount, componentDidUpdate, and
          componentWillUnmount combined in React class components. You can use
          it for data fetching, setting up subscriptions, or manually changing
          the DOM.
        </GlimpseBody>
        <GlimpseFooter>
          <GlimpseActions>
            <Button className="flex items-center text-muted-foreground text-sm hover:text-foreground">
              <Heart className="mr-1 h-4 w-4" />
              42 likes
            </Button>
            <Button className="flex items-center text-muted-foreground text-sm hover:text-foreground">
              <MessageCircle className="mr-1 h-4 w-4" />
              12 comments
            </Button>
            <Button className="flex items-center text-muted-foreground text-sm hover:text-foreground">
              <Share className="mr-1 h-4 w-4" />
              Share
            </Button>
          </GlimpseActions>
        </GlimpseFooter>
      </Glimpse>
    </div>
  ),
};

/**
 * Product description glimpse.
 */
export const ProductDescription: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Glimpse variant="outline" maxLines={3}>
        <GlimpseHeader>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Premium Wireless Headphones</h3>
            <GlimpseBadge variant="warning">Limited Stock</GlimpseBadge>
          </div>
          <div className="font-bold text-xl">$299.99</div>
        </GlimpseHeader>
        <GlimpseBody>
          Experience unparalleled audio quality with our premium wireless
          headphones. Featuring active noise cancellation, 30-hour battery life,
          and crystal-clear sound reproduction, these headphones are perfect for
          music lovers and professionals alike. The ergonomic design ensures
          comfort during extended listening sessions, while the premium
          materials provide durability and style. With Bluetooth 5.0
          connectivity, you can enjoy seamless pairing with all your devices.
          Key features include: Active Noise Cancellation (ANC), 30-hour battery
          life, Quick charge (15 minutes for 3 hours playback), Premium leather
          ear cushions, Foldable design for portability, Built-in microphone for
          calls, Touch controls for easy operation.
        </GlimpseBody>
        <GlimpseFooter>
          <GlimpseActions>
            <Button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Add to Cart
            </Button>
            <Button className="rounded border px-4 py-2 hover:bg-muted">
              Add to Wishlist
            </Button>
          </GlimpseActions>
        </GlimpseFooter>
      </Glimpse>
    </div>
  ),
};

/**
 * Comment thread glimpse.
 */
export const CommentThread: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Glimpse variant="ghost" maxLines={2}>
        <div className="flex items-start space-x-3 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-medium text-sm text-white">
            A
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-medium">Alice Johnson</span>
              <span className="text-muted-foreground text-xs">2 hours ago</span>
              <GlimpseBadge variant="info">Author</GlimpseBadge>
            </div>
            <GlimpseContent>
              This is a really insightful article! I've been struggling with
              understanding React hooks for a while, and your explanation of
              useState and useEffect really cleared things up for me. The
              examples you provided are practical and easy to follow. I'm
              particularly interested in learning more about custom hooks - do
              you have any recommendations for advanced patterns or best
              practices when creating them?
            </GlimpseContent>
          </div>
        </div>
        <GlimpseFooter className="pl-11">
          <GlimpseActions>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              <Heart className="mr-1 h-4 w-4" />5
            </Button>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              Reply
            </Button>
          </GlimpseActions>
        </GlimpseFooter>
      </Glimpse>

      <Glimpse variant="ghost" maxLines={1}>
        <div className="flex items-start space-x-3 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-medium text-sm text-white">
            B
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-medium">Bob Smith</span>
              <span className="text-muted-foreground text-xs">1 hour ago</span>
            </div>
            <GlimpseContent>
              Great article! I've bookmarked this for future reference. The way
              you explained the component lifecycle in relation to useEffect was
              particularly helpful.
            </GlimpseContent>
          </div>
        </div>
        <GlimpseFooter className="pl-11">
          <GlimpseActions>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              <Heart className="mr-1 h-4 w-4" />2
            </Button>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              Reply
            </Button>
          </GlimpseActions>
        </GlimpseFooter>
      </Glimpse>
    </div>
  ),
};

/**
 * News article preview.
 */
export const NewsArticle: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Glimpse variant="card" maxLines={3}>
        <GlimpseHeader>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <GlimpseBadge variant="error">Breaking</GlimpseBadge>
              <span className="text-muted-foreground text-sm">Technology</span>
            </div>
            <h2 className="font-bold text-xl">
              Major Tech Company Announces Revolutionary AI Breakthrough
            </h2>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
              <span>Tech Reporter</span>
              <span>•</span>
              <span>2 minutes ago</span>
            </div>
          </div>
        </GlimpseHeader>
        <GlimpseBody>
          In a groundbreaking announcement today, a leading technology company
          revealed a significant advancement in artificial intelligence that
          could reshape the industry. The new AI system demonstrates
          unprecedented capabilities in natural language understanding and
          generation, surpassing previous benchmarks by substantial margins. The
          breakthrough comes after years of research and development, involving
          a team of hundreds of engineers and researchers. The company claims
          this advancement will enable more sophisticated human-computer
          interactions and could have far-reaching implications for various
          industries including healthcare, education, and entertainment.
          Industry experts are calling this development a potential
          game-changer, though some raise concerns about the ethical
          implications and the need for proper regulation. The announcement has
          already caused significant movement in tech stocks and sparked intense
          discussion among AI researchers worldwide.
        </GlimpseBody>
        <GlimpseFooter>
          <GlimpseActions>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              Read Full Article
            </Button>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              <Share className="mr-1 h-4 w-4" />
              Share
            </Button>
            <Button className="text-muted-foreground text-sm hover:text-foreground">
              <Bookmark className="mr-1 h-4 w-4" />
              Save
            </Button>
          </GlimpseActions>
        </GlimpseFooter>
      </Glimpse>
    </div>
  ),
};

/**
 * Custom content with visibility toggle.
 */
export const WithVisibilityToggle: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setVisible(!visible)}
            className="flex items-center text-muted-foreground text-sm hover:text-foreground"
          >
            {visible ? (
              <EyeOff className="mr-1 h-4 w-4" />
            ) : (
              <Eye className="mr-1 h-4 w-4" />
            )}
            {visible ? 'Hide Content' : 'Show Content'}
          </Button>
        </div>

        <Glimpse initialVisible={visible} onToggleVisibility={setVisible}>
          <GlimpseHeader>
            <h3 className="font-semibold">Sensitive Content</h3>
            <GlimpseBadge variant="warning">Confidential</GlimpseBadge>
          </GlimpseHeader>
          <GlimpseBody>
            This content contains sensitive information that can be hidden from
            view. Use the visibility toggle to show or hide this content as
            needed. This is useful for protecting sensitive data or providing
            content warnings.
          </GlimpseBody>
          <GlimpseFooter />
        </Glimpse>
      </div>
    );
  },
};

// Custom info component for stories
const GlimpseInfo = () => {
  const { isExpanded, isVisible, maxLines, expandable } = useGlimpse();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Expanded:</span>
          <div>{isExpanded ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Visible:</span>
          <div>{isVisible ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <span className="font-medium">Max Lines:</span>
          <div>{maxLines}</div>
        </div>
        <div>
          <span className="font-medium">Expandable:</span>
          <div>{expandable ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Using the glimpse context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Glimpse>
        <GlimpseBody>{longText}</GlimpseBody>
        <GlimpseFooter />
        <GlimpseInfo />
      </Glimpse>
    </div>
  ),
};
