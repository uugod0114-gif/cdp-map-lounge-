import { AdminShell } from "@/components/layout/admin-shell";
import { ScheduleEditorTable } from "@/components/cms/schedule-editor-table";
import { listSessions } from "@/services/content-service";

export default async function AdminSchedulePage() {
  const sessions = await listSessions();
  return (
    <AdminShell>
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">교육 일정 관리</h1>
      <p className="mb-6 text-sm text-slate-500">
        회차별 제목, 날짜, 시간, 장소를 직접 수정하고 저장할 수 있습니다. 저장하면 공개 사이트의
        일정/메인 화면에도 바로 반영됩니다.
      </p>
      <ScheduleEditorTable sessions={sessions} />
    </AdminShell>
  );
}
