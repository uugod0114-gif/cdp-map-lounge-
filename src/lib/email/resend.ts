import "server-only";
import { Resend } from "resend";

/**
 * 회원가입 인증코드 이메일 발송.
 * RESEND_API_KEY 환경변수가 필요하다 (resend.com에서 발급).
 *
 * 주의: Resend는 발신 도메인을 인증하기 전까지는 계정 소유자 본인의 이메일로만
 * 실제 발송이 된다. 회사 도메인을 인증하면 모든 그룹웨어 이메일로 발송 가능해진다.
 * https://resend.com/domains
 */
export async function sendVerificationEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY가 설정되지 않아 이메일을 보낼 수 없습니다.");
    return { ok: false, message: "이메일 발송 설정이 되어 있지 않습니다." };
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "CDP MAP Lounge <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject: "[CDP MAP Lounge] 이메일 인증코드",
      html: `
        <div style="font-family: sans-serif; padding: 24px;">
          <p style="font-size: 14px; color: #666;">CDP MAP Lounge 회원가입 인증코드입니다.</p>
          <p style="font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #0F8A5E;">${code}</p>
          <p style="font-size: 13px; color: #999;">이 코드는 10분간 유효합니다. 본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>
        </div>
      `,
    });

    if (error) {
      console.warn("[email] Resend 발송 오류:", error);
      return { ok: false, message: "이메일 발송에 실패했습니다." };
    }
    return { ok: true };
  } catch (error) {
    console.warn("[email] 이메일 발송 중 오류가 발생했습니다.", error);
    return { ok: false, message: "이메일 발송 중 오류가 발생했습니다." };
  }
}
