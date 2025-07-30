/**
 * SPDX-License-Identifier: MIT
 */

import type * as nextjs from '@storybook/nextjs';
import {
  LucideBookOpen,
  LucideCode,
  LucideGithub,
  LucideGlobe,
  LucideHeadphones,
  LucideHeart,
  LucideHome,
  LucideLifeBuoy,
  LucidePackage,
  LucideSettings,
  LucideShield,
  LucideShoppingCart,
  LucideTwitter,
  LucideUser,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  MegaMenu,
  MegaMenuColumn,
  MegaMenuContent,
  MegaMenuDivider,
  MegaMenuFooter,
  MegaMenuItem,
  MegaMenuSection,
  MegaMenuTrigger,
} from '@repo/design-system/ui/mega-menu';
import Link from 'next/link';

/**
 * Mega Menu component for complex navigation structures.
 * Provides a full-width dropdown with multiple columns and sections.
 */
const meta: nextjs.Meta<typeof MegaMenu> = {
  title: 'ui/MegaMenu',
  component: MegaMenu,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'floating'],
      description: 'The visual style variant of the mega menu',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'The size of the mega menu',
      table: {
        defaultValue: { summary: 'full' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Whether the mega menu is open',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = nextjs.StoryObj<typeof meta>;

/**
 * Basic mega menu with a single column of links.
 */
export const Basic: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex h-16 w-full items-center justify-center bg-background px-4">
        <MegaMenu
          {...args}
          open={isOpen}
          onOpenChange={setIsOpen}
          className="relative"
        >
          <MegaMenuTrigger onClick={() => setIsOpen(!isOpen)}>
            Products
          </MegaMenuTrigger>
          <MegaMenuContent className="p-4">
            <div className="grid gap-4">
              <MegaMenuColumn title="Popular Products">
                <MegaMenuItem icon={<LucidePackage />}>
                  Product One
                </MegaMenuItem>
                <MegaMenuItem icon={<LucidePackage />}>
                  Product Two
                </MegaMenuItem>
                <MegaMenuItem icon={<LucidePackage />}>
                  Product Three
                </MegaMenuItem>
                <MegaMenuItem icon={<LucidePackage />}>
                  Product Four
                </MegaMenuItem>
              </MegaMenuColumn>
            </div>
          </MegaMenuContent>
        </MegaMenu>
      </div>
    );
  },
};

/**
 * Multi-column mega menu with sections and icons.
 */
export const MultiColumn: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex h-16 w-full items-center justify-center bg-background px-4">
        <MegaMenu
          {...args}
          open={isOpen}
          onOpenChange={setIsOpen}
          className="relative"
        >
          <MegaMenuTrigger onClick={() => setIsOpen(!isOpen)}>
            Solutions
          </MegaMenuTrigger>
          <MegaMenuContent className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <MegaMenuColumn title="Products" width="1/4">
                <MegaMenuItem
                  icon={<LucidePackage />}
                  description="Our flagship product suite"
                >
                  Enterprise Solutions
                </MegaMenuItem>
                <MegaMenuItem
                  icon={<LucideShield />}
                  description="Security and compliance tools"
                >
                  Security Suite
                </MegaMenuItem>
                <MegaMenuItem
                  icon={<LucideGlobe />}
                  description="Global infrastructure services"
                >
                  Cloud Platform
                </MegaMenuItem>
                <MegaMenuItem
                  icon={<LucideCode />}
                  description="Developer tools and APIs"
                >
                  Developer Tools
                </MegaMenuItem>
              </MegaMenuColumn>

              <MegaMenuColumn title="Industries" width="1/4">
                <MegaMenuItem>Healthcare</MegaMenuItem>
                <MegaMenuItem>Finance</MegaMenuItem>
                <MegaMenuItem>Education</MegaMenuItem>
                <MegaMenuItem>Manufacturing</MegaMenuItem>
                <MegaMenuItem>Retail</MegaMenuItem>
              </MegaMenuColumn>

              <MegaMenuColumn title="Resources" width="1/4">
                <MegaMenuItem icon={<LucideBookOpen />}>
                  Documentation
                </MegaMenuItem>
                <MegaMenuItem icon={<LucideHeadphones />}>Support</MegaMenuItem>
                <MegaMenuItem icon={<LucideLifeBuoy />}>Community</MegaMenuItem>
                <MegaMenuItem icon={<LucideGithub />}>GitHub</MegaMenuItem>
              </MegaMenuColumn>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-medium text-sm">Get Started Today</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Our platform helps you build better products faster.
                </p>
                <Button size="sm">Learn More</Button>
              </div>
            </div>

            <MegaMenuFooter>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <Link href="#" className="hover:text-foreground">
                  Terms
                </Link>
                <Link className="hover:text-foreground" href={'#'}>
                  Privacy
                </Link>
                <Link className="hover:text-foreground" href={'#'}>
                  Cookies
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link className="rounded-full p-2 hover:bg-muted" href={'#'}>
                  <LucideTwitter className="h-4 w-4" />
                </Link>
                <Link className="rounded-full p-2 hover:bg-muted" href={'#'}>
                  <LucideGithub className="h-4 w-4" />
                </Link>
              </div>
            </MegaMenuFooter>
          </MegaMenuContent>
        </MegaMenu>
      </div>
    );
  },
};

