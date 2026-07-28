import { LoungeShell } from "@/components/layout/lounge-shell";
import { Card } from "@/components/common/card";

export default function NotificationsPage() {
  return (
    <LoungeShell>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">알림</h1>
      <Card className="text-center text-slate-400">아직 새 알림이 없습니다.</Card>
    </LoungeShell>
  );
}
