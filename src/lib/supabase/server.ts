import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버 컴포넌트 / 서버 액션 / 라우트 핸들러 전용 Supabase 클라이언트.
 * 반드시 anon key를 사용한다. service role key가 필요한 관리 작업은
 * src/lib/supabase/admin.ts 처럼 별도의 서버 전용 파일로 분리하고,
 * 해당 파일은 클라이언트 컴포넌트에서 절대 import 하지 않는다.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component에서 호출된 경우 무시 (미들웨어가 세션을 갱신함)
        }
      },
    },
  });
}
