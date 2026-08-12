import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { ScheduleSessionList } from "@/components/sessions/schedule-session-card";
import { getPageBySlug, listSessions } from "@/services/content-service";

export default async function HomePage() {
  const [page, sessions] = await Promise.all([
    getPageBySlug("main"),
    listSessions(),
  ]);

  return (
    <PublicShell>
      {/* 히어로 */}
      <div className="snap-section">
        <BlockList blocks={page?.publishedBlocks ?? []} role="auditor" />
      </div>

      {/* 강의 일정 */}
      <div id="schedule" className="snap-section scroll-mt-16">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-medium text-map-ink">강의 일정</h2>
          <ScheduleSessionList sessions={sessions} />
        </div>
      </div>
    </PublicShell>
  );
}