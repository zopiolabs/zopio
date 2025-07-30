/**
 * SPDX-License-Identifier: MIT
 */

import { Button } from '@repo/design-system/ui/button';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarItems,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@repo/design-system/ui/navbar';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof Navbar> = {
  title: 'UI/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

/**
 * Default navbar with brand, items, and responsive menu.
 */
export const Default: Story = {
  render: () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <Navbar>
        <NavbarContent>
          <NavbarBrand>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
              aria-label="Zopio Logo"
            >
              <title>Zopio Logo</title>
              <rect width="32" height="32" rx="16" fill="currentColor" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="white"
              />
            </svg>
            <span className="font-bold text-xl">Zopio</span>
          </NavbarBrand>

          <NavbarMenuToggle
            className="md:hidden"
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          <NavbarContent className="hidden md:flex">
            <NavbarItems>
              <NavbarItem active>Home</NavbarItem>
              <NavbarItem>Features</NavbarItem>
              <NavbarItem>Pricing</NavbarItem>
              <NavbarItem>About</NavbarItem>
              <NavbarItem>Contact</NavbarItem>
            </NavbarItems>
          </NavbarContent>

          <NavbarContent className="hidden md:flex" justify="end">
            <NavbarItems>
              <NavbarItem>
                <Button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                  Sign Up
                </Button>
              </NavbarItem>
            </NavbarItems>
          </NavbarContent>
        </NavbarContent>

        <NavbarMenu isOpen={isMenuOpen}>
          <NavbarMenuItem active>Home</NavbarMenuItem>
          <NavbarMenuItem>Features</NavbarMenuItem>
          <NavbarMenuItem>Pricing</NavbarMenuItem>
          <NavbarMenuItem>About</NavbarMenuItem>
          <NavbarMenuItem>Contact</NavbarMenuItem>
          <NavbarMenuItem>
            <Button className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground">
              Sign Up
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    );
  },
};

/**
 * Bordered navbar variant.
 */
export const Bordered: Story = {
  render: () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <Navbar variant="bordered">
        <NavbarContent>
          <NavbarBrand>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
              aria-label="Zopio Logo"
            >
              <title>Zopio Logo</title>
              <rect width="32" height="32" rx="16" fill="currentColor" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="white"
              />
            </svg>
            <span className="font-bold text-xl">Zopio</span>
          </NavbarBrand>

          <NavbarMenuToggle
            className="md:hidden"
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          <NavbarContent className="hidden md:flex">
            <NavbarItems>
              <NavbarItem active>Home</NavbarItem>
              <NavbarItem>Features</NavbarItem>
              <NavbarItem>Pricing</NavbarItem>
              <NavbarItem>About</NavbarItem>
              <NavbarItem>Contact</NavbarItem>
            </NavbarItems>
          </NavbarContent>
        </NavbarContent>

        <NavbarMenu isOpen={isMenuOpen}>
          <NavbarMenuItem active>Home</NavbarMenuItem>
          <NavbarMenuItem>Features</NavbarMenuItem>
          <NavbarMenuItem>Pricing</NavbarMenuItem>
          <NavbarMenuItem>About</NavbarMenuItem>
          <NavbarMenuItem>Contact</NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    );
  },
};

/**
 * Transparent navbar variant.
 */
