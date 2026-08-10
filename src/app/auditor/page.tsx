import { PublicShell } from "@/components/layout/public-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { getPageBySlug } from "@/services/content-service";

export default async function AuditorLoungePage() {
  const page = await getPageBySlug("lounge-auditor");
  return (
    <PublicShell><div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">청강자 라운지</h1>
      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </div></PublicShell>
  );
}
