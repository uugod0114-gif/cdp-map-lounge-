import { PublicShell } from "@/components/layout/public-shell";
import { WaveBackground } from "@/components/common/wave-background";
import { EmailAuthForm } from "@/features/auth/email-auth-form";

export default function LoginPage() {
  return (
    <PublicShell>
      <div className="relative overflow-hidden bg-map-navy py-16 text-white">
        <WaveBackground />
        <div className="relative z-10 mx-auto max-w-md px-4 sm:px-6">
          <p className="text-sm font-semibold text-map-gold">CDP MAP Lounge</p>
          <h1 className="mt-2 font-display text-3xl font-medium">로그인 / 회원가입</h1>
          <p className="mt-2 text-sm text-slate-300">
            그룹웨어 이메일로 처음 가입하시면 인증코드를 보내드려요. 인증이 끝나면
            다음부터는 이메일 입력만으로 로그인할 수 있어요.
          </p>

          <EmailAuthForm />
        </div>
      </div>
    </PublicShell>
  );
}
