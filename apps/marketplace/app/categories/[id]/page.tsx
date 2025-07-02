/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { Download, Search, Star } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data for categories
const categories = {
  analytics: {
    id: 'analytics',
    title: 'Analytics',
    description:
      'Track and visualize your application data with powerful analytics tools',
    count: 24,
  },
  data: {
    id: 'data',
    title: 'Data & Storage',
    description: 'Connect and manage your data sources with ease',
    count: 18,
  },
  'ui-components': {
    id: 'ui-components',
    title: 'UI Components',
    description:
      'Enhance your user interface with beautiful and functional components',
    count: 32,
  },
  // Add more categories as needed
};

// Mock data for plugins by category
const pluginsByCategory = {
  analytics: [
    {
      id: 'analytics-dashboard',
      title: 'Analytics Dashboard',
      description:
        'Comprehensive analytics dashboard for monitoring your Zopio application performance.',
      author: 'Zopio Team',
      category: 'Analytics',
      rating: 4.8,
      downloads: 1250,
    },
    {
      id: 'event-tracker',
      title: 'Event Tracker',
      description:
        'Track user events and interactions in your Zopio application.',
      author: 'AnalyticsHub',
      category: 'Analytics',
      rating: 4.5,
      downloads: 980,
    },
    {
      id: 'data-visualizer',
      title: 'Data Visualizer',
      description:
        'Create beautiful charts and graphs from your application data.',
      author: 'ChartMaster',
      category: 'Analytics',
      rating: 4.7,
      downloads: 1120,
    },
    {
      id: 'user-flow-analyzer',
      title: 'User Flow Analyzer',
      description:
        'Analyze user journeys and conversion funnels in your application.',
      author: 'FlowInsights',
      category: 'Analytics',
      rating: 4.6,
      downloads: 850,
    },
    {
      id: 'performance-monitor',
      title: 'Performance Monitor',
      description:
        "Monitor and optimize your application's performance metrics.",
      author: 'SpeedOptimize',
      category: 'Analytics',
      rating: 4.4,
      downloads: 760,
    },
    {
      id: 'ab-testing',
      title: 'A/B Testing',
      description:
        "Run A/B tests to optimize your application's user experience.",
      author: 'TestMaster',
      category: 'Analytics',
      rating: 4.9,
      downloads: 1350,
    },
  ],
  data: [
    {
      id: 'data-connector',
      title: 'Data Connector',
      description:
        'Connect to various data sources and integrate them with your Zopio applications.',
      author: 'DataSync',
      category: 'Data & Storage',
      rating: 4.6,
      downloads: 980,
    },
    // Add more data plugins
  ],
  'ui-components': [
    {
      id: 'form-builder',
      title: 'Form Builder',
      description:
        'Drag and drop form builder with validation and submission handling.',
      author: 'FormCraft',
      category: 'UI Components',
      rating: 4.9,
      downloads: 2100,
    },
    // Add more UI component plugins
  ],
  // Add more categories
};

export async function generateMetadata({
  params,
}: { params: { id: string } }): Promise<Metadata> {
  const categoryId = params.id;
  const category = categories[categoryId as keyof typeof categories];

  // Add await to satisfy linter - in a real app this might fetch data
  await Promise.resolve();

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.title} Plugins`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: { params: { id: string } }) {
  const categoryId = params.id;
  const category = categories[categoryId as keyof typeof categories];

  // Add await to satisfy linter - in a real app this might fetch data
  await Promise.resolve();

  if (!category) {
    notFound();
  }

  const plugins =
    pluginsByCategory[categoryId as keyof typeof pluginsByCategory] || [];

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">{category.title} Plugins</h1>
        <p className="mt-2 text-muted-foreground">{category.description}</p>
      </div>

      <div className="flex flex-col gap-4 mb-8 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute -translate-y-1/2 h-4 left-3 text-muted-foreground top-1/2 w-4" />
          <Input
            className="pl-10"
            placeholder={`Search ${category.title.toLowerCase()} plugins...`}
          />
        </div>

        <div className="flex gap-4">
          <Select defaultValue="popular">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="downloads">Most Downloads</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing {plugins.length} plugins
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plugins.map((plugin) => (
          <Card className="overflow-hidden" key={plugin.id}>
            <div className="relative aspect-video bg-muted">
              <div className="flex h-full items-center justify-center bg-secondary font-bold text-4xl">
                {plugin.title.charAt(0)}
              </div>
            </div>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-1 text-lg">
                  {plugin.title}
                </CardTitle>
                <Badge variant="outline">{plugin.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2 text-xs">
                {plugin.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center text-muted-foreground text-sm">
                <span>By {plugin.author}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
                  <span>{plugin.rating}</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Download className="mr-1 h-3 w-3" />
                  <span>{plugin.downloads}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/plugins/${plugin.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {plugins.length > 8 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}
