export default {
  title: 'External Catalogs/Tail Admin',
};

export const TailAdminDemo = () => (
  <iframe
    src="https://nextjs-demo.tailadmin.com/"
    style={{ width: '100%', height: '90vh', border: 'none' }}
    title="TailAdmin Demo"
  />
);

export const TailAdminRepo = () => (
  <div style={{ padding: 16 }}>
    <h2>TailAdmin Repo</h2>
    <p>This project cannot be embedded due to GitHub iframe restrictions.</p>
    <a
      href="https://github.com/TailAdmin/free-nextjs-admin-dashboard"
      target="_blank"
      rel="noopener noreferrer"
    >
      👉 Open on GitHub
    </a>
  </div>
);
