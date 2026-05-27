"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { isDark, label, ariaLabel } = useMemo(() => {
    const theme = mounted ? resolvedTheme : undefined;
    const dark = theme === "dark";
    return {
      isDark: dark,
      label: theme ? (dark ? "Claro" : "Escuro") : "Tema",
      ariaLabel: theme
        ? dark
          ? "Ativar modo claro"
          : "Ativar modo escuro"
        : "Alternar tema",
    };
  }, [mounted, resolvedTheme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
