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
import Link from "next/link";
import { Button } from "@repo/design-system/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/design-system/components/ui/select";
import { AlertCircle, ArrowLeft, Github } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@repo/design-system/components/ui/alert";

export const metadata: Metadata = {
  title: "Submit Plugin",
  description: "Submit your plugin to the Zopio Marketplace",
};

export default function SubmitPluginPage(): ReactNode {
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
        
        <h1 className="font-bold text-3xl">Submit a Plugin</h1>
        <p className="mt-2 text-muted-foreground">
          Share your plugin with the Zopio community by submitting a pull request.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Plugin Information</CardTitle>
              <CardDescription>
                Provide details about your plugin for the marketplace listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plugin Name</Label>
                <Input id="name" placeholder="My Awesome Plugin" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="A brief description of your plugin (max 150 characters)"
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="data">Data & Storage</SelectItem>
                    <SelectItem value="ui-components">UI Components</SelectItem>
                    <SelectItem value="content">Content Management</SelectItem>
                    <SelectItem value="integration">Integrations</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="developer-tools">Developer Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Repository URL</Label>
                <Input id="github" placeholder="https://github.com/username/repo" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="analytics, dashboard, charts" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
              <CardDescription>
                Follow these guidelines to ensure your plugin is accepted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Repository Structure</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li>Must include a README.md with installation and usage instructions</li>
                  <li>Must have a valid package.json with all dependencies</li>
                  <li>Should follow Zopio naming conventions (@repo/*)</li>
                  <li>Should include TypeScript definitions</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Code Quality</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li>Must pass all linting checks</li>
                  <li>Should include tests</li>
                  <li>Should follow Zopio coding standards</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Documentation</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm">
                  <li>Must include clear usage examples</li>
                  <li>Should document all public APIs</li>
                  <li>Should include screenshots if applicable</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Process</AlertTitle>
            <AlertDescription>
              Plugins are added to the marketplace through GitHub pull requests. After filling out this form, you&apos;ll be directed to create a PR with your plugin.
            </AlertDescription>
          </Alert>
          
          <Button className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Continue to GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
