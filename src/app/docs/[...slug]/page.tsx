import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TocList } from "@/components/toc-list";
import { getDocPageBySlug, getStaticDocParams } from "@/lib/docs";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getStaticDocParams();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getDocPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description
  };
}

export default async function DocPage(props: PageProps<"/docs/[...slug]">) {
  const { slug } = await props.params;
  const page = await getDocPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
      <article
        id="doc-article"
        className="prose prose-zinc max-w-none prose-headings:scroll-mt-24 prose-a:font-medium"
      >
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <TocList items={page.toc} />
        </div>
      </aside>
    </div>
  );
}
