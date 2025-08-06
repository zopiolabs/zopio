/**
 * SPDX-License-Identifier: MIT
 */

import {
  Listbox,
  ListboxButton,
  ListboxDivider,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  ListboxSection,
  ListboxSelectedOption,
} from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { type FormEvent, useState } from 'react';

const meta: Meta<typeof Listbox> = {
  title: 'UI/Listbox',
  component: Listbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Listbox>;

// Sample data for stories
const frameworks = [
  { id: 1, name: 'React', icon: '⚛️' },
  { id: 2, name: 'Vue', icon: '🟢' },
  { id: 3, name: 'Angular', icon: '🔴' },
  { id: 4, name: 'Svelte', icon: '🟠' },
  { id: 5, name: 'Solid', icon: '🔵' },
];

const people = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: true },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
];

const categories = [
  {
    name: 'Frontend',
    items: [
      {
        id: 1,
        name: 'React',
        description: 'A JavaScript library for building user interfaces',
      },
      {
        id: 2,
        name: 'Vue',
        description: 'The Progressive JavaScript Framework',
      },
      {
        id: 3,
        name: 'Angular',
        description:
          'Platform for building mobile and desktop web applications',
      },
    ],
  },
  {
    name: 'Backend',
    items: [
      {
        id: 4,
        name: 'Node.js',
        description:
          "JavaScript runtime built on Chrome's V8 JavaScript engine",
      },
      {
        id: 5,
        name: 'Django',
        description: 'The web framework for perfectionists with deadlines',
      },
      {
        id: 6,
        name: 'Laravel',
        description: 'The PHP Framework for Web Artisans',
      },
    ],
  },
];

