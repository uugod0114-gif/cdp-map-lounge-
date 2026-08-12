import { PublicShell } from "@/components/layout/public-shell";
import { FeedbackPageClient } from "@/components/lounge/feedback-page-client";
import { listSessions, listLoungePosts } from "@/services/content-service";

export default async function FeedbackHubPage() {
  const sessions = await listSessions();
  const allPosts = await listLoungePosts("auditor");
  const sessionTags = sessions.map((s) => `${s.week}회차`);

  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">실시간 피드백</h1>
        <p className="mb-6 text-sm text-slate-500">
          회차를 선택하고 익명으로 소감을 남겨보세요. 공감·댓글도 가능해요.
        </p>
        <FeedbackPageClient
          sessions={sessions}
          allPosts={allPosts}
          sessionTags={sessionTags}
        />
      </div>
    </PublicShell>
  );
}