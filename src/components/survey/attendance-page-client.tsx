"use client";

import * as React from "react";

const SURVEY_URL = "https://script.google.com/macros/s/AKfycbwBRg1_cSme8wPN9TRYTJRBqcUT_RyrcMMKu52B5olDSmw-35fr62eRmp2CgnePinVf/exec";
const SECRET = "cdpmap-survey-2026";

type Role = "수강" | "청강" | "";

export function AttendancePageClient() {
  const [role, setRole] = React.useState<Role>("");
  const [dept, setDept] = React.useState("");
  const [name, setName] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");

  // no-cors라 응답을 읽을 수 없어 성공 여부를 확인할 방법이 없었고, 실패해도
  // 어차피 "출석 완료" 화면을 그대로 보여주던 구조라 await로 기다릴 이유가
  // 없었다. await를 없애 버튼을 누르는 즉시 반응하게 하고, keepalive로 화면을
  // 빨리 넘어가도 요청이 끊기지 않게 한다.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dept.trim() || !name.trim()) {
      setError("소속과 이름을 모두 입력해주세요.");
      return;
    }
    setError("");
    fetch(SURVEY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "attendance", session: "2회차", role, dept: dept.trim(), name: name.trim(), secret: SECRET }),
      mode: "no-cors",
      keepalive: true,
    }).catch(() => {});
    setDone(true);
  }

  if (!role) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
            <a href="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-sm font-bold text-white">MAP</span>
              <span className="font-bold text-slate-800">CDP MAP Lounge</span>
            </a>
            <span className="ml-2 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">2회차 출석</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <p className="text-4xl mb-4">✋</p>
            <h2 className="text-xl font-bold text-slate-800 mb-2">출석 체크</h2>
            <p className="text-sm text-slate-500 mb-6">참여 유형을 선택해주세요.</p>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => setRole("수강")}
                className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800">
                수강자
              </button>
              <button type="button" onClick={() => setRole("청강")}
                className="w-full rounded-full border border-green-700 py-3 text-sm font-bold text-green-700 hover:bg-green-50">
                청강자
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-sm font-bold text-white">MAP</span>
            <span className="font-bold text-slate-800">CDP MAP Lounge</span>
          </a>
          <span className="ml-2 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">2회차 출석</span>
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-500">{role}자</span>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {done ? (
          <div className="w-full max-w-sm rounded-2xl border border-green-200 bg-green-50 p-10 text-center shadow-sm">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-xl font-bold text-green-700">출석 완료!</p>
            <p className="mt-2 text-sm text-slate-500">{dept} {name}님, 출석이 확인되었습니다.</p>
            <p className="mt-1 text-xs text-slate-400">오늘 교육도 수고 많으셨어요 🎉</p>
          </div>
        ) : (
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-slate-800">2회차 출석하기</h2>
            <p className="mb-6 text-sm text-slate-400">소속과 이름을 입력해주세요.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-600">소속</label>
                <input
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="예) 병원서울1"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm focus:border-green-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-600">이름</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예) 홍길동"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm focus:border-green-600 focus:outline-none"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit"
                className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800">
                출석 제출
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}