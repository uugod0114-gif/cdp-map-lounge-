import { LoungeShell } from "@/components/layout/lounge-shell";
import { Card } from "@/components/common/card";
import { ClipboardList } from "lucide-react";

// TODO(2번 담당자): 회차별 과제 목록 + 제출 화면으로 채워주세요.
// 참고: src/services/content-service.ts의 Q&A/출석 섹션과 같은 패턴으로
// Assignment 타입 + 서버 액션을 추가하면 됩니다.
export default function LearnerAssignmentsPage() {
  return (
    <LoungeShell>
      <div className="mb-6 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-map-navy" />
        <h1 className="font-display text-2xl font-medium text-map-ink">과제 관리</h1>
      </div>
      <Card className="text-center text-slate-400">
        회차별 과제 제출 화면을 준비 중입니다. (멘토 PM과의 댓글 협업 포함 예정)
      </Card>
    </LoungeShell>
  );
}
