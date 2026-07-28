import { PublicShell } from "@/components/layout/public-shell";
import { WaveBackground } from "@/components/common/wave-background";
import { RosterLoginForm } from "@/features/auth/roster-login-form";
import { fetchRosterFromSheet } from "@/lib/roster/google-sheet";

export default async function LoginPage() {
  const roster = await fetchRosterFromSheet();

  return (
    <PublicShell>
      <div className="relative overflow-hidden bg-map-navy py-16 text-white">
        <WaveBackground />
        <div className="relative z-10 mx-auto max-w-md px-4 sm:px-6">
          <p className="text-sm font-semibold text-map-gold">CDP MAP Lounge</p>
          <h1 className="mt-2 font-display text-3xl font-medium">로그인</h1>
          <p className="mt-2 text-sm text-slate-300">
            신청 접수한 이름을 입력해주세요. 신청 후 로그인이 가능합니다. (ex. 홍길동)
          </p>

          <RosterLoginForm />

          {roster.length === 0 && (
            <p className="mt-4 text-xs text-amber-300">
              명단을 아직 불러오지 못했어요. 운영진에게 .env.local의 GOOGLE_SHEET_ID /
              GOOGLE_SHEET_ROSTER_GID 설정을 확인해 달라고 해주세요.
            </p>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
