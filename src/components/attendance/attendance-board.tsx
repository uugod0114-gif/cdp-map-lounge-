"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/common/card";
import { useDemoUser } from "@/features/auth/role-context";
import { checkAttendanceAction, getMyAttendanceAction } from "@/features/attendance/actions";
import { cn } from "@/lib/utils/cn";
import type { AttendanceRecord, SessionRecord } from "@/types/content";

function Stamp({
  checked,
  label,
  onClick,
  disabled,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || checked}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border py-4 text-sm font-medium transition",
        checked
          ? "border-map-navy bg-map-navy text-white"
          : "border-dashed border-slate-300 text-slate-400 hover:border-map-navy hover:text-map-navy",
      )}
    >
      {checked ? <Check className="h-5 w-5" /> : <span className="h-5 w-5 rounded-full border-2 border-current" />}
      {label}
    </button>
  );
}

export function AttendanceBoard({ sessions }: { sessions: SessionRecord[] }) {
  const { user, isLoggedIn } = useDemoUser();
  const [records, setRecords] = React.useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 로그인 상태(외부 컨텍스트) 변화에 따른 동기화
      setLoading(false);
      return;
    }
    getMyAttendanceAction(user.name).then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, [user.name, isLoggedIn]);

  async function handleStamp(sessionId: string, period: "am" | "pm") {
    const result = await checkAttendanceAction(sessionId, user.name, period);
    if (result.ok && result.record) {
      setRecords((prev) => [...prev, result.record as AttendanceRecord]);
    }
  }

  if (!isLoggedIn) {
    return <Card className="text-center text-slate-400">로그인 후 이용할 수 있습니다.</Card>;
  }

  if (loading) {
    return <Card className="text-center text-slate-400">출석 기록을 불러오는 중…</Card>;
  }

  const isChecked = (sessionId: string, period: "am" | "pm") =>
    records.some((r) => r.sessionId === sessionId && r.period === period);

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((s) => (
        <Card key={s.id} className="border-map-navy/10">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-map-navy-mute">{s.week}회차 · {s.date}</p>
              <p className="font-semibold text-map-ink">{s.title}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Stamp
              checked={isChecked(s.id, "am")}
              label="오전 출석"
              onClick={() => handleStamp(s.id, "am")}
            />
            <Stamp
              checked={isChecked(s.id, "pm")}
              label="오후 출석"
              onClick={() => handleStamp(s.id, "pm")}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
