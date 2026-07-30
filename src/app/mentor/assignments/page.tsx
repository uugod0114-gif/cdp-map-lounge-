import { LoungeShell } from "@/components/layout/lounge-shell";
import { Card } from "@/components/common/card";
import { ClipboardList } from "lucide-react";

// TODO(2번 담당자): 담당 수강자들의 과제 제출물 확인 + 댓글/수정요청/완료처리 화면으로 채워주세요.
export default function MentorAssignmentsPage() {
  return (
    <LoungeShell>
      <div className="mb-6 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-map-navy" />
        <h1 className="font-display text-2xl font-medium text-map-ink">과제 관리</h1>
      </div>
      <Card className="text-center text-slate-400">
        담당 수강자 과제 확인/피드백 화면을 준비 중입니다.
      </Card>
    </LoungeShell>
  );
}
