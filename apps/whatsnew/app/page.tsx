import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Layout } from '../components/layout';
import { ChangelogEntry } from '../components/changelog-entry';

type WhatsNewItem = {
  version: string;
  date: string;
  changes: {
    type: 'feature' | 'fix' | 'improvement' | 'breaking';
    description: string;
  }[];
};

type WhatsNewData = {
  items: WhatsNewItem[];
};

async function getWhatsNewData(): Promise<WhatsNewData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'whatsnew.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (_error) {
    // Error will be handled gracefully with empty data
    return { items: [] };
  }
}

export default async function WhatsNewPage() {
  const data = await getWhatsNewData();

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Changelog</h1>
          <p className="text-lg text-gray-600">
            Stay up to date with all the latest features, improvements, and fixes for Zopio.
          </p>
        </div>
        
        {data.items.length === 0 ? (
          <div className="border border-yellow-200 rounded-lg bg-yellow-50 p-6 text-center">
            <h3 className="mb-2 text-xl font-medium text-yellow-800">No updates yet</h3>
            <p className="text-yellow-700">Check back soon for the latest updates and improvements.</p>
          </div>
        ) : (
          <div className="divide-gray-100 divide-y">
            {data.items.map((item, index) => (
              <ChangelogEntry
                key={index}
                version={item.version}
                date={item.date}
                changes={item.changes}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
