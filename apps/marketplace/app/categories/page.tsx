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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { 
  BarChart3, 
  Database, 
  FileText, 
  Globe, 
  Layout, 
  Lock, 
  MessageSquare, 
  Rocket,
  CreditCard,
  LineChart,
  Image,
  Megaphone
} from "lucide-react";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse plugins by category in the Zopio Marketplace",
};

// Mock data for plugin categories
const categories = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Track and visualize your application data",
    icon: BarChart3,
    count: 24,
    color: "bg-blue-100 dark:bg-blue-900",
    textColor: "text-blue-600 dark:text-blue-300",
  },
  {
    id: "data",
    title: "Data & Storage",
    description: "Connect and manage your data sources",
    icon: Database,
    count: 18,
    color: "bg-green-100 dark:bg-green-900",
    textColor: "text-green-600 dark:text-green-300",
  },
  {
    id: "ui-components",
    title: "UI Components",
    description: "Enhance your user interface",
    icon: Layout,
    count: 32,
    color: "bg-purple-100 dark:bg-purple-900",
    textColor: "text-purple-600 dark:text-purple-300",
  },
  {
    id: "content",
    title: "Content Management",
    description: "Manage and organize your content",
    icon: FileText,
    count: 15,
    color: "bg-yellow-100 dark:bg-yellow-900",
    textColor: "text-yellow-600 dark:text-yellow-300",
  },
  {
    id: "integration",
    title: "Integrations",
    description: "Connect with third-party services",
    icon: Globe,
    count: 27,
    color: "bg-indigo-100 dark:bg-indigo-900",
    textColor: "text-indigo-600 dark:text-indigo-300",
  },
  {
    id: "security",
    title: "Security",
    description: "Protect your application and data",
    icon: Lock,
    count: 12,
    color: "bg-red-100 dark:bg-red-900",
    textColor: "text-red-600 dark:text-red-300",
  },
  {
    id: "communication",
    title: "Communication",
    description: "Chat, messaging, and notifications",
    icon: MessageSquare,
    count: 9,
    color: "bg-pink-100 dark:bg-pink-900",
    textColor: "text-pink-600 dark:text-pink-300",
  },
  {
    id: "developer-tools",
    title: "Developer Tools",
    description: "Improve your development workflow",
    icon: Rocket,
    count: 21,
    color: "bg-orange-100 dark:bg-orange-900",
    textColor: "text-orange-600 dark:text-orange-300",
  },
  {
    id: "fintech",
    title: "Fintech",
    description: "Payment processing and financial tools",
    icon: CreditCard,
    count: 8,
    color: "bg-emerald-100 dark:bg-emerald-900",
    textColor: "text-emerald-600 dark:text-emerald-300",
  },
  {
    id: "business",
    title: "Business",
    description: "Tools for business operations and analytics",
    icon: LineChart,
    count: 14,
    color: "bg-cyan-100 dark:bg-cyan-900",
    textColor: "text-cyan-600 dark:text-cyan-300",
  },
  {
    id: "media",
    title: "Media",
    description: "Image, video, and audio processing tools",
    icon: Image,
    count: 11,
    color: "bg-violet-100 dark:bg-violet-900",
    textColor: "text-violet-600 dark:text-violet-300",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "SEO, social media, and marketing automation",
    icon: Megaphone,
    count: 16,
    color: "bg-amber-100 dark:bg-amber-900",
    textColor: "text-amber-600 dark:text-amber-300",
  },
];

export default function CategoriesPage(): ReactNode {
  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Plugin Categories</h1>
        <p className="mt-2 text-muted-foreground">
          Browse plugins by category to find the perfect tools for your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id}>
              {React.createElement(Link, { 
                href: `/categories/${category.id}`
              }, React.createElement(Card, {
                className: "h-full hover:bg-muted/50 transition-colors"
              }, [
                React.createElement(CardHeader, {
                  key: "header",
                  className: "pb-2"
                }, [
                  React.createElement("div", {
                    key: "icon-container",
                    className: `mb-2 flex h-12 items-center justify-center rounded-lg w-12 ${category.color}`
                  }, React.createElement(Icon, { 
                    className: `h-6 w-6 ${category.textColor}` 
                  })),
                  React.createElement(CardTitle, {
                    key: "title",
                    className: "text-xl"
                  }, category.title),
                  React.createElement(CardDescription, {
                    key: "description"
                  }, 
                    category.description
                  )
                ]),
                React.createElement(CardContent, {
                  key: "content"
                }, 
                  React.createElement("p", {
                    className: "text-sm text-muted-foreground"
                  }, `${category.count} plugins`)
                )
              ]))
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
