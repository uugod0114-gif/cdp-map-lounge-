import { LoungeShell } from "@/components/layout/lounge-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { LoungeFeed } from "@/components/lounge/lounge-feed";
import { getPageBySlug, listLoungePosts, listSessions } from "@/services/content-service";

export default async function AuditorLoungePage() {
  const [page, posts, sessions] = await Promise.all([
    getPageBySlug("lounge-auditor"),
    listLoungePosts("auditor"),
    listSessions(),
  ]);
  const sessionTags = sessions.map((s) => `${s.week}회차`);

  return (
    <LoungeShell>
      <h1 className="font-display text-2xl font-medium text-map-ink">청강자 라운지</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        관심 강의를 듣고 느낀 점을 익명으로 나눠보세요. 교수자와 운영진도 함께 봅니다.
      </p>

      <div className="mb-8">
        <LoungeFeed board="auditor" posts={posts} sessionTags={sessionTags} />
      </div>

      <BlockListClient blocks={page?.publishedBlocks ?? []} />
    </LoungeShell>
  );
}
