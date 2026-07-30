import { redirect } from "next/navigation";

// 교육 소개/일정/자료/피드백은 이제 홈 화면(/)의 섹션으로 통합되었습니다.
export default function AboutRedirectPage() {
  redirect("/#intro");
}
