import "server-only";

/**
 * 회원가입 인증이 끝난 사용자를 "라운지 명단" 구글시트에 자동으로 한 줄 추가한다.
 * Google Sheets에 연결된 Apps Script 웹앱(doPost)을 호출하는 방식이라
 * 별도의 Google Cloud 서비스 계정 설정 없이도 시트에 쓸 수 있다.
 *
 * 필요한 환경변수:
 *   GOOGLE_SHEET_APPEND_URL     - Apps Script를 "웹 앱"으로 배포했을 때 나오는 /exec 주소
 *   GOOGLE_SHEET_APPEND_SECRET  - Apps Script 코드 안의 SHARED_SECRET과 동일한 값
 */
export async function appendRosterRow(
  category: string,
  name: string,
  email: string,
): Promise<{ ok: boolean; message?: string }> {
  const url = process.env.GOOGLE_SHEET_APPEND_URL;
  const secret = process.env.GOOGLE_SHEET_APPEND_SECRET;

  if (!url) {
    console.warn("[roster] GOOGLE_SHEET_APPEND_URL이 설정되지 않아 시트에 기록하지 못했습니다.");
    return { ok: false, message: "시트 자동 등록 설정이 되어 있지 않습니다." };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, name, email, secret }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      console.warn("[roster] 시트 기록 실패:", data);
      return { ok: false, message: "시트에 기록하는 중 오류가 발생했습니다." };
    }
    return { ok: true };
  } catch (error) {
    console.warn("[roster] 시트 기록 중 오류가 발생했습니다.", error);
    return { ok: false, message: "시트에 기록하는 중 오류가 발생했습니다." };
  }
}
