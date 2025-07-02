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
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@repo/design-system/components/ui/button";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs";
import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { Download, Github, Star, Calendar, User } from "lucide-react";

// Mock data for plugins - in a real app, this would come from an API or database
const plugins = {
  "analytics-dashboard": {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Comprehensive analytics dashboard for monitoring your Zopio application performance.",
    longDescription: "This plugin provides a full-featured analytics dashboard that helps you track and visualize your application's performance metrics. It includes real-time monitoring, custom reports, and alerting capabilities to ensure you always have insight into how your application is performing.",
    author: "Zopio Team",
    authorUrl: "https://github.com/zopioteam",
    category: "Analytics",
    rating: 4.8,
    downloads: 1250,
    version: "1.2.0",
    lastUpdated: "2025-06-15",
    githubUrl: "https://github.com/zopioteam/analytics-dashboard",
    tags: ["analytics", "dashboard", "monitoring", "charts"],
    installation: "npm install @repo/plugin-analytics-dashboard",
    usage: `
import { AnalyticsDashboard } from '@repo/plugin-analytics-dashboard';

export default function MyDashboard() {
  return (
    <AnalyticsDashboard 
      apiKey="your-api-key"
      projectId="your-project-id"
    />
  );
}`,
    screenshots: [
      "/images/plugins/analytics-dashboard-1.png",
      "/images/plugins/analytics-dashboard-2.png",
    ],
  },
  "data-connector": {
    id: "data-connector",
    title: "Data Connector",
    description: "Connect to various data sources and integrate them with your Zopio applications.",
    longDescription: "The Data Connector plugin allows you to easily connect your Zopio application to various data sources including SQL databases, NoSQL databases, REST APIs, and more. It provides a unified interface for data access and manipulation, making it simple to integrate external data into your application.",
    author: "DataSync",
    authorUrl: "https://github.com/datasync",
    category: "Integration",
    rating: 4.6,
    downloads: 980,
    version: "2.1.3",
    lastUpdated: "2025-06-01",
    githubUrl: "https://github.com/datasync/data-connector",
    tags: ["data", "integration", "connector", "api"],
    installation: "npm install @repo/plugin-data-connector",
    usage: `
import { createConnector } from '@repo/plugin-data-connector';

const mysqlConnector = createConnector({
  type: 'mysql',
  config: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'mydb'
  }
});

// Use the connector
const data = await mysqlConnector.query('SELECT * FROM users');`,
    screenshots: [
      "/images/plugins/data-connector-1.png",
      "/images/plugins/data-connector-2.png",
    ],
  },
  // Add more plugins as needed
};

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const pluginId = params.id;
  const plugin = plugins[pluginId as keyof typeof plugins];
  
  if (!plugin) {
    return {
      title: "Plugin Not Found",
    };
  }
  
  return {
    title: plugin.title,
    description: plugin.description,
  };
}

export default function PluginPage({ params }: { params: { id: string } }) {
  const pluginId = params.id;
  const plugin = plugins[pluginId as keyof typeof plugins];
  
  if (!plugin) {
    notFound();
  }
  
  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{plugin.title}</h1>
              <Badge variant="outline">{plugin.category}</Badge>
            </div>
            
            <p className="text-muted-foreground">{plugin.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 mr-1 w-4" />
                <Link href={plugin.authorUrl} className="hover:underline">
                  {plugin.author}
                </Link>
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{plugin.rating}</span>
              </div>
              <div className="flex items-center">
                <Download className="mr-1 h-4 w-4" />
                <span>{plugin.downloads} downloads</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Updated {plugin.lastUpdated}</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div>
                <h2 className="mb-2 font-semibold text-xl">Description</h2>
                <p>{plugin.longDescription}</p>
              </div>
              
              <div>
                <h2 className="mb-2 font-semibold text-xl">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {plugin.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="installation" className="mt-4 space-y-4">
              <div>
                <h2 className="mb-2 text-xl font-semibold">Installation</h2>
                <Card>
                  <CardContent className="p-4 font-mono text-sm">
                    {plugin.installation}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className="mb-2 text-xl font-semibold">Usage</h2>
                <Card>
                  <CardContent className="font-mono p-4 text-sm whitespace-pre">
                    {plugin.usage}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="screenshots" className="mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {plugin.screenshots.map((_, index) => (
                  <div key={index} className="bg-muted border overflow-hidden rounded-lg">
                    <div className="aspect-video flex items-center justify-center relative">
                      Screenshot {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="font-medium">{plugin.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last updated</span>
                    <span className="font-medium">{plugin.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full">Install Plugin</Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={plugin.githubUrl} className="flex items-center justify-center">
                      <Github className="mr-2 h-4 w-4" />
                      View on GitHub
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">Submit a PR</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Want to contribute to this plugin? Submit a pull request on GitHub.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`${plugin.githubUrl}/pulls`}>
                    Create Pull Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