export const Transparent: Story = {
  render: () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <div className="min-h-[200px] bg-gradient-to-r from-blue-500 to-purple-500 p-4">
        <Navbar variant="transparent">
          <NavbarContent>
            <NavbarBrand>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                aria-label="Zopio Logo"
              >
                <title>Zopio Logo</title>
                <rect
                  width="32"
                  height="32"
                  rx="16"
                  fill="white"
                  aria-label="Logo background"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                  fill="black"
                />
              </svg>
              <span className="font-bold text-white text-xl">Zopio</span>
            </NavbarBrand>

            <NavbarMenuToggle
              className="text-white md:hidden"
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            <NavbarContent className="hidden md:flex">
              <NavbarItems>
                <NavbarItem active className="text-white">
                  Home
                </NavbarItem>
                <NavbarItem className="text-white/70 hover:text-white">
                  Features
                </NavbarItem>
                <NavbarItem className="text-white/70 hover:text-white">
                  Pricing
                </NavbarItem>
                <NavbarItem className="text-white/70 hover:text-white">
                  About
                </NavbarItem>
                <NavbarItem className="text-white/70 hover:text-white">
                  Contact
                </NavbarItem>
              </NavbarItems>
            </NavbarContent>
          </NavbarContent>

          <NavbarMenu
            isOpen={isMenuOpen}
            className="mt-2 rounded-lg bg-white/10 backdrop-blur-md"
          >
            <NavbarMenuItem active className="text-white">
              Home
            </NavbarMenuItem>
            <NavbarMenuItem className="text-white/70 hover:text-white">
              Features
            </NavbarMenuItem>
            <NavbarMenuItem className="text-white/70 hover:text-white">
              Pricing
            </NavbarMenuItem>
            <NavbarMenuItem className="text-white/70 hover:text-white">
              About
            </NavbarMenuItem>
            <NavbarMenuItem className="text-white/70 hover:text-white">
              Contact
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </div>
    );
  },
};

/**
 * Fixed navbar with blur effect.
 */
