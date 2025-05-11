'use client';

export function FlagEditor() {
  return (
    <section>
      <h2 className="text-xl font-bold mb-2">Feature Flags</h2>
      <div className="flex items-center gap-2">
        <label className="text-sm">beta-ui</label>
        <input type="checkbox" defaultChecked />
      </div>
    </section>
  );
}