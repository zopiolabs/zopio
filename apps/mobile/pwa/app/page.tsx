import { Button } from "@repo/design-system";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-4xl font-bold">Zopio Mobile PWA</h1>
        <p className="text-xl">
          Welcome to the Progressive Web App version of Zopio Mobile
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button size="lg" className="w-full">
            Sign In
          </Button>
          <Button size="lg" variant="outline" className="w-full">
            Create Account
          </Button>
        </div>
      </div>
    </main>
  );
}