/**
 * Full navigation bar with multiple mega menus.
 */
export const NavigationBar: Story = {
  render: () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleMenuToggle = (menuId: string) => {
      setActiveMenu(activeMenu === menuId ? null : menuId);
    };

    return (
      <div className="flex h-16 w-full items-center justify-between bg-background px-4 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-bold">Z</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1">
            <MegaMenu
              open={activeMenu === 'products'}
              onOpenChange={(open) =>
                open ? handleMenuToggle('products') : setActiveMenu(null)
              }
            >
              <MegaMenuTrigger onClick={() => handleMenuToggle('products')}>
                Products
              </MegaMenuTrigger>
              <MegaMenuContent className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <MegaMenuColumn title="By Category">
                    <MegaMenuItem icon={<LucidePackage />}>
                      Analytics
                    </MegaMenuItem>
                    <MegaMenuItem icon={<LucideShield />}>
                      Security
                    </MegaMenuItem>
                    <MegaMenuItem icon={<LucideGlobe />}>
                      Collaboration
                    </MegaMenuItem>
                    <MegaMenuItem icon={<LucideCode />}>
                      Development
                    </MegaMenuItem>
                  </MegaMenuColumn>

                  <MegaMenuColumn title="By Role">
                    <MegaMenuItem>Developers</MegaMenuItem>
                    <MegaMenuItem>Designers</MegaMenuItem>
                    <MegaMenuItem>Product Managers</MegaMenuItem>
                    <MegaMenuItem>Enterprise</MegaMenuItem>
                  </MegaMenuColumn>

                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="mb-2 font-medium text-sm">
                      Featured Product
                    </h3>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Our new analytics platform is now available.
                    </p>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </MegaMenuContent>
            </MegaMenu>

            <MegaMenu
              open={activeMenu === 'solutions'}
              onOpenChange={(open) =>
                open ? handleMenuToggle('solutions') : setActiveMenu(null)
              }
            >
              <MegaMenuTrigger onClick={() => handleMenuToggle('solutions')}>
                Solutions
              </MegaMenuTrigger>
              <MegaMenuContent className="p-6">
                <div className="grid grid-cols-4 gap-6">
                  <MegaMenuColumn title="By Industry" width="1/4">
                    <MegaMenuItem>Healthcare</MegaMenuItem>
                    <MegaMenuItem>Finance</MegaMenuItem>
                    <MegaMenuItem>Education</MegaMenuItem>
                    <MegaMenuItem>Manufacturing</MegaMenuItem>
                  </MegaMenuColumn>

                  <MegaMenuColumn title="By Need" width="1/4">
                    <MegaMenuItem>Data Analysis</MegaMenuItem>
                    <MegaMenuItem>Automation</MegaMenuItem>
                    <MegaMenuItem>Compliance</MegaMenuItem>
                    <MegaMenuItem>Collaboration</MegaMenuItem>
                  </MegaMenuColumn>

                  <MegaMenuColumn title="Case Studies" width="1/4">
                    <MegaMenuItem>Enterprise Success</MegaMenuItem>
                    <MegaMenuItem>Startup Growth</MegaMenuItem>
                    <MegaMenuItem>Healthcare Innovation</MegaMenuItem>
                    <MegaMenuItem>View All</MegaMenuItem>
                  </MegaMenuColumn>

                  <MegaMenuColumn title="Resources" width="1/4">
                    <MegaMenuItem icon={<LucideBookOpen />}>
                      Documentation
                    </MegaMenuItem>
                    <MegaMenuItem icon={<LucideHeadphones />}>
                      Support
                    </MegaMenuItem>
                    <MegaMenuItem icon={<LucideLifeBuoy />}>
                      Community
                    </MegaMenuItem>
                  </MegaMenuColumn>
                </div>
              </MegaMenuContent>
            </MegaMenu>

            <MegaMenu
              open={activeMenu === 'resources'}
              onOpenChange={(open) =>
                open ? handleMenuToggle('resources') : setActiveMenu(null)
              }
            >
              <MegaMenuTrigger onClick={() => handleMenuToggle('resources')}>
                Resources
              </MegaMenuTrigger>
              <MegaMenuContent className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <MegaMenuColumn title="Documentation">
                    <MegaMenuItem>Getting Started</MegaMenuItem>
                    <MegaMenuItem>API Reference</MegaMenuItem>
                    <MegaMenuItem>Components</MegaMenuItem>
                    <MegaMenuItem>Examples</MegaMenuItem>
                  </MegaMenuColumn>

                  <MegaMenuColumn title="Community">
                    <MegaMenuItem icon={<LucideGithub />}>GitHub</MegaMenuItem>
                    <MegaMenuItem icon={<LucideTwitter />}>
                      Twitter
                    </MegaMenuItem>
                    <MegaMenuItem icon={<LucideLifeBuoy />}>
                      Forums
                    </MegaMenuItem>
                    <MegaMenuItem icon={<LucideHeadphones />}>
                      Discord
                    </MegaMenuItem>
                  </MegaMenuColumn>

                  <MegaMenuColumn title="Resources">
                    <MegaMenuItem>Blog</MegaMenuItem>
                    <MegaMenuItem>Tutorials</MegaMenuItem>
                    <MegaMenuItem>Webinars</MegaMenuItem>
                    <MegaMenuItem>Newsletter</MegaMenuItem>
                  </MegaMenuColumn>
                </div>
              </MegaMenuContent>
            </MegaMenu>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <LucideUser className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * E-commerce mega menu with product categories and featured items.
 */
export const ECommerce: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex h-16 w-full items-center justify-center bg-background px-4">
        <MegaMenu
          {...args}
          open={isOpen}
          onOpenChange={setIsOpen}
          className="relative"
          variant="bordered"
        >
          <MegaMenuTrigger onClick={() => setIsOpen(!isOpen)}>
            Shop Categories
          </MegaMenuTrigger>
          <MegaMenuContent className="p-6" withBackdrop>
            <div className="grid grid-cols-5 gap-6">
              <MegaMenuColumn title="Clothing" width="1/4">
                <MegaMenuItem>Men's</MegaMenuItem>
                <MegaMenuItem>Women's</MegaMenuItem>
                <MegaMenuItem>Kids</MegaMenuItem>
                <MegaMenuItem>Accessories</MegaMenuItem>
                <MegaMenuItem>View All</MegaMenuItem>
              </MegaMenuColumn>

              <MegaMenuColumn title="Electronics" width="1/4">
                <MegaMenuItem>Phones</MegaMenuItem>
                <MegaMenuItem>Laptops</MegaMenuItem>
                <MegaMenuItem>Tablets</MegaMenuItem>
                <MegaMenuItem>Accessories</MegaMenuItem>
                <MegaMenuItem>View All</MegaMenuItem>
              </MegaMenuColumn>

              <MegaMenuColumn title="Home" width="1/4">
                <MegaMenuItem>Kitchen</MegaMenuItem>
                <MegaMenuItem>Furniture</MegaMenuItem>
                <MegaMenuItem>Decor</MegaMenuItem>
                <MegaMenuItem>Bedding</MegaMenuItem>
                <MegaMenuItem>View All</MegaMenuItem>
              </MegaMenuColumn>

              <div className="col-span-2 grid gap-4">
                <h3 className="font-medium text-sm">Featured Products</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="overflow-hidden rounded-md">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-2">
                      <h4 className="font-medium text-sm">New Arrivals</h4>
                      <p className="text-muted-foreground text-xs">
                        Summer Collection
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-md">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-2">
                      <h4 className="font-medium text-sm">Best Sellers</h4>
                      <p className="text-muted-foreground text-xs">
                        Top Products
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <LucideShoppingCart className="mr-2 h-4 w-4" />
                  View All Products
                </Button>
              </div>
            </div>

            <MegaMenuDivider className="my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">Quick Links:</span>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sale
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  New Arrivals
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Gift Cards
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <LucideHeart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button variant="ghost" size="sm">
                  <LucideShoppingCart className="mr-2 h-4 w-4" />
                  Cart (0)
                </Button>
              </div>
            </div>
          </MegaMenuContent>
        </MegaMenu>
      </div>
    );
  },
};

