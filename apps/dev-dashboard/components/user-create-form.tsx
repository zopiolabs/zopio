'use client';

export function UserCreateForm() {
  return (
    <section>
      <h2 className="text-xl font-bold mb-2">Create Test User</h2>
      <form className="flex gap-2">
        <input
          type="email"
          placeholder="test@zopio.dev"
          className="border px-2 py-1 rounded w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
          Create
        </button>
      </form>
    </section>
  );
}