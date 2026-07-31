import "server-only";

/**
 * 인증코드 이메일을, Resend 같은 외부 서비스 대신
 * 구글시트에 연결된 Apps Script(MailApp)를 통해 발송한다.
 * 이 스크립트를 배포한 구글 계정(예: 2220466@daewoong.co.kr) 이름으로 메일이 나간다.
 * 회사가 구글 워크스페이스를 쓰는 경우, 별도 도메인 인증 없이 바로 동작한다.
 */
export async function sendVerificationEmailViaAppsScript(
  to: string,
  code: string,
): Promise<{ ok: boolean; message?: string }> {
  const url = process.env.GOOGLE_SHEET_APPEND_URL;
  const secret = process.env.GOOGLE_SHEET_APPEND_SECRET;

  if (!url) {
    console.warn("[email] GOOGLE_SHEET_APPEND_URL이 설정되지 않아 이메일을 보낼 수 없습니다.");
    return { ok: false, message: "이메일 발송 설정이 되어 있지 않습니다." };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sendCode", email: to, code, secret }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      console.warn("[email] Apps Script 발송 실패:", data);
      return { ok: false, message: "이메일 발송에 실패했습니다." };
    }
    return { ok: true };
  } catch (error) {
    console.warn("[email] 이메일 발송 중 오류가 발생했습니다.", error);
    return { ok: false, message: "이메일 발송 중 오류가 발생했습니다." };
  }
}
