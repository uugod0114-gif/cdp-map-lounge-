import { FileText } from "lucide-react";
import { Card } from "@/components/common/card";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { MaterialActions } from "@/components/materials/material-actions";
import { listMaterials } from "@/services/content-service";

export default async function MaterialsPage() {
  const materials = await listMaterials();
  return (
    <LoungeShell>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">강의 자료</h1>
      <p className="mb-4 text-sm text-slate-500">
        자료 목록은 누구나 볼 수 있지만, 실제 다운로드·열람은 로그인(라운지 명단 확인) 후에만 가능합니다.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {materials.map((m) => (
          <Card key={m.id} className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-map-ink">{m.title}</p>
              <p className="mt-1 text-sm text-slate-500">{m.description}</p>
              <div className="mt-3">
                <MaterialActions
                  materialId={m.id}
                  fileUrl={m.fileUrl}
                  flipbookEnabled={m.flipbookEnabled}
                  downloadAllowed={m.downloadAllowed}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </LoungeShell>
  );
}
