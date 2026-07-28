import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * service role key를 사용하는 관리자 클라이언트.
 * "server-only" 패키지로 클라이언트 번들에 절대 포함되지 않도록 강제한다.
 * super_admin 권한 검증을 통과한 서버 액션/라우트 핸들러에서만 사용한다.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL 환경변수가 설정되지 않았습니다.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
