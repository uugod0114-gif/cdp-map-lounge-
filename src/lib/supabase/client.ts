import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트.
 * anon key만 사용하며 service role key는 절대 노출하지 않는다.
 *
 * Phase 1에서는 .env.local이 없어도 앱이 죽지 않도록
 * placeholder 값으로 fallback 한다. Phase 2에서 실제 Supabase
 * 프로젝트를 연결하면 자동으로 실 데이터로 전환된다.
 */
export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

  return createBrowserClient(url, anonKey);
}
