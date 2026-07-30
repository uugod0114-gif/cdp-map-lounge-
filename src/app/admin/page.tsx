import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/common/card";
import {
  getDashboardStats,
  listActivityLogs,
  listPages,
  listSessions,
} from "@/services/content-service";
import { DashboardCharts } from "@/components/analytics/dashboard-charts";

export default async function AdminDashboardPage() {
  const [stats, pages, sessions, logs] = await Promise.all([
    getDashboardStats(),
    listPages(),
    listSessions(),
    listActivityLogs(15),
  ]);

  const reviewTargets = [
    ...pages.filter((p) => p.status === "in_review").map((p) => ({ id: p.id, title: p.title, href: `/admin/pages/${p.id}/edit` })),
    ...sessions
      .filter((s) => s.status === "in_review")
      .map((s) => ({ id: s.id, title: s.title, href: `/admin/sessions/${s.id}/edit` })),
  ];

  const statCards = [
    { label: "오늘 방문자 수", value: stats.visitorsToday },
    { label: "신청자 수", value: stats.applicants },
    { label: "수강자 수", value: stats.learners },
    { label: "청강자 수", value: stats.auditors },
    { label: "출석률", value: `${stats.attendanceRate}%` },
    { label: "피드백 응답률", value: `${stats.feedbackResponseRate}%` },
    { label: "과제 제출률", value: `${stats.assignmentSubmissionRate}%` },
    { label: "과제 완료율", value: `${stats.assignmentCompletionRate}%` },
    { label: "멘토 평균 응답시간", value: `${stats.mentorAvgResponseHours}시간` },
  ];

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-map-ink">운영 대시보드</h1>
          <p className="text-sm text-slate-500">CDP MAP 2기 운영 현황을 한눈에 확인하세요.</p>
        </div>
        {reviewTargets.length > 0 && (
          <Link
            href={reviewTargets[0].href}
            className="rounded-full bg-map-gold-soft px-4 py-2 text-sm font-semibold text-map-navy"
          >
            검토 대기 {reviewTargets.length}건 →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="text-center">
            <p className="font-display text-2xl font-medium text-map-navy">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>

        <Card>
          <p className="mb-3 font-bold text-map-ink">검토 대기 콘텐츠</p>
          {reviewTargets.length === 0 && (
            <p className="text-sm text-slate-400">검토 대기 중인 콘텐츠가 없습니다.</p>
          )}
          <ul className="flex flex-col gap-2">
            {reviewTargets.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.href}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-map-navy"
                >
                  {t.title}
                  <span className="text-xs text-map-navy">검토하기</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <p className="mb-3 font-bold text-map-ink">최근 활동 / 접속 기록</p>
        {logs.length === 0 ? (
          <p className="text-sm text-slate-400">아직 기록된 활동이 없습니다. 콘텐츠를 수정해 보세요.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                <span>
                  <span className="font-semibold text-map-ink">{l.actor}</span>
                  <span className="text-slate-500"> · {l.action}</span>
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(l.createdAt).toLocaleString("ko-KR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminShell>
  );
}
