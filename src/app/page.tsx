import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { Card } from "@/components/common/card";
import { MaterialActions } from "@/components/materials/material-actions";
import { ScheduleSessionList } from "@/components/sessions/schedule-session-card";
import { MessageCircle, FileText } from "lucide-react";
import { getPageBySlug, listSessions, listMaterials } from "@/services/content-service";

export default async function HomePage() {
  const [page, sessions, materials] = await Promise.all([
    getPageBySlug("main"),
    listSessions(),
    listMaterials(),
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

      {/* 강의 자료 */}
      <div id="materials" className="snap-section scroll-mt-16 bg-map-gold-soft/40">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 font-display text-2xl font-medium text-map-ink">강의 자료</h2>
          <p className="mb-6 text-sm text-slate-500">
            강의자료는 드라이브/플립북으로 확인 가능합니다.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {materials.map((m) => (
              <Card key={m.id} className="flex items-start gap-3 border-map-navy/10">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-map-gold-soft text-map-navy">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-map-ink">{m.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{m.description}</p>
                  <div className="mt-3">
                    <MaterialActions
                      materialId={m.id}
                      fileUrl={m.fileUrl}
                      downloadUrl={m.downloadUrl}
                      flipbookEnabled={m.flipbookEnabled}
                      downloadAllowed={m.downloadAllowed}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}