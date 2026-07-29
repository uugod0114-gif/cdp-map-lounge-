"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { useDemoUser } from "@/features/auth/role-context";
import { loginWithRosterName } from "@/features/auth/roster-actions";
import type { UserRole } from "@/types/content";

const ROLE_HOME: Record<UserRole, string> = {
  super_admin: "/",
  operator: "/",
  editor: "/",
  learner: "/",
  auditor: "/",
  mentor: "/",
  instructor: "/",
};

export function RosterLoginForm() {
  const { loginAs } = useDemoUser();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await loginWithRosterName(name);
    setLoading(false);

    if (!result.ok || !result.role || !result.name) {
      setError(result.message ?? "로그인에 실패했습니다.");
      return;
    }

    const role = result.role as UserRole;
    loginAs({ name: result.name, role });
    router.push(ROLE_HOME[role]);
  }

  return (
    <Card className="mt-8 bg-white text-map-ink">
      <form onSubmit={handleSubmit}>
        <label className="mb-2 block text-sm font-semibold text-slate-600">이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex. 홍길동"
          className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          autoFocus
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" variant="primary" disabled={loading}>
          {loading ? "확인 중…" : "로그인"}
        </Button>
      </form>
    </Card>
  );
}