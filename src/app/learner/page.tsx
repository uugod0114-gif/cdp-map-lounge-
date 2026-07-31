import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { Card } from "@/components/common/card";
import { LoungeFeed } from "@/components/lounge/lounge-feed";
import { getPageBySlug, listLoungePosts, listSessions } from "@/services/content-service";

export default async function LearnerLoungePage() {
  const [page, posts, sessions] = await Promise.all([
    getPageBySlug("lounge-learner"),
    listLoungePosts("learner"),
    listSessions(),
  ]);
  const sessionTags = sessions.map((s) => `${s.week}회차`);

  return (
    <LoungeShell>
      <h1 className="font-display text-2xl font-medium text-map-ink">수강자 라운지</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        오늘 교육에서 얻은 인사이트를 익명으로 나눠보세요. 좋은 글은 교수자 추천으로 소개됩니다.
      </p>

      <Link href="/learner/attendance" className="mb-6 block">
        <Card className="flex items-center justify-between border-map-navy/10 hover:border-map-navy">
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

      <div className="mb-8">
        <LoungeFeed board="learner" posts={posts} sessionTags={sessionTags} />
      </div>

      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </LoungeShell>
  );
}
