import { notFound } from "next/navigation";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { BlockListClient } from "@/components/cms/block-list-client";
import { StatusBadge } from "@/components/common/badge";
import { SessionQnaPanel } from "@/components/sessions/session-qna-panel";
import { SessionAgendaTable } from "@/components/sessions/session-agenda-table";
import { getSessionById, listSessionQuestions } from "@/services/content-service";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const [session, questions] = await Promise.all([
    getSessionById(sessionId),
    listSessionQuestions(sessionId),
  ]);
  if (!session) notFound();

  return (
    <LoungeShell>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-semibold text-map-navy-mute">{session.week}회차</span>
        <StatusBadge status={session.status} />
      </div>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">{session.title}</h1>
      <p className="mb-6 text-slate-500">{session.summary}</p>

      <BlockListClient blocks={session.publishedBlocks.length ? session.publishedBlocks : session.draftBlocks} />

      {session.agenda && session.agenda.length > 0 && (
        <div className="mt-8">
          <SessionAgendaTable agenda={session.agenda} />
        </div>
      )}

      {session.assignmentNote && (
        <div className="mt-6 rounded-card border border-map-gold/40 bg-map-gold-soft/40 p-5 text-sm text-map-navy">
          <p className="font-semibold">과제 안내</p>
          <p className="mt-1 leading-relaxed">{session.assignmentNote}</p>
        </div>
      )}

      <div className="mt-10 space-y-6">
        <SessionQnaPanel sessionId={session.id} questions={questions} />
      </div>
    </LoungeShell>
  );
}
