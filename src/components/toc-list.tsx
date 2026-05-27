export function TocList({
  items
}: {
  items: Array<{ id: string; text: string; level: 2 | 3 }>;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Nesta página
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={[
              "rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
              item.level === 3 ? "ml-3" : ""
            ].join(" ")}
          >
            {item.text}
          </a>
        ))}
      </div>
    </div>
  );
}
