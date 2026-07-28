import { LoungeShell } from "@/components/layout/lounge-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { getPageBySlug } from "@/services/content-service";

export default async function LoungePage() {
  const page = await getPageBySlug("lounge");
  return (
    <LoungeShell>
      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </LoungeShell>
  );
}