export const FixedWithBlur: Story = {
  render: () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <div className="relative min-h-[500px]">
        <Navbar fixed blurred>
          <NavbarContent>
            <NavbarBrand>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                aria-label="Zopio Logo"
              >
                <title>Zopio Logo</title>
                <rect width="32" height="32" rx="16" fill="currentColor" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                  fill="white"
                />
              </svg>
              <span className="font-bold text-xl">Zopio</span>
            </NavbarBrand>

            <NavbarMenuToggle
              className="md:hidden"
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            <NavbarContent className="hidden md:flex">
              <NavbarItems>
                <NavbarItem active>Home</NavbarItem>
                <NavbarItem>Features</NavbarItem>
                <NavbarItem>Pricing</NavbarItem>
                <NavbarItem>About</NavbarItem>
                <NavbarItem>Contact</NavbarItem>
              </NavbarItems>
            </NavbarContent>
          </NavbarContent>

          <NavbarMenu isOpen={isMenuOpen}>
            <NavbarMenuItem active>Home</NavbarMenuItem>
            <NavbarMenuItem>Features</NavbarMenuItem>
            <NavbarMenuItem>Pricing</NavbarMenuItem>
            <NavbarMenuItem>About</NavbarMenuItem>
            <NavbarMenuItem>Contact</NavbarMenuItem>
          </NavbarMenu>
        </Navbar>

        <div className="p-4 pt-16">
          <h1 className="font-bold text-2xl">Content Below Fixed Navbar</h1>
          <p className="mt-2">
            The navbar stays fixed at the top with a blur effect.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Navbar with hide on scroll behavior.
 */
export const HideOnScroll: Story = {
  render: () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <div className="relative min-h-[500px]">
        <Navbar hideOnScroll>
          <NavbarContent>
            <NavbarBrand>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                aria-label="Zopio Logo"
              >
                <title>Zopio Logo</title>
                <rect width="32" height="32" rx="16" fill="currentColor" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                  fill="white"
                />
              </svg>
              <span className="font-bold text-xl">Zopio</span>
            </NavbarBrand>

            <NavbarMenuToggle
              className="md:hidden"
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            <NavbarContent className="hidden md:flex">
              <NavbarItems>
                <NavbarItem active>Home</NavbarItem>
                <NavbarItem>Features</NavbarItem>
                <NavbarItem>Pricing</NavbarItem>
                <NavbarItem>About</NavbarItem>
                <NavbarItem>Contact</NavbarItem>
              </NavbarItems>
            </NavbarContent>
          </NavbarContent>

          <NavbarMenu isOpen={isMenuOpen}>
            <NavbarMenuItem active>Home</NavbarMenuItem>
            <NavbarMenuItem>Features</NavbarMenuItem>
            <NavbarMenuItem>Pricing</NavbarMenuItem>
            <NavbarMenuItem>About</NavbarMenuItem>
            <NavbarMenuItem>Contact</NavbarMenuItem>
          </NavbarMenu>
        </Navbar>

        <div className="p-4">
          <h1 className="font-bold text-2xl">Scroll Down</h1>
          <p className="mt-2">
            The navbar will hide when scrolling down and reappear when scrolling
            up.
          </p>

          {/* Add content to enable scrolling */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="my-8">
              <h2 className="font-semibold text-xl">Section {i + 1}</h2>
              <p className="mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc,
                quis aliquam nisl nunc quis nisl.
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Navbar with different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 font-medium text-lg">Small</h2>
        <Navbar size="sm">
          <NavbarContent>
            <NavbarBrand>
              <span className="font-bold">Zopio</span>
            </NavbarBrand>

            <NavbarContent className="hidden md:flex">
              <NavbarItems>
                <NavbarItem active>Home</NavbarItem>
                <NavbarItem>Features</NavbarItem>
                <NavbarItem>Pricing</NavbarItem>
              </NavbarItems>
            </NavbarContent>
          </NavbarContent>
        </Navbar>
      </div>

      <div>
        <h2 className="mb-2 font-medium text-lg">Medium (Default)</h2>
        <Navbar>
          <NavbarContent>
            <NavbarBrand>
              <span className="font-bold">Zopio</span>
            </NavbarBrand>

            <NavbarContent className="hidden md:flex">
              <NavbarItems>
                <NavbarItem active>Home</NavbarItem>
                <NavbarItem>Features</NavbarItem>
                <NavbarItem>Pricing</NavbarItem>
              </NavbarItems>
            </NavbarContent>
          </NavbarContent>
        </Navbar>
      </div>

      <div>
        <h2 className="mb-2 font-medium text-lg">Large</h2>
        <Navbar size="lg">
          <NavbarContent>
            <NavbarBrand>
              <span className="font-bold">Zopio</span>
            </NavbarBrand>

            <NavbarContent className="hidden md:flex">
              <NavbarItems>
                <NavbarItem active>Home</NavbarItem>
                <NavbarItem>Features</NavbarItem>
                <NavbarItem>Pricing</NavbarItem>
              </NavbarItems>
            </NavbarContent>
          </NavbarContent>
        </Navbar>
      </div>
    </div>
  ),
};

/**
 * Navbar with search input.
 */
export const WithSearch: Story = {
  render: () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <Navbar>
        <NavbarContent>
          <NavbarBrand>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
              aria-label="Zopio Logo"
            >
              <title>Zopio Logo</title>
              <rect width="32" height="32" rx="16" fill="currentColor" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="white"
              />
            </svg>
            <span className="font-bold text-xl">Zopio</span>
          </NavbarBrand>

          <NavbarMenuToggle
            className="md:hidden"
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          <NavbarContent className="hidden md:flex" justify="center">
            <div className="relative w-full max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="-translate-y-1/2 absolute top-1/2 left-3 text-foreground/60"
                aria-hidden="true"
              >
                <title>Search Icon</title>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full border border-border bg-background/10 px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </NavbarContent>

          <NavbarContent className="hidden md:flex" justify="end">
            <NavbarItems>
              <NavbarItem>
                <button
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                  type="button"
                >
                  Sign Up
                </button>
              </NavbarItem>
            </NavbarItems>
          </NavbarContent>
        </NavbarContent>

        <NavbarMenu isOpen={isMenuOpen}>
          <div className="relative mb-4 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="-translate-y-1/2 absolute top-1/2 left-3 text-foreground/60"
              aria-hidden="true"
            >
              <title>Search Icon</title>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full border border-border bg-background/10 px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <NavbarMenuItem active>Home</NavbarMenuItem>
          <NavbarMenuItem>Features</NavbarMenuItem>
          <NavbarMenuItem>Pricing</NavbarMenuItem>
          <NavbarMenuItem>About</NavbarMenuItem>
          <NavbarMenuItem>Contact</NavbarMenuItem>
          <NavbarMenuItem>
            <button
              className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground"
              type="button"
            >
              Sign Up
            </button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    );
  },
};
