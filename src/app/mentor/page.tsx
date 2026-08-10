import Link from "next/link";
import { FileText } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { Card } from "@/components/common/card";
import { getPageBySlug } from "@/services/content-service";

export default async function MentorLoungePage() {
  const page = await getPageBySlug("lounge-mentor");
  return (
    <PublicShell><div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">멘토 라운지</h1>

      <Link href="/mentor/assignments" className="mb-6 block">
        <Card className="flex items-center justify-between border-map-navy/10 hover:border-map-navy">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-map-ink">내 수강자 과제</p>
              <p className="text-sm text-slate-500">담당 수강자의 회차별 과제 제출 현황과 피드백</p>
            </div>
          </div>
          <span className="text-sm text-map-navy">바로가기 →</span>
        </Card>
      </Link>

      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </div></PublicShell>
  );
}
