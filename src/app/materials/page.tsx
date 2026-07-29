import { FileText } from "lucide-react";
import { Card } from "@/components/common/card";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { MaterialActions } from "@/components/materials/material-actions";
import { listMaterials, listSessions } from "@/services/content-service";
import type { MaterialItem } from "@/types/content";

function MaterialCard({ material }: { material: MaterialItem }) {
  return (
    <Card className="flex items-start gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
        <FileText className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-map-ink">{material.title}</p>
        <p className="mt-1 text-sm text-slate-500">{material.description}</p>
        <div className="mt-3">
          <MaterialActions
            materialId={material.id}
            fileUrl={material.fileUrl}
            downloadUrl={material.downloadUrl}
            flipbookEnabled={material.flipbookEnabled}
            downloadAllowed={material.downloadAllowed}
          />
        </div>
      </div>
    </Card>
  );
}

export default async function MaterialsPage() {
  const [materials, sessions] = await Promise.all([listMaterials(), listSessions()]);

  const materialsBySession = new Map<string, MaterialItem[]>();
  const unassigned: MaterialItem[] = [];

  for (const m of materials) {
    if (m.sessionId) {
      const list = materialsBySession.get(m.sessionId) ?? [];
      list.push(m);
      materialsBySession.set(m.sessionId, list);
    } else {
      unassigned.push(m);
    }
  }

  const sessionsWithMaterials = sessions.filter((s) => materialsBySession.has(s.id));

  return (
    <LoungeShell>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">강의 자료</h1>
      <p className="mb-8 text-sm text-slate-500">
        자료 목록은 누구나 볼 수 있지만, 실제 다운로드·열람은 로그인(라운지 명단 확인) 후에만 가능합니다.
      </p>

      {sessionsWithMaterials.length === 0 && unassigned.length === 0 && (
        <Card className="text-center text-slate-400">아직 등록된 자료가 없습니다.</Card>
      )}

      <div className="flex flex-col gap-10">
        {sessionsWithMaterials.map((session) => (
          <section key={session.id}>
            <h2 className="mb-4 font-display text-lg font-medium text-map-ink">
              {session.week}회차 · {session.title}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {materialsBySession.get(session.id)!.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          </section>
        ))}

        {unassigned.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-lg font-medium text-map-ink">공통 자료</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {unassigned.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </LoungeShell>
  );
}