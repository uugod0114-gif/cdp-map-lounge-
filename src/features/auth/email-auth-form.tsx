"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { useDemoUser } from "@/features/auth/role-context";
import {
  requestSignupCode,
  verifySignupCode,
  loginWithEmail,
} from "@/features/auth/signup-actions";
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

type Tab = "signup" | "login";
type SignupStep = "details" | "code";

export function EmailAuthForm() {
  const { loginAs } = useDemoUser();
  const router = useRouter();

  const [tab, setTab] = React.useState<Tab>("signup");

  // 회원가입 상태
  const [signupStep, setSignupStep] = React.useState<SignupStep>("details");
  const [name, setName] = React.useState("");
  const [signupEmail, setSignupEmail] = React.useState("");
  const [category, setCategory] = React.useState<"learner" | "auditor">("learner");
  const [code, setCode] = React.useState("");

  // 로그인 상태
  const [loginEmail, setLoginEmail] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
    setInfo(null);
  }

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await requestSignupCode(name, signupEmail, category);
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? "인증코드 발송에 실패했어요.");
      return;
    }
    setInfo("인증코드를 이메일로 보냈어요. 메일함을 확인해 주세요.");
    setSignupStep("code");
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await verifySignupCode(signupEmail, code);
    setLoading(false);

    if (!result.ok || !result.role || !result.name) {
      setError(result.message ?? "인증에 실패했어요.");
      return;
    }
    const role = result.role as UserRole;
    loginAs({ name: result.name, role });
    router.push(ROLE_HOME[role]);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await loginWithEmail(loginEmail);
    setLoading(false);

    if (!result.ok || !result.role || !result.name) {
      setError(result.message ?? "로그인에 실패했어요.");
      return;
    }
    const role = result.role as UserRole;
    loginAs({ name: result.name, role });
    router.push(ROLE_HOME[role]);
  }

  return (
    <Card className="mt-8 bg-white text-map-ink">
      <div className="mb-5 flex rounded-full bg-map-mist p-1">
        <button
          type="button"
          onClick={() => switchTab("signup")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
            tab === "signup" ? "bg-white text-map-navy shadow-sm" : "text-slate-500"
          }`}
        >
          처음이에요 (회원가입)
        </button>
        <button
          type="button"
          onClick={() => switchTab("login")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
            tab === "login" ? "bg-white text-map-navy shadow-sm" : "text-slate-500"
          }`}
        >
          이미 가입했어요
        </button>
      </div>

      {tab === "signup" && signupStep === "details" && (
        <form onSubmit={handleRequestCode} className="flex flex-col gap-3">
          <p className="rounded-lg bg-map-gold-soft/60 p-3 text-xs leading-relaxed text-map-navy">
            별도 교육 신청 제출과 다르게, 본인 확인을 위해 그룹웨어 이메일 주소로 라운지
            회원가입을 요청드립니다.
          </p>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">참여 유형</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "learner" | "auditor")}
              className="w-full rounded-lg border border-map-line px-3 py-2.5 text-sm"
            >
              <option value="learner">수강자</option>
              <option value="auditor">청강자</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. 홍길동"
              className="w-full rounded-lg border border-map-line px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">그룹웨어 이메일</label>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="ex. hong@company.com"
              className="w-full rounded-lg border border-map-line px-3 py-2.5 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "발송 중…" : "인증코드 받기"}
          </Button>
        </form>
      )}

      {tab === "signup" && signupStep === "code" && (
        <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
          {info && <p className="text-sm text-map-navy">{info}</p>}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">
              {signupEmail}로 받은 6자리 인증코드
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full rounded-lg border border-map-line px-3 py-2.5 text-center text-lg tracking-[0.3em]"
              maxLength={6}
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "확인 중…" : "인증하고 가입 완료"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setSignupStep("details");
              setError(null);
              setInfo(null);
            }}
            className="text-xs text-slate-400 underline underline-offset-4"
          >
            이메일 다시 입력하기
          </button>
        </form>
      )}

      {tab === "login" && (
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">가입한 이메일</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="ex. hong@company.com"
              className="w-full rounded-lg border border-map-line px-3 py-2.5 text-sm"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "확인 중…" : "로그인"}
          </Button>
        </form>
      )}
    </Card>
  );
}
