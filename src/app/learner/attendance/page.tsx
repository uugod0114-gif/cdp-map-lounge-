import { PublicShell } from "@/components/layout/public-shell";
import { AttendanceBoard } from "@/components/attendance/attendance-board";
import { listSessions } from "@/services/content-service";

export default async function AttendancePage() {
  const sessions = await listSessions();
  return (
    <PublicShell><div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 font-display text-2xl font-medium text-map-ink">출석 체크</h1>
      <p className="mb-6 text-sm text-slate-500">
        각 회차 오전/오후 시작 시간에 맞춰 도장을 찍어주세요. 한 번 찍으면 취소할 수 없어요.
      </p>
      <AttendanceBoard sessions={sessions} />
    </div></PublicShell>
  );
}
