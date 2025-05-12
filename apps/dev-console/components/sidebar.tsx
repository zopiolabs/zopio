"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes, ReactNode } from "react";
import { 
  Activity,
  BarChart3, 
  BookOpen, 
  Clock, 
  Database, 
  FileText, 
  Flag, 
  Layers,
  Mail,
  Server,
  Settings, 
  Shield, 
  Terminal,
  Users,
  ChevronRight
} from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

type NavItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
};

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className="justify-start w-full group hover:bg-muted/50 transition-colors"
    asChild
  >
    <Link href={href} className="flex items-center">
      <span className="mr-2 flex items-center justify-center rounded-md bg-primary/10 p-1 text-primary group-hover:bg-primary/20">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
      {isActive && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
    </Link>
  </Button>
);

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("bg-background pb-12 border-r border-border", className)}>
      <div className="py-4 space-y-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-xl tracking-tight">
            Zopio Console
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/"
              icon={<BarChart3 className="h-4 mr-2 w-4" />}
              label="Dashboard"
              isActive={pathname === "/"}
            />
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-lg tracking-tight">
            System Overview
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/system/status"
              icon={<Server className="h-4 mr-2 w-4" />}
              label="App Status"
              isActive={pathname === "/system/status"}
            />
            <NavItem
              href="/system/tenants"
              icon={<Users className="h-4 mr-2 w-4" />}
              label="Active Tenants"
              isActive={pathname === "/system/tenants"}
            />
            <NavItem
              href="/system/version"
              icon={<Terminal className="h-4 mr-2 w-4" />}
              label="Version Info"
              isActive={pathname === "/system/version"}
            />
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-lg tracking-tight">
            Developer Tools
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/tools/api-explorer"
              icon={<Terminal className="h-4 mr-2 w-4" />}
              label="API Explorer"
              isActive={pathname === "/tools/api-explorer"}
            />
            <NavItem
              href="/tools/db-viewer"
              icon={<Database className="h-4 mr-2 w-4" />}
              label="DB Viewer"
              isActive={pathname === "/tools/db-viewer"}
            />
            <NavItem
              href="/tools/jobs"
              icon={<Clock className="h-4 mr-2 w-4" />}
              label="Job Queue Monitor"
              isActive={pathname === "/tools/jobs"}
            />
            <NavItem
              href="/tools/feature-flags"
              icon={<Flag className="h-4 mr-2 w-4" />}
              label="Feature Flags Manager"
              isActive={pathname === "/tools/feature-flags"}
            />
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-lg tracking-tight">
            Security & Access
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/security/api-keys"
              icon={<Shield className="h-4 mr-2 w-4" />}
              label="API Key Management"
              isActive={pathname === "/security/api-keys"}
            />
            <NavItem
              href="/security/audit-logs"
              icon={<FileText className="h-4 mr-2 w-4" />}
              label="Audit Logs"
              isActive={pathname === "/security/audit-logs"}
            />
            <NavItem
              href="/security/roles"
              icon={<Users className="h-4 mr-2 w-4" />}
              label="User Roles & Permissions"
              isActive={pathname === "/security/roles"}
            />
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-lg tracking-tight">
            Testing & QA
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/testing/scenario-runner"
              icon={<Layers className="h-4 mr-2 w-4" />}
              label="Scenario Runner"
              isActive={pathname === "/testing/scenario-runner"}
            />
            <NavItem
              href="/testing/simulator"
              icon={<Mail className="h-4 mr-2 w-4" />}
              label="Event Simulator"
              isActive={pathname === "/testing/simulator"}
            />
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-lg tracking-tight">
            Configuration
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/config/settings"
              icon={<Settings className="h-4 mr-2 w-4" />}
              label="System Settings"
              isActive={pathname === "/config/settings"}
            />
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-lg tracking-tight">
            Documentation
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/docs/guides"
              icon={<BookOpen className="h-4 mr-2 w-4" />}
              label="Developer Guides"
              isActive={pathname === "/docs/guides"}
            />
            <NavItem
              href="/docs/api"
              icon={<FileText className="h-4 mr-2 w-4" />}
              label="API Reference"
              isActive={pathname === "/docs/api"}
            />
            <NavItem
              href="/docs/changelog"
              icon={<Activity className="h-4 mr-2 w-4" />}
              label="Changelog"
              isActive={pathname === "/docs/changelog"}
            />
          </div>
        </div>
        <Separator />
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 font-semibold text-lg tracking-tight">
            Support
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/support/tickets"
              icon={<Shield className="h-4 mr-2 w-4" />}
              label="Support Tickets"
              isActive={pathname === "/support/tickets"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
