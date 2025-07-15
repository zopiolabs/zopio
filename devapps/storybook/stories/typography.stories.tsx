/**
 * SPDX-License-Identifier: MIT
 */

import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from '@repo/design-system/ui/typography';
import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Typography components provide a consistent text hierarchy across the application.
 *
 * ## Features
 *
 * - Consistent text styling across the application
 * - Proper spacing and line heights for readability
 * - Responsive font sizes
 * - Semantic HTML elements
 *
 * ## Usage
 *
 * ```tsx
 * import {
 *   TypographyH1,
 *   TypographyP,
 *   TypographyBlockquote
 * } from "@repo/design-system/ui/typography";
 *
 * export function MyComponent() {
 *   return (
 *     <div>
 *       <TypographyH1>Main Heading</TypographyH1>
 *       <TypographyP>This is a paragraph with consistent styling.</TypographyP>
 *       <TypographyBlockquote>This is a blockquote.</TypographyBlockquote>
 *     </div>
 *   );
 * }
 * ```
 *
 * ## Accessibility
 *
 * - Uses semantic HTML elements for proper document structure
 * - Maintains appropriate contrast ratios for readability
 * - Preserves text scaling for users with visual impairments
 */
const meta = {
  title: 'UI/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Heading components provide a consistent hierarchy for section titles.
 * They use appropriate HTML heading elements (h1-h4) for semantic structure.
 */
export const Headings: Story = {
  render: () => (
    <div className="space-y-6">
      <TypographyH1>Heading 1</TypographyH1>
      <TypographyH2>Heading 2</TypographyH2>
      <TypographyH3>Heading 3</TypographyH3>
      <TypographyH4>Heading 4</TypographyH4>
    </div>
  ),
};

/**
 * Paragraph components provide consistent text styling with appropriate line height
 * and spacing for optimal readability.
 */
export const Paragraph: Story = {
  render: () => (
    <div className="space-y-6">
      <TypographyP>
        This is a paragraph of text. It demonstrates the standard paragraph
        styling with proper line height and spacing. Paragraphs are the
        fundamental building blocks of typography in any design system.
      </TypographyP>
      <TypographyP>
        This is a second paragraph to demonstrate spacing between paragraphs.
        Notice how the paragraphs have appropriate margins to create a
        comfortable reading experience.
      </TypographyP>
    </div>
  ),
};

/**
 * Blockquote component for highlighting quoted text with a distinctive left border
 * and italic styling.
 */
export const Blockquote: Story = {
  render: () => (
    <TypographyBlockquote>
      "Good design is as little design as possible. Less, but better – because
      it concentrates on the essential aspects, and the products are not
      burdened with non-essentials."
      <br />— Dieter Rams
    </TypographyBlockquote>
  ),
};

/**
 * List component for displaying bulleted lists with consistent spacing and styling between items.
 */
export const List: Story = {
  render: () => (
    <TypographyList>
      <li>First item in the list</li>
      <li>Second item in the list</li>
      <li>
        Third item with a nested element:{' '}
        <TypographyInlineCode>code</TypographyInlineCode>
      </li>
      <li>Fourth item in the list</li>
    </TypographyList>
  ),
};

/**
 * InlineCode component for highlighting code snippets within text with a monospace font
 * and background styling.
 */
export const InlineCode: Story = {
  render: () => (
    <div className="space-y-6">
      <TypographyP>
        You can use the{' '}
        <TypographyInlineCode>TypographyInlineCode</TypographyInlineCode>{' '}
        component to highlight code snippets within text.
      </TypographyP>
      <TypographyP>
        For example:{' '}
        <TypographyInlineCode>
          npm install @repo/design-system
        </TypographyInlineCode>
      </TypographyP>
    </div>
  ),
};

/**
 * Lead component for introductory text that needs to stand out from regular paragraphs.
 * Uses larger font size and muted color.
 */
export const Lead: Story = {
  render: () => (
    <TypographyLead>
      This is a lead paragraph. It's typically used for introductory text that
      stands out from the rest of the content. It's larger and has a muted
      color.
    </TypographyLead>
  ),
};

/**
 * Large component for text that needs to be emphasized but doesn't warrant a heading.
 * Uses larger font size with semi-bold weight.
 */
export const Large: Story = {
  render: () => (
    <TypographyLarge>
      This is large text, often used for important but not heading-level
      content.
    </TypographyLarge>
  ),
};

/**
 * Small component for secondary text like captions, footnotes, or metadata.
 * Uses smaller font size with medium weight.
 */
export const Small: Story = {
  render: () => (
    <TypographySmall>
      This is small text, used for captions, footnotes, or other secondary
      content.
    </TypographySmall>
  ),
};

/**
 * Muted component for less important or supporting content.
 * Uses smaller font size with muted color to de-emphasize the text.
 */
export const Muted: Story = {
  render: () => (
    <TypographyMuted>
      This is muted text, used for less important information or supporting
      content.
    </TypographyMuted>
  ),
};

/**
 * A comprehensive showcase of all typography components in the design system,
 * demonstrating their appearance and hierarchy when used together.
 */
export const AllTypography: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <TypographyH1>Typography</TypographyH1>
        <TypographyLead>
          A collection of typography components for building consistent text
          hierarchies.
        </TypographyLead>
      </div>

      <div>
        <TypographyH2>Headings</TypographyH2>
        <TypographyH1>Heading 1</TypographyH1>
        <TypographyH2>Heading 2</TypographyH2>
        <TypographyH3>Heading 3</TypographyH3>
        <TypographyH4>Heading 4</TypographyH4>
      </div>

      <div>
        <TypographyH2>Paragraph</TypographyH2>
        <TypographyP>
          This is a paragraph of text. It demonstrates the standard paragraph
          styling with proper line height and spacing. Paragraphs are the
          fundamental building blocks of typography in any design system.
        </TypographyP>
        <TypographyP>
          This is a second paragraph to demonstrate spacing between paragraphs.
          Notice how the paragraphs have appropriate margins to create a
          comfortable reading experience.
        </TypographyP>
      </div>

      <div>
        <TypographyH2>Blockquote</TypographyH2>
        <TypographyBlockquote>
          "Good design is as little design as possible. Less, but better –
          because it concentrates on the essential aspects, and the products are
          not burdened with non-essentials."
          <br />— Dieter Rams
        </TypographyBlockquote>
      </div>

      <div>
        <TypographyH2>List</TypographyH2>
        <TypographyList>
          <li>First item in the list</li>
          <li>Second item in the list</li>
          <li>
            Third item with a nested element:{' '}
            <TypographyInlineCode>code</TypographyInlineCode>
          </li>
          <li>Fourth item in the list</li>
        </TypographyList>
      </div>

      <div>
        <TypographyH2>Inline Code</TypographyH2>
        <TypographyP>
          You can use the{' '}
          <TypographyInlineCode>TypographyInlineCode</TypographyInlineCode>{' '}
          component to highlight code snippets within text.
        </TypographyP>
      </div>

      <div>
        <TypographyH2>Text Styles</TypographyH2>
        <TypographyLarge>Large Text</TypographyLarge>
        <TypographyP>Normal Text</TypographyP>
        <TypographySmall>Small Text</TypographySmall>
        <TypographyMuted>Muted Text</TypographyMuted>
      </div>
    </div>
  ),
};
