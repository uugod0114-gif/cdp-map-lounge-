import { Card } from "@/components/common/card";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { listAnnouncements } from "@/services/content-service";

export default async function AnnouncementsPage() {
  const announcements = await listAnnouncements();
  return (
    <LoungeShell>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">공지사항</h1>
      <div className="flex flex-col gap-4">
        {announcements.map((a) => (
          <Card key={a.id}>
            {a.pinned && (
              <span className="mb-2 inline-block rounded-full bg-map-gold-soft px-2 py-0.5 text-xs font-semibold text-map-navy">
                고정
              </span>
            )}
            <p className="text-lg font-bold text-map-ink">{a.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{a.body}</p>
            <p className="mt-3 text-xs text-slate-400">
              {new Date(a.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </Card>
        ))}
      </div>
    </LoungeShell>
  );
}
