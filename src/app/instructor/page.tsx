import { LoungeShell } from "@/components/layout/lounge-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { getPageBySlug } from "@/services/content-service";

export default async function InstructorLoungePage() {
  const page = await getPageBySlug("lounge-instructor");
  return (
    <LoungeShell>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">강사 라운지</h1>
      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </LoungeShell>
  );
}
