import Link from "next/link";
import { Metadata } from "next";
import { BarChart3, Database, Clock, Flag, Shield, FileText, Webhook, BookOpen, Activity, Terminal, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Zopio Developer Console",
  description: "Developer tools for the Zopio framework",
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function DashboardCard({ title, description, icon, href }: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zopio Developer Console</h1>
        <p className="text-muted-foreground">
          Welcome to the Zopio Developer Console. Select a tool to get started.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="System Overview"
          description="View system status, active tenants, and version information"
          icon={<Server className="h-5 w-5 text-primary" />}
          href="/system/status"
        />
        <DashboardCard
          title="API Explorer"
          description="Explore and test API endpoints"
          icon={<Terminal className="h-5 w-5 text-primary" />}
          href="/tools/api-explorer"
        />
        <DashboardCard
          title="DB Viewer"
          description="Browse database tables and records"
          icon={<Database className="h-5 w-5 text-primary" />}
          href="/tools/db-viewer"
        />
        <DashboardCard
          title="Job Queue Monitor"
          description="Monitor and manage background jobs"
          icon={<Clock className="h-5 w-5 text-primary" />}
          href="/tools/jobs"
        />
        <DashboardCard
          title="Feature Flags"
          description="Manage feature flags and toggles"
          icon={<Flag className="h-5 w-5 text-primary" />}
          href="/tools/feature-flags"
        />
        <DashboardCard
          title="Security"
          description="Manage API keys, audit logs, and user permissions"
          icon={<Shield className="h-5 w-5 text-primary" />}
          href="/security/api-keys"
        />
        <DashboardCard
          title="Observability"
          description="View logs, metrics, and error tracking"
          icon={<Activity className="h-5 w-5 text-primary" />}
          href="/observability/logs"
        />
        <DashboardCard
          title="Integrations"
          description="Configure webhooks and connected services"
          icon={<Webhook className="h-5 w-5 text-primary" />}
          href="/integrations/webhooks"
        />
        <DashboardCard
          title="Documentation"
          description="Access API reference and internal documentation"
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          href="/docs/api"
        />
      </div>
    </div>
  );
}
