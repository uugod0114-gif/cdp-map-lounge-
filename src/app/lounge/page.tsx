import { redirect } from "next/navigation";

// '라운지'는 이제 별도 페이지가 아니라 홈 화면(/) 자체로 통합되었습니다.
export default function LoungeRedirectPage() {
  redirect("/");
}
