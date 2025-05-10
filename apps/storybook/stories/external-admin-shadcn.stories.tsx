export default {
  title: 'External Catalogs/Shadcn Admin',
};

export const ShadcnAdminDemo = () => (
  <iframe
    src="https://shadcn-dashboard.kiranism.dev/dashboard/overview"
    style={{ width: '100%', height: '90vh', border: 'none' }}
    title="ShadcnAdmin Demo"
  />
);

export const ShadcnAdminRepo = () => (
  <div style={{ padding: 16 }}>
    <h2>Shadcn Admin Repo</h2>
    <p>This project cannot be embedded due to GitHub iframe restrictions.</p>
    <a
      href="https://github.com/Kiranism/next-shadcn-dashboard-starter"
      target="_blank"
      rel="noopener noreferrer"
    >
      👉 Open on GitHub
    </a>
  </div>
);
