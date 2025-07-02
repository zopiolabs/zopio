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
import type { ReactNode } from "react";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/design-system/components/ui/select";
import { Download, Filter, Search, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Plugins",
  description: "Browse all plugins available in the Zopio Marketplace",
};

// Mock data for plugins - in a real app, this would come from an API or database
const allPlugins = [
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Comprehensive analytics dashboard for monitoring your Zopio application performance.",
    author: "Zopio Team",
    category: "Analytics",
    rating: 4.8,
    downloads: 1250,
    image: "/images/plugins/analytics-dashboard.png",
  },
  {
    id: "data-connector",
    title: "Data Connector",
    description: "Connect to various data sources and integrate them with your Zopio applications.",
    author: "DataSync",
    category: "Integration",
    rating: 4.6,
    downloads: 980,
    image: "/images/plugins/data-connector.png",
  },
  {
    id: "form-builder",
    title: "Form Builder",
    description: "Drag and drop form builder with validation and submission handling.",
    author: "FormCraft",
    category: "UI Components",
    rating: 4.9,
    downloads: 2100,
    image: "/images/plugins/form-builder.png",
  },
  {
    id: "authentication",
    title: "Authentication Provider",
    description: "Add social login, MFA, and advanced authentication features to your app.",
    author: "SecureAuth",
    category: "Security",
    rating: 4.7,
    downloads: 1850,
    image: "/images/plugins/authentication.png",
  },
  {
    id: "payment-gateway",
    title: "Payment Gateway",
    description: "Process payments securely with multiple payment providers.",
    author: "PaymentPro",
    category: "Fintech",
    rating: 4.5,
    downloads: 950,
    image: "/images/plugins/payment-gateway.png",
  },
  {
    id: "notification-system",
    title: "Notification System",
    description: "Send notifications across multiple channels including email, SMS, and push.",
    author: "NotifyTeam",
    category: "Communication",
    rating: 4.4,
    downloads: 780,
    image: "/images/plugins/notification-system.png",
  },
  {
    id: "seo-toolkit",
    title: "SEO Toolkit",
    description: "Optimize your Zopio application for search engines with advanced SEO tools.",
    author: "SEOPro",
    category: "Marketing",
    rating: 4.3,
    downloads: 650,
    image: "/images/plugins/seo-toolkit.png",
  },
  {
    id: "image-editor",
    title: "Image Editor",
    description: "Edit and manipulate images directly in your Zopio application.",
    author: "ImageWorks",
    category: "Media",
    rating: 4.6,
    downloads: 1100,
    image: "/images/plugins/image-editor.png",
  },
];

export default function PluginsPage(): ReactNode {
  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">All Plugins</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and discover plugins for your Zopio applications
        </p>
      </div>
      
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          {React.createElement(Search, { 
            className: "absolute -translate-y-1/2 left-3 text-muted-foreground top-1/2 h-4 w-4" 
          })}
          <Input className="pl-10" placeholder="Search plugins..." />
        </div>
        
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="data">Data & Storage</SelectItem>
              <SelectItem value="ui-components">UI Components</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
            </SelectContent>
          </Select>
          
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
          
          <Button variant="outline" size="sm" className="h-8 gap-1">
            {React.createElement(Filter, { className: "h-3.5 w-3.5" })}
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Showing {allPlugins.length} plugins</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allPlugins.map((plugin) => (
          <Card key={plugin.id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              <div className="bg-secondary flex font-bold h-full items-center justify-center text-4xl">
                {plugin.title.charAt(0)}
              </div>
            </div>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-1 text-lg">{plugin.title}</CardTitle>
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
                <div className="flex items-center gap-1 text-sm">
                  {React.createElement(Star, { className: "h-3.5 w-3.5 fill-primary text-primary" })}
                  <span>{plugin.rating}</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center gap-1 text-sm">
                  {React.createElement(Download, { className: "h-3.5 w-3.5 text-muted-foreground" })}
                  <span>{plugin.downloads}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                {React.createElement(Link, { 
                  href: `/plugins/${plugin.id}`
                }, "View Details")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
