import Link from "next/link";
import { CheckCircle2, FileText } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { Card } from "@/components/common/card";
import { getPageBySlug } from "@/services/content-service";

export default async function LearnerLoungePage() {
  const page = await getPageBySlug("lounge-learner");
  return (
    <PublicShell><div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">수강자 라운지</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Link href="/learner/attendance" className="block">
          <Card className="flex h-full items-center justify-between border-map-navy/10 hover:border-map-navy">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-map-ink">출석 체크</p>
                <p className="text-sm text-slate-500">회차별 오전/오후 출석 도장을 찍어주세요</p>
              </div>
            </div>
            <span className="text-sm text-map-navy">바로가기 →</span>
          </Card>
        </Link>

        <Link href="/learner/assignments" className="block">
          <Card className="flex h-full items-center justify-between border-map-navy/10 hover:border-map-navy">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-map-ink">과제</p>
                <p className="text-sm text-slate-500">회차별 과제 작성 · 제출, 멘토 피드백 확인</p>
              </div>
            </div>
            <span className="text-sm text-map-navy">바로가기 →</span>
          </Card>
        </Link>
      </div>

      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </div></PublicShell>
  );
}