/**
 * Variants showcase for the mega menu.
 */
export const Variants: Story = {
  render: () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (id: string) => {
      setOpenMenu(openMenu === id ? null : id);
    };

    return (
      <div className="flex flex-col gap-8 p-4">
        <div>
          <h3 className="mb-4 font-medium text-sm">Default Variant</h3>
          <MegaMenu
            open={openMenu === 'default'}
            onOpenChange={(open) =>
              open ? toggleMenu('default') : setOpenMenu(null)
            }
          >
            <MegaMenuTrigger onClick={() => toggleMenu('default')}>
              Default Menu
            </MegaMenuTrigger>
            <MegaMenuContent className="p-4">
              <div className="grid gap-4">
                <MegaMenuColumn title="Menu Items">
                  <MegaMenuItem>Item One</MegaMenuItem>
                  <MegaMenuItem>Item Two</MegaMenuItem>
                  <MegaMenuItem>Item Three</MegaMenuItem>
                </MegaMenuColumn>
              </div>
            </MegaMenuContent>
          </MegaMenu>
        </div>

        <div>
          <h3 className="mb-4 font-medium text-sm">Bordered Variant</h3>
          <MegaMenu
            variant="bordered"
            open={openMenu === 'bordered'}
            onOpenChange={(open) =>
              open ? toggleMenu('bordered') : setOpenMenu(null)
            }
          >
            <MegaMenuTrigger onClick={() => toggleMenu('bordered')}>
              Bordered Menu
            </MegaMenuTrigger>
            <MegaMenuContent className="p-4">
              <div className="grid gap-4">
                <MegaMenuColumn title="Menu Items">
                  <MegaMenuItem>Item One</MegaMenuItem>
                  <MegaMenuItem>Item Two</MegaMenuItem>
                  <MegaMenuItem>Item Three</MegaMenuItem>
                </MegaMenuColumn>
              </div>
            </MegaMenuContent>
          </MegaMenu>
        </div>

        <div>
          <h3 className="mb-4 font-medium text-sm">Floating Variant</h3>
          <MegaMenu
            variant="floating"
            open={openMenu === 'floating'}
            onOpenChange={(open) =>
              open ? toggleMenu('floating') : setOpenMenu(null)
            }
          >
            <MegaMenuTrigger onClick={() => toggleMenu('floating')}>
              Floating Menu
            </MegaMenuTrigger>
            <MegaMenuContent className="p-4">
              <div className="grid gap-4">
                <MegaMenuColumn title="Menu Items">
                  <MegaMenuItem>Item One</MegaMenuItem>
                  <MegaMenuItem>Item Two</MegaMenuItem>
                  <MegaMenuItem>Item Three</MegaMenuItem>
                </MegaMenuColumn>
              </div>
            </MegaMenuContent>
          </MegaMenu>
        </div>
      </div>
    );
  },
};

