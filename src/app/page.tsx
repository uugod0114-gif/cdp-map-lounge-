import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { Card } from "@/components/common/card";
import { MaterialActions } from "@/components/materials/material-actions";
import { CalendarDays, MapPin, MessageCircle, FileText } from "lucide-react";
import { getPageBySlug, listSessions, listMaterials } from "@/services/content-service";

export default async function HomePage() {
  const [page, aboutPage, faqPage, sessions, materials] = await Promise.all([
    getPageBySlug("main"),
    getPageBySlug("about"),
    getPageBySlug("faq"),
    listSessions(),
    listMaterials(),
  ]);

  return (
    <PublicShell>
      {/* 히어로 */}
      <div className="snap-section">
        <BlockList blocks={page?.publishedBlocks ?? []} role="auditor" />
      </div>

      {/* 교육 소개 */}
      <div id="intro" className="snap-section scroll-mt-16">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <BlockList blocks={aboutPage?.publishedBlocks ?? []} role="auditor" />
        </div>
      </div>

      {/* 강의 일정 */}
      <div id="schedule" className="snap-section scroll-mt-16">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-medium text-map-ink">강의 일정</h2>
          <div className="flex flex-col gap-4">
            {sessions.map((s) => (
              <Card key={s.id} className="border-map-navy/10">
                <p className="text-sm font-semibold text-map-navy">{s.week}회차</p>
                <p className="mt-1 text-lg font-bold text-map-ink">{s.title}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> {s.date} {s.startTime}-{s.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {s.location || "미정"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 강의 자료 */}
      <div id="materials" className="snap-section scroll-mt-16">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 font-display text-2xl font-medium text-map-ink">강의 자료</h2>
          <p className="mb-6 text-sm text-slate-500">
            자료 목록은 누구나 볼 수 있고, 실제 열람/다운로드는 로그인 후 가능합니다.
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

      {/* 실시간 피드백 */}
      <div id="feedback" className="snap-section scroll-mt-16">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 font-display text-2xl font-medium text-map-ink">실시간 피드백</h2>
          <p className="mb-6 text-sm text-slate-500">
            회차를 선택하면 해당 강의의 피드백/Q&A 공간으로 이동합니다.
          </p>
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <Link key={s.id} href={`/sessions/${s.id}`}>
                <Card className="flex items-center justify-between border-map-navy/10 hover:border-map-navy">
                  <div>
                    <p className="text-xs font-semibold text-map-navy">{s.week}회차</p>
                    <p className="font-semibold text-map-ink">{s.title}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-map-navy">
                    <MessageCircle className="h-4 w-4" /> 피드백 남기기
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 자주 묻는 질문 (스냅 대상 아님, 자유 스크롤) */}
      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <BlockList blocks={faqPage?.publishedBlocks ?? []} role="auditor" />
      </div>
    </PublicShell>
  );
}
