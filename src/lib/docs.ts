import fs from "node:fs/promises";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { remark } from "remark";
import type { Schema } from "hast-util-sanitize";
import { visit } from "unist-util-visit";
import { getSingletonHighlighter } from "shiki";
import type { BundledLanguage } from "shiki";

export type NavigationConfig = {
  title: string;
  sections: Array<{
    title: string;
    items: Array<{
      title: string;
      slug: string;
      file: string;
    }>;
  }>;
};

export type NavigationItem = NavigationConfig["sections"][number]["items"][number];

export type DocPage = {
  slug: string;
  title: string;
  description?: string;
  toc: Array<{ id: string; text: string; level: 2 | 3 }>;
  html: string;
};

const DOCS_ROOT = path.join(process.cwd(), "docs");
const HIGHLIGHT_THEMES = { dark: "github-dark", light: "github-light" } as const;
let highlighterPromise:
  | ReturnType<typeof getSingletonHighlighter>
  | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = getSingletonHighlighter({
      themes: [HIGHLIGHT_THEMES.light, HIGHLIGHT_THEMES.dark]
    });
  }
  return highlighterPromise;
}

export async function getNavigation(): Promise<NavigationConfig> {
  const filePath = path.join(DOCS_ROOT, "navigation.json");
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as NavigationConfig;
}

export async function getAllDocItems(): Promise<NavigationItem[]> {
  const nav = await getNavigation();
  return nav.sections.flatMap((s) => s.items);
}

export async function getDocItemBySlug(slug: string): Promise<NavigationItem | null> {
  const items = await getAllDocItems();
  return items.find((i) => i.slug === slug) ?? null;
}

export async function getStaticDocParams(): Promise<Array<{ slug: string[] }>> {
  const items = await getAllDocItems();
  return items.map((i) => ({ slug: i.slug.split("/").filter(Boolean) }));
}

type Attrs = NonNullable<Schema["attributes"]>;
type AttrList = Attrs[string];

const baseAttributes: Attrs = ((defaultSchema as Schema).attributes ?? {}) as Attrs;
const getAttrs = (tag: string): AttrList =>
  (baseAttributes as Record<string, AttrList>)[tag] ?? [];

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...baseAttributes,
    "*": [
      ...getAttrs("*"),
      "className",
      "id",
      "aria-label",
      "aria-hidden",
      "data-theme",
      "data-language",
      "data-line",
      "data-highlighted-line",
      "data-highlighted-chars"
    ],
    span: [...getAttrs("span"), "style", "className"],
    pre: [...getAttrs("pre"), "className", "data-theme", "tabIndex"],
    code: [...getAttrs("code"), "className"],
    a: [...getAttrs("a"), "className", "target", "rel"]
  }
} satisfies Schema;

export async function getDocPageBySlug(slugParts: string[]): Promise<DocPage | null> {
  const slug = slugParts.join("/");
  const item = await getDocItemBySlug(slug);
  if (!item) return null;

  const filePath = path.join(DOCS_ROOT, item.file);
  const source = await fs.readFile(filePath, "utf8");

  const parsed = matter(source);
  const frontmatter = parsed.data as { title?: string; description?: string };
  const title = frontmatter.title ?? item.title;

  const toc: DocPage["toc"] = [];
  const slugger = new GithubSlugger();
  const mdTree = remark().use(remarkParse).use(remarkGfm).parse(parsed.content);

  const getText = (node: unknown): string => {
    if (!node || typeof node !== "object") return "";
    const n = node as { type?: string; value?: string; children?: unknown[] };
    if (typeof n.value === "string") return n.value;
    if (Array.isArray(n.children)) return n.children.map(getText).join("");
    return "";
  };

  visit(mdTree, "heading", (node: unknown) => {
    const heading = node as { depth?: number; children?: unknown[] };
    if (heading.depth !== 2 && heading.depth !== 3) return;
    const text = (heading.children ?? []).map(getText).join("").trim();
    if (!text) return;
    const id = slugger.slug(text);
    toc.push({ id, text, level: heading.depth });
  });

  const processed = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(function rehypeInlineCodeHighlight() {
      return async (tree) => {
        const highlighter = await getHighlighter();
        const tasks: Array<Promise<void>> = [];

        const getTextContent = (node: unknown): string => {
          if (!node || typeof node !== "object") return "";
          const n = node as { type?: string; value?: string; children?: unknown[] };
          if (typeof n.value === "string") return n.value;
          if (Array.isArray(n.children)) return n.children.map(getTextContent).join("");
          return "";
        };

        visit(tree, "element", (node: unknown, _index: unknown, parent: unknown) => {
          const el = node as {
            tagName?: string;
            properties?: Record<string, unknown>;
            children?: unknown[];
          };
          const parentEl = parent as { tagName?: string } | undefined;

          if (el.tagName !== "code") return;
          if (parentEl?.tagName === "pre") return;

          const props = el.properties ?? {};
          const classNameRaw = props.className;
          const classNames = Array.isArray(classNameRaw)
            ? classNameRaw.map(String)
            : typeof classNameRaw === "string"
              ? classNameRaw.split(/\s+/).filter(Boolean)
              : [];

          const langClass = classNames.find((c) => c.startsWith("language-"));
          const lang = langClass?.slice("language-".length);
          if (!lang) return;

          const code = getTextContent(el).trimEnd();
          if (!code) return;

          tasks.push(
            highlighter
              .loadLanguage(lang as BundledLanguage)
              .then(() => {
                const hast = highlighter.codeToHast(code, {
                  lang: lang as BundledLanguage,
                  themes: HIGHLIGHT_THEMES,
                  structure: "inline"
                });

                el.children = hast.children as unknown[];
                el.properties = {
                  ...props,
                  className: Array.from(new Set([...classNames, "inline-highlight"])),
                  "data-language": lang
                };
              })
              .catch(() => undefined)
          );
        });

        await Promise.all(tasks);
      };
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: ["heading-anchor"] }
    })
    .use(rehypePrettyCode, {
      theme: {
        dark: HIGHLIGHT_THEMES.dark,
        light: HIGHLIGHT_THEMES.light
      },
      keepBackground: false
    })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(parsed.content);

  return {
    slug,
    title,
    description: frontmatter.description,
    toc,
    html: String(processed.value)
  };
}