/**
 * Mega menu with rich content including images and interactive elements.
 */
export const RichContent: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex h-16 w-full items-center justify-center bg-background px-4">
        <MegaMenu
          {...args}
          open={isOpen}
          onOpenChange={setIsOpen}
          className="relative"
          variant="floating"
        >
          <MegaMenuTrigger onClick={() => setIsOpen(!isOpen)}>
            Features
          </MegaMenuTrigger>
          <MegaMenuContent className="p-6" withBackdrop>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 grid grid-cols-2 gap-6">
                <MegaMenuSection title="Platform Features">
                  <MegaMenuItem
                    icon={<LucidePackage />}
                    description="Build and deploy applications"
                  >
                    Development
                  </MegaMenuItem>
                  <MegaMenuItem
                    icon={<LucideShield />}
                    description="Secure your applications"
                  >
                    Security
                  </MegaMenuItem>
                  <MegaMenuItem
                    icon={<LucideGlobe />}
                    description="Scale globally with ease"
                  >
                    Infrastructure
                  </MegaMenuItem>
                  <MegaMenuItem
                    icon={<LucideCode />}
                    description="Powerful APIs and integrations"
                  >
                    Integrations
                  </MegaMenuItem>
                </MegaMenuSection>

                <MegaMenuSection title="Solutions">
                  <MegaMenuItem
                    icon={<LucideHeadphones />}
                    description="24/7 expert support"
                  >
                    Enterprise Support
                  </MegaMenuItem>
                  <MegaMenuItem
                    icon={<LucideLifeBuoy />}
                    description="Training and certification"
                  >
                    Learning Resources
                  </MegaMenuItem>
                  <MegaMenuItem
                    icon={<LucideSettings />}
                    description="Customized implementations"
                  >
                    Professional Services
                  </MegaMenuItem>
                  <MegaMenuItem
                    icon={<LucideHome />}
                    description="Self-hosted deployment options"
                  >
                    On-Premise Solutions
                  </MegaMenuItem>
                </MegaMenuSection>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-6">
                <h3 className="mb-2 font-medium text-lg">Get Started Today</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Join thousands of companies that trust our platform for their
                  critical infrastructure.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>Free 30-day trial</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">Free 30-day trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>No credit card required</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <title>Cancel anytime</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">Cancel anytime</span>
                  </div>
                </div>
                <Button className="mt-6 w-full">Start Free Trial</Button>
              </div>
            </div>
          </MegaMenuContent>
        </MegaMenu>
      </div>
    );
  },
};
