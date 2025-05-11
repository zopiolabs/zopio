import Link from 'next/link';
import type { ReactNode } from 'react';
import { FlagEditor } from '../components/flag-editor';
import { PluginToggle } from '../components/plugin-toggle';
import { UserCreateForm } from '../components/user-create-form';

export default function Home(): ReactNode {
  return (
    <div className="space-y-10">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 font-semibold text-xl">Development Tools</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/jobs"
            className="rounded-md bg-blue-100 p-4 transition-colors hover:bg-blue-200"
          >
            <h3 className="font-medium text-blue-800">Jobs Dashboard</h3>
            <p className="text-blue-600 text-sm">
              Manage and monitor background jobs
            </p>
          </Link>
          <PluginToggle />
          <FlagEditor />
          <UserCreateForm />
        </div>
      </div>
    </div>
  );
}
