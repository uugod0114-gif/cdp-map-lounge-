import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { Card } from "@/components/common/card";
import { CalendarDays, MapPin } from "lucide-react";
import { getPageBySlug, listSessions } from "@/services/content-service";

export default async function AboutPage() {
  const [aboutPage, faqPage, sessions] = await Promise.all([
    getPageBySlug("about"),
    getPageBySlug("faq"),
    listSessions(),
  ]);

  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <BlockList blocks={aboutPage?.publishedBlocks ?? []} role="auditor" />
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
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

      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <BlockList blocks={faqPage?.publishedBlocks ?? []} role="auditor" />
      </div>
    </PublicShell>
  );
}