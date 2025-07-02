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
import type React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Download, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search results for plugins in the Zopio Marketplace",
};

// This would normally be a server component that fetches data based on the search query
export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}): React.ReactNode {
  const query = searchParams.q || "";
  
  // Mock search results - in a real app, this would be filtered based on the query
  const searchResults = [
    {
      id: "analytics-dashboard",
      title: "Analytics Dashboard",
      description: "Comprehensive analytics dashboard for monitoring your Zopio application performance.",
      author: "Zopio Team",
      category: "Analytics",
      rating: 4.8,
      downloads: 1250,
      relevance: 0.95,
    },
    {
      id: "data-connector",
      title: "Data Connector",
      description: "Connect to various data sources and integrate them with your Zopio applications.",
      author: "DataSync",
      category: "Integration",
      rating: 4.6,
      downloads: 980,
      relevance: 0.82,
    },
    {
      id: "form-builder",
      title: "Form Builder",
      description: "Drag and drop form builder with validation and submission handling.",
      author: "FormCraft",
      category: "UI Components",
      rating: 4.9,
      downloads: 2100,
      relevance: 0.78,
    },
  ];
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Search Results</h1>
        <p className="mt-2 text-muted-foreground">
          {searchResults.length} results for "{query}"
        </p>
      </div>
      
      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="mb-2 font-semibold text-xl">No results found</h2>
          <p className="mb-6 text-center text-muted-foreground">
            We couldn't find any plugins matching your search. Try using different keywords or browse our categories.
          </p>
          <Button asChild>
            <Link href="/categories">Browse Categories</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((plugin) => (
            <Card key={plugin.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
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
      )}
      
      <div className="mt-8">
        <h2 className="mb-4 font-semibold text-xl">Looking for something else?</h2>
        <p className="mb-6 text-muted-foreground">
          Can't find what you're looking for? Submit a plugin request or create your own plugin.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/submit-plugin">Submit a Plugin</Link>
          </Button>
          <Button asChild>
            <Link href="/categories">Browse Categories</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
