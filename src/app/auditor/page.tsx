import { LoungeShell } from "@/components/layout/lounge-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { getPageBySlug } from "@/services/content-service";

export default async function AuditorLoungePage() {
  const page = await getPageBySlug("lounge-auditor");
  return (
    <LoungeShell>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">청강자 라운지</h1>
      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </LoungeShell>
  );
}
