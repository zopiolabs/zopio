import { promises as fs } from 'node:fs';
import path from 'node:path';

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

function getChangeTypeClasses(type: string): string {
  switch (type) {
    case 'feature':
      return 'bg-green-100 px-2 py-1 rounded text-green-800 text-xs';
    case 'fix':
      return 'bg-blue-100 px-2 py-1 rounded text-blue-800 text-xs';
    case 'improvement':
      return 'bg-purple-100 px-2 py-1 rounded text-purple-800 text-xs';
    case 'breaking':
      return 'bg-red-100 px-2 py-1 rounded text-red-800 text-xs';
    default:
      return 'bg-gray-100 px-2 py-1 rounded text-gray-800 text-xs';
  }
}

async function getWhatsNewData(): Promise<WhatsNewData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'whatsnew.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    // Log error silently in production
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error loading whatsnew data:', error);
    }
    return { items: [] };
  }
}

export default async function WhatsNewPage() {
  const data = await getWhatsNewData();

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">What's New in Zopio</h1>
        
        {data.items.length === 0 ? (
          <div className="border rounded-md bg-yellow-50 p-4">
            <p>No updates available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {data.items.map((item, index) => (
              <div key={index} className="border rounded-md bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-2xl">Version {item.version}</h2>
                  <div className="text-gray-500 text-sm">{item.date}</div>
                </div>
                
                <div className="space-y-3">
                  {item.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex gap-2">
                      <span className={getChangeTypeClasses(change.type)}>
                        {change.type}
                      </span>
                      <p>{change.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
