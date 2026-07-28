import { AdminShell } from "@/components/layout/admin-shell";
import { MaterialsAdminForm } from "@/components/cms/materials-admin-form";
import { listMaterials, listSessions } from "@/services/content-service";

export default async function AdminMaterialsPage() {
  const [sessions, materials] = await Promise.all([listSessions(), listMaterials()]);
  return (
    <AdminShell>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">자료 관리</h1>
      <p className="mb-6 text-sm text-slate-500">
        회차를 고르고, 웍스드라이브 등에서 복사한 파일별 공유 링크를 붙여넣어 등록하세요.
      </p>
      <MaterialsAdminForm sessions={sessions} materials={materials} />
    </AdminShell>
  );
}
