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
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Download, Star } from "lucide-react";

// Mock data for featured plugins
const featuredPlugins = [
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
];

export function FeaturedPlugins() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredPlugins.map((plugin) => (
        <Card key={plugin.id} className="overflow-hidden">
          <div className="aspect-video relative bg-muted">
            <div className="flex h-full items-center justify-center bg-secondary">
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
            <div className="flex items-center text-sm text-muted-foreground">
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
  );
}
