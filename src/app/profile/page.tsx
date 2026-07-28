"use client";
import { LoungeShell } from "@/components/layout/lounge-shell";
import { Card } from "@/components/common/card";
import { useDemoUser } from "@/features/auth/role-context";
import { ROLE_LABEL } from "@/lib/permissions/roles";

export default function ProfilePage() {
  const { user } = useDemoUser();
  return (
    <LoungeShell>
      <h1 className="mb-6 font-display text-2xl font-medium text-map-ink">내 프로필</h1>
      <Card className="max-w-md">
        <p className="text-lg font-bold text-map-ink">{user.name}</p>
        <p className="mt-1 text-sm text-slate-500">{ROLE_LABEL[user.role]}</p>
      </Card>
    </LoungeShell>
  );
}
