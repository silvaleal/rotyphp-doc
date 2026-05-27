"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import type { NavigationConfig } from "@/lib/docs";

export function Sidebar({ nav }: { nav: NavigationConfig }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nav.sections;

    return nav.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((i) => i.title.toLowerCase().includes(q))
      }))
      .filter((s) => s.items.length > 0);
  }, [nav.sections, query]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <nav className="flex flex-col gap-6 overflow-auto pr-2">
        {filtered.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </div>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const href = `/docs/${item.slug}`;
                const active = pathname === href;

                return (
                  <Link
                    key={item.slug}
                    href={href}
                    className={[
                      "rounded-md px-2 py-1 text-sm transition-colors",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    ].join(" ")}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
