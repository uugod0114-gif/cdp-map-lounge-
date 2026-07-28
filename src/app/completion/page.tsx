import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { getPageBySlug } from "@/services/content-service";

export default async function CompletionPage() {
  const page = await getPageBySlug("completion");
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <BlockList blocks={page?.publishedBlocks ?? []} role="auditor" />
      </div>
    </PublicShell>
  );
}
