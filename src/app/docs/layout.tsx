import Link from "next/link";

import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { getNavigation } from "@/lib/docs";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = await getNavigation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/docs" className="text-sm font-semibold tracking-tight">
            {nav.title}
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8.5rem)]">
          <Sidebar nav={nav} />
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
