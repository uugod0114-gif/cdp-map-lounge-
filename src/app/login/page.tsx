import { PublicShell } from "@/components/layout/public-shell";
import { WaveBackground } from "@/components/common/wave-background";
import { RosterLoginForm } from "@/features/auth/roster-login-form";
import { fetchRosterFromSheet } from "@/lib/roster/google-sheet";

export default async function LoginPage() {
  const roster = await fetchRosterFromSheet();
  const rosterNames = roster.map((m) => m.name);

  return (
    <PublicShell>
      <div className="relative overflow-hidden bg-map-navy py-16 text-white">
        <WaveBackground />
        <div className="relative z-10 mx-auto max-w-md px-4 sm:px-6">
          <p className="text-sm font-semibold text-map-gold">CDP MAP Lounge</p>
          <h1 className="mt-2 font-display text-3xl font-medium">로그인</h1>
          <p className="mt-2 text-sm text-slate-300">
            라운지 명단(구글시트)에 등록된 이름으로 로그인하면 역할에 맞는 라운지로 자동 이동합니다.
          </p>

          <RosterLoginForm />

          {/* 임시 진단용 문구 - 원인 파악되면 제거 예정 */}
          <p className="mt-4 text-xs text-slate-400">
            (진단용) 명단에서 총 {rosterNames.length}명을 불러왔습니다.
          </p>

          {rosterNames.length === 0 && (
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