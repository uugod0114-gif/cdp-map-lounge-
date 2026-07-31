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

const COMPANY_DOMAIN = "daewoong.co.kr";

type Tab = "signup" | "login";
type SignupStep = "details" | "code";
type DomainMode = "company" | "custom";

function EmailDomainInput({
  localPart,
  setLocalPart,
  domainMode,
  setDomainMode,
  customDomain,
  setCustomDomain,
}: {
  localPart: string;
  setLocalPart: (v: string) => void;
  domainMode: DomainMode;
  setDomainMode: (v: DomainMode) => void;
  customDomain: string;
  setCustomDomain: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-600">회사 이메일</label>
      <div className="flex items-stretch gap-2">
        <input
          value={localPart}
          onChange={(e) => setLocalPart(e.target.value)}
          placeholder="hong.gildong"
          className="min-w-0 flex-1 rounded-lg border border-map-line px-3 py-2.5 text-sm"
        />
        {domainMode === "company" ? (
          <span className="flex items-center whitespace-nowrap rounded-lg bg-map-mist px-3 text-sm text-slate-500">
            @{COMPANY_DOMAIN}
          </span>
        ) : (
          <span className="flex items-center rounded-lg bg-map-mist px-2 text-sm text-slate-500">@</span>
        )}
      </div>
      {domainMode === "custom" && (
        <input
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value)}
          placeholder="affiliate-company.co.kr"
          className="mt-2 w-full rounded-lg border border-map-line px-3 py-2.5 text-sm"
        />
      )}
      <button
        type="button"
        onClick={() => setDomainMode(domainMode === "company" ? "custom" : "company")}
        className="mt-1.5 text-xs text-slate-400 underline underline-offset-4"
      >
        {domainMode === "company"
          ? "관계사 등 다른 도메인 이메일을 쓰시나요? 직접 입력하기"
          : `@${COMPANY_DOMAIN} 사용하기`}
      </button>
    </div>
  );
}

export function EmailAuthForm() {
  const { loginAs } = useDemoUser();
  const router = useRouter();

  const [tab, setTab] = React.useState<Tab>("signup");

  // 회원가입 상태
  const [signupStep, setSignupStep] = React.useState<SignupStep>("details");
  const [name, setName] = React.useState("");
  const [localPart, setLocalPart] = React.useState("");
  const [domainMode, setDomainMode] = React.useState<DomainMode>("company");
  const [customDomain, setCustomDomain] = React.useState("");
  const [category, setCategory] = React.useState<"learner" | "auditor">("learner");
  const [code, setCode] = React.useState("");

  // 로그인 상태
  const [loginEmail, setLoginEmail] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  const signupEmail = `${localPart}@${domainMode === "company" ? COMPANY_DOMAIN : customDomain}`;

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
    setInfo(null);
  }

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!localPart.trim() || (domainMode === "custom" && !customDomain.trim())) {
      setError("이메일을 정확히 입력해 주세요.");
      return;
    }

    setLoading(true);
    const result = await requestSignupCode(name, signupEmail, category);
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? "인증코드 발송에 실패했어요.");
      return;
    }
    setInfo("인증코드를 이메일로 보냈어요. 메일함(스팸함 포함)을 확인해 주세요.");
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
            해당 사이트는 대웅/관계사 임직원만 접속할 수 있습니다. 회사 이메일을 입력하시면
            인증코드를 보내드립니다.
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

          <EmailDomainInput
            localPart={localPart}
            setLocalPart={setLocalPart}
            domainMode={domainMode}
            setDomainMode={setDomainMode}
            customDomain={customDomain}
            setCustomDomain={setCustomDomain}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "발송 중…" : "인증코드 받기"}
          </Button>

          <p className="rounded-lg bg-map-gold-soft/60 p-3 text-xs leading-relaxed text-map-navy">
            인증코드는 외부 메일로 발송됩니다.
            <br />
            메일이 발송되지 않으면 <b>스팸메일함</b>을 확인해주세요!
          </p>
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
              placeholder="ex. hong@daewoong.co.kr"
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
