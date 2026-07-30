import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { getPageBySlug } from "@/services/content-service";

export default async function HomePage() {
  const page = await getPageBySlug("main");

  return (
    <PublicShell>
      <BlockList blocks={page?.publishedBlocks ?? []} role="auditor" />
    </PublicShell>
  );
}
