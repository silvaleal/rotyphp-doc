import { redirect } from "next/navigation";

import { getAllDocItems } from "@/lib/docs";

export default async function DocsIndexPage() {
  const items = await getAllDocItems();
  const first = items[0];

  if (!first) redirect("/");

  redirect(`/docs/${first.slug}`);
}