// Basic example
export const Basic: Story = {
  render: () => {
    const [selected, setSelected] = useState(frameworks[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected}>
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {frameworks.map((framework) => (
              <ListboxOption key={framework.id} value={framework}>
                {framework.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// With icons
export const WithIcons: Story = {
  render: () => {
    const [selected, setSelected] = useState(frameworks[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected}>
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {frameworks.map((framework) => (
              <ListboxOption key={framework.id} value={framework}>
                <span className="mr-2">{framework.icon}</span>
                {framework.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// With disabled options
export const WithDisabledOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState(people[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected}>
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {people.map((person) => (
              <ListboxOption
                key={person.id}
                value={person}
                disabled={person.unavailable}
              >
                {person.name}
                {person.unavailable && (
                  <span className="ml-auto text-muted-foreground text-xs">
                    (Unavailable)
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// Multiple selection
export const MultipleSelection: Story = {
  render: () => {
    const [selectedFrameworks, setSelectedFrameworks] = useState([
      frameworks[0],
      frameworks[2],
    ]);

    return (
      <div className="w-72">
        <Listbox
          multiple
          value={selectedFrameworks}
          onChange={setSelectedFrameworks}
        >
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption placeholder="Select frameworks">
              {selectedFrameworks.map((framework) => (
                <ListboxOption key={framework.id} value={framework}>
                  <span className="mr-2">{framework.icon}</span>
                  {framework.name}
                </ListboxOption>
              ))}
            </ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {frameworks.map((framework) => (
              <ListboxOption key={framework.id} value={framework}>
                <span className="mr-2">{framework.icon}</span>
                {framework.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
        <div className="mt-4 text-sm">
          <p>Selected: {selectedFrameworks.map((f) => f.name).join(', ')}</p>
        </div>
      </div>
    );
  },
};

// With descriptions
export const WithDescriptions: Story = {
  render: () => {
    const [selected, setSelected] = useState(categories[0].items[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected} by="id">
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {categories.flatMap((category) =>
              category.items.map((item) => (
                <ListboxOption key={item.id} value={item}>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {item.description}
                    </div>
                  </div>
                </ListboxOption>
              ))
            )}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// With sections
export const WithSections: Story = {
  render: () => {
    const [selected, setSelected] = useState(categories[0].items[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected} by="id">
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {categories.map((category) => (
              <ListboxSection key={category.name} title={category.name}>
                {category.items.map((item) => (
                  <ListboxOption key={item.id} value={item}>
                    <div>
                      <div>{item.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.description}
                      </div>
                    </div>
                  </ListboxOption>
                ))}
              </ListboxSection>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// With form integration
export const WithFormIntegration: Story = {
  render: () => {
    const [selected, setSelected] = useState(frameworks[0]);
    const [formData, setFormData] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);
      setFormData(JSON.stringify(Object.fromEntries(formData), null, 2));
    };

    return (
      <div className="w-72">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Listbox value={selected} onChange={setSelected} name="framework">
            <ListboxLabel>Select Framework</ListboxLabel>
            <ListboxButton className="w-full justify-between">
              <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 opacity-50"
                aria-label="Dropdown indicator"
              >
                <title>Dropdown indicator</title>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </ListboxButton>
            <ListboxOptions className="w-full">
              {frameworks.map((framework) => (
                <ListboxOption key={framework.id} value={framework}>
                  <span className="mr-2">{framework.icon}</span>
                  {framework.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>

          <button
            type="submit"
            className="flex h-10 items-center justify-between rounded-md border-0 bg-muted px-3 py-2 text-sm shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Submit
          </button>
        </form>

        {formData && (
          <div className="mt-4 rounded-md bg-muted p-4">
            <pre className="text-xs">{formData}</pre>
          </div>
        )}
      </div>
    );
  },
};

// Custom styling
export const CustomStyling: Story = {
  render: () => {
    const [selected, setSelected] = useState(frameworks[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected}>
          <ListboxButton className="w-full justify-between bg-primary text-primary-foreground hover:bg-primary/90">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full border-primary">
            {frameworks.map((framework) => (
              <ListboxOption
                key={framework.id}
                value={framework}
                className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
              >
                <span className="mr-2">{framework.icon}</span>
                {framework.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// Horizontal layout
export const HorizontalLayout: Story = {
  render: () => {
    const [selected, setSelected] = useState(frameworks[0]);

    return (
      <div className="w-96">
        <Listbox value={selected} onChange={setSelected} horizontal>
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="flex w-full p-2">
            {frameworks.map((framework) => (
              <ListboxOption
                key={framework.id}
                value={framework}
                className="flex-1 text-center"
              >
                <div className="flex w-72 flex-col gap-2">
                  <span className="text-xl">{framework.icon}</span>
                  <span>{framework.name}</span>
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// Disabled state
export const DisabledState: Story = {
  render: () => {
    const [selected, setSelected] = useState(frameworks[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected} disabled>
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {frameworks.map((framework) => (
              <ListboxOption key={framework.id} value={framework}>
                <span className="mr-2">{framework.icon}</span>
                {framework.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// With dividers
export const WithDividers: Story = {
  render: () => {
    const [selected, setSelected] = useState(frameworks[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected}>
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            <ListboxOption value={frameworks[0]}>
              <span className="mr-2">{frameworks[0].icon}</span>
              {frameworks[0].name}
            </ListboxOption>
            <ListboxOption value={frameworks[1]}>
              <span className="mr-2">{frameworks[1].icon}</span>
              {frameworks[1].name}
            </ListboxOption>

            <ListboxDivider />
            <ListboxLabel>Other Frameworks</ListboxLabel>

            <ListboxOption value={frameworks[2]}>
              <span className="mr-2">{frameworks[2].icon}</span>
              {frameworks[2].name}
            </ListboxOption>
            <ListboxOption value={frameworks[3]}>
              <span className="mr-2">{frameworks[3].icon}</span>
              {frameworks[3].name}
            </ListboxOption>
            <ListboxOption value={frameworks[4]}>
              <span className="mr-2">{frameworks[4].icon}</span>
              {frameworks[4].name}
            </ListboxOption>
          </ListboxOptions>
        </Listbox>
      </div>
    );
  },
};

// Invalid state
export const InvalidState: Story = {
  render: () => {
    const [selected, setSelected] = useState<
      (typeof frameworks)[0] | undefined
    >(undefined);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected} invalid={!selected}>
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption placeholder="Select a framework (required)">
              {frameworks.map((framework) => (
                <ListboxOption key={framework.id} value={framework}>
                  <span className="mr-2">{framework.icon}</span>
                  {framework.name}
                </ListboxOption>
              ))}
            </ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {frameworks.map((framework) => (
              <ListboxOption key={framework.id} value={framework}>
                <span className="mr-2">{framework.icon}</span>
                {framework.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
        {!selected && (
          <p className="mt-1 text-destructive text-xs">
            Please select a framework
          </p>
        )}
      </div>
    );
  },
};

// Object comparison with 'by' prop
export const ObjectComparison: Story = {
  render: () => {
    // Two separate objects with the same ID
    const frameworksA = [
      { id: 1, name: 'React', version: '18.0.0' },
      { id: 2, name: 'Vue', version: '3.0.0' },
    ];

    const frameworksB = [
      { id: 1, name: 'React', version: '18.2.0' },
      { id: 2, name: 'Vue', version: '3.3.0' },
    ];

    const [selected, setSelected] = useState(frameworksA[0]);

    return (
      <div className="w-72">
        <Listbox value={selected} onChange={setSelected} by="id">
          <ListboxButton className="w-full justify-between">
            <ListboxSelectedOption>{selected.name}</ListboxSelectedOption>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 opacity-50"
              aria-label="Dropdown indicator"
            >
              <title>Dropdown indicator</title>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ListboxButton>
          <ListboxOptions className="w-full">
            {frameworksB.map((framework) => (
              <ListboxOption key={framework.id} value={framework}>
                {framework.name} v{framework.version}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
        <div className="mt-4 text-sm">
          <p>
            Selected: {selected.name} v{selected.version}
          </p>
          <p className="text-muted-foreground text-xs">
            Note: Using 'by="id"' to compare objects with the same ID but
            different versions
          </p>
        </div>
      </div>
    );
  },
};
