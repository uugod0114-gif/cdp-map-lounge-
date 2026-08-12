"use client";

import * as React from "react";

const SURVEY_URL = "https://script.google.com/macros/s/AKfycbzoSPV-zXzW7Xo1Hd7Ff7g-n7_PXUAom-boBn0VnLFF5QTyMYGVpH0lwUHq6kY4qjwm/exec";
const SECRET = "cdpmap-survey-2026";

const LECTURES = [
  { id: "L1", title: "PM의 성과창출 프로세스", instructor: "서욱" },
  { id: "L2", title: "우리 본부 PM 평가 맛보기", instructor: "박미경/김유신" },
  { id: "L3", title: "기초자료 검색법 & 논문의 이해", instructor: "채연지" },
  { id: "L4", title: "PM의 듀얼브레인, AI 실무 활용법", instructor: "황득경" },
  { id: "L5", title: "UBIST 데이터의 이해와 활용사례 & 실전 UBIST", instructor: "마케팅기획팀 데이터파트" },
];

type Tab = "lecture" | "overall";
type Role = "수강" | "청강" | "";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className={`text-3xl transition-transform hover:scale-110 ${star <= value ? "text-yellow-400" : "text-slate-200"}`}>
          ★
        </button>
      ))}
      {value > 0 && <span className="ml-2 self-center text-sm font-semibold text-slate-500">{value}점</span>}
    </div>
  );
}

function ChoiceButton({ labels, value, onChange }: { labels: string[]; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, i) => (
        <button key={i} type="button" onClick={() => onChange(i + 1)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            value === i + 1 ? "border-green-700 bg-green-700 text-white" : "border-slate-200 text-slate-500 hover:border-green-700 hover:text-green-700"
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 2 }: { value: string; onChange: (v: string) => void; placeholder: string; rows?: number }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-green-600 focus:outline-none" />
  );
}

export function SurveyPageClient() {
  const [role, setRole] = React.useState<Role>("");
  const [tab, setTab] = React.useState<Tab>("lecture");
  const [activeLecture, setActiveLecture] = React.useState(0);
  const [submitted, setSubmitted] = React.useState<Record<string, boolean>>({});
  const [sending, setSending] = React.useState(false);

  // 강의별
  const [lectureRatings, setLectureRatings] = React.useState<Record<string, number>>({});
  const [lectureGood, setLectureGood] = React.useState<Record<string, string>>({});
  const [lectureMemo, setLectureMemo] = React.useState<Record<string, string>>({});
  const [lectureHard, setLectureHard] = React.useState<Record<string, string>>({});

  // 수강자 전체 평가
  const [overallRating, setOverallRating] = React.useState(0);
  const [goalMet, setGoalMet] = React.useState(0);
  const [pmRole, setPmRole] = React.useState("");
  const [selfCheck, setSelfCheck] = React.useState(0);
  const [goodPoint, setGoodPoint] = React.useState("");
  const [improvePoint, setImprovePoint] = React.useState("");
  const [toStaff, setToStaff] = React.useState("");

  // 청강자 전체 평가
  const [auditRating, setAuditRating] = React.useState(0);
  const [applyable, setApplyable] = React.useState(0);
  const [applyDetail, setApplyDetail] = React.useState("");
  const [recommend, setRecommend] = React.useState(0);
  const [auditGood, setAuditGood] = React.useState("");
  const [auditToStaff, setAuditToStaff] = React.useState("");

  const currentLecture = LECTURES[activeLecture];

  async function sendToSheet(payload: Record<string, unknown>) {
    try {
      await fetch(SURVEY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, secret: SECRET, role }),
        mode: "no-cors",
      });
    } catch (_) {}
  }

  async function handleLectureSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = currentLecture.id;
    if (!lectureRatings[id]) return alert("별점을 선택해주세요.");
    setSending(true);
    await sendToSheet({
      type: "lecture",
      lectureId: id,
      lectureTitle: currentLecture.title,
      rating: lectureRatings[id],
      good: lectureGood[id] ?? "",
      memo: lectureMemo[id] ?? "",
      hard: lectureHard[id] ?? "",
    });
    setSending(false);
    setSubmitted((prev) => ({ ...prev, [id]: true }));
    if (activeLecture < LECTURES.length - 1) setActiveLecture((v) => v + 1);
  }

  async function handleOverallSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "수강") {
      if (!overallRating) return alert("전체 만족도 별점을 선택해주세요.");
      if (!pmRole.trim()) return alert("PM 역할/책임 한 줄 정리를 입력해주세요.");
      setSending(true);
      await sendToSheet({ type: "overall", overallRating, goalMet, pmRole, selfCheck, goodPoint, improvePoint, toStaff });
    } else {
      if (!auditRating) return alert("전체 만족도 별점을 선택해주세요.");
      setSending(true);
      await sendToSheet({ type: "overall_audit", auditRating, applyable, applyDetail, recommend, auditGood, auditToStaff });
    }
    setSending(false);
    setSubmitted((prev) => ({ ...prev, overall: true }));
  }

  // 참여 유형 선택
  if (!role) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
            <a href="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-sm font-bold text-white">MAP</span>
              <span className="font-bold text-slate-800">CDP MAP Lounge</span>
            </a>
            <span className="ml-2 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">1회차 설문</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <p className="text-4xl mb-4">👋</p>
            <h2 className="text-xl font-bold text-slate-800 mb-2">반갑습니다!</h2>
            <p className="text-sm text-slate-500 mb-6">1회차 설문을 시작하기 전에<br />참여 유형을 선택해주세요.</p>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => setRole("수강")}
                className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800">
                수강자로 참여
              </button>
              <button type="button" onClick={() => setRole("청강")}
                className="w-full rounded-full border border-green-700 py-3 text-sm font-bold text-green-700 hover:bg-green-50">
                청강자로 참여
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-sm font-bold text-white">MAP</span>
            <span className="font-bold text-slate-800">CDP MAP Lounge</span>
          </a>
          <span className="ml-2 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">1회차 설문</span>
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-500">{role}자</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">1회차 강의 설문조사</h1>
        <p className="mb-6 text-sm text-slate-500">솔직한 피드백이 더 좋은 교육을 만들어요. 익명으로 제출됩니다.</p>

        {/* 탭 */}
        <div className="mb-6 flex gap-2">
          <button type="button" onClick={() => setTab("lecture")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "lecture" ? "bg-green-700 text-white" : "border border-slate-200 text-slate-500 hover:border-green-700"}`}>
            📚 강의별 평가
          </button>
          <button type="button" onClick={() => setTab("overall")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "overall" ? "bg-green-700 text-white" : "border border-slate-200 text-slate-500 hover:border-green-700"}`}>
            📋 1회차 전체 평가
          </button>
        </div>

        {/* 강의별 평가 (수강자/청강자 공통) */}
        {tab === "lecture" && (
          <div>
            <div className="mb-5 flex flex-col gap-2">
              {LECTURES.map((lec, i) => (
                <button key={lec.id} type="button" onClick={() => setActiveLecture(i)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    activeLecture === i ? "border-green-700 bg-green-700 text-white"
                    : submitted[lec.id] ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-200 text-slate-600 hover:border-green-700"
                  }`}>
                  <span className={`text-xs font-bold ${activeLecture === i ? "text-green-200" : submitted[lec.id] ? "text-green-500" : "text-green-700"}`}>
                    {i + 1}강의{submitted[lec.id] && " ✓"}
                  </span>
                  <span className="ml-2">{lec.title}</span>
                </button>
              ))}
            </div>

            {submitted[currentLecture.id] ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <p className="text-3xl">✅</p>
                <p className="mt-2 font-bold text-green-700">{currentLecture.title}</p>
                <p className="mt-1 text-sm text-slate-500">제출 완료! 다음 강의를 선택하거나 전체 평가를 해주세요.</p>
              </div>
            ) : (
              <form onSubmit={handleLectureSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-800">{currentLecture.title}</h2>
                <p className="mb-5 text-xs text-slate-400">교수진: {currentLecture.instructor}</p>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">⭐ 강의 만족도 (5점 만점) *</label>
                  <StarRating value={lectureRatings[currentLecture.id] ?? 0}
                    onChange={(v) => setLectureRatings((prev) => ({ ...prev, [currentLecture.id]: v }))} />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">👍 좋았던 점</label>
                  <Textarea value={lectureGood[currentLecture.id] ?? ""} onChange={(v) => setLectureGood((prev) => ({ ...prev, [currentLecture.id]: v }))} placeholder="강의에서 좋았던 점을 자유롭게 적어주세요" />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">💡 가장 기억에 남는 점</label>
                  <Textarea value={lectureMemo[currentLecture.id] ?? ""} onChange={(v) => setLectureMemo((prev) => ({ ...prev, [currentLecture.id]: v }))} placeholder="인상 깊었거나 새로 알게 된 내용은?" />
                </div>
                <div className="mb-6">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">🤔 어려웠거나 더 알고 싶은 점</label>
                  <Textarea value={lectureHard[currentLecture.id] ?? ""} onChange={(v) => setLectureHard((prev) => ({ ...prev, [currentLecture.id]: v }))} placeholder="이해가 어려웠거나 더 다뤄줬으면 했던 내용은?" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60">
                  {sending ? "제출 중…" : "이 강의 평가 제출"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 전체 평가 - 수강자 */}
        {tab === "overall" && role === "수강" && (
          submitted.overall ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
              <p className="text-4xl">🎉</p>
              <p className="mt-3 text-xl font-bold text-green-700">1회차 전체 설문 제출 완료!</p>
              <p className="mt-1 text-sm text-slate-500">소중한 피드백 감사해요. 다음 회차에 반영하겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleOverallSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-800">📋 1회차 전체 평가 (수강자)</h2>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">⭐ 1회차 전체 만족도 (5점 만점) *</label>
                <StarRating value={overallRating} onChange={setOverallRating} />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">🎯 1회차 교육이 목표에 맞게 잘 이뤄졌다고 생각하시나요?</label>
                <ChoiceButton value={goalMet} onChange={setGoalMet} labels={["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"]} />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">💼 PM에게 가장 중요한 역할/책임을 한 줄로 정리해주세요 *</label>
                <Textarea value={pmRole} onChange={setPmRole} placeholder="예) PM은 데이터 기반으로 의사결정을 이끌고 팀의 방향성을 제시하는 사람이다." rows={3} />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">📊 기본지식 · 학술자료분석 · 시장분석 기초가 쌓였다고 느끼시나요? (셀프 평가)</label>
                <ChoiceButton value={selfCheck} onChange={setSelfCheck} labels={["전혀 아니다", "조금 부족", "보통", "어느 정도", "충분히 쌓였다"]} />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-slate-700">😊 오늘 교육에서 좋았던 점</label>
                <Textarea value={goodPoint} onChange={setGoodPoint} placeholder="강의, 운영, 환경 등 자유롭게 적어주세요" />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-slate-700">🔧 보완했으면 하는 점</label>
                <Textarea value={improvePoint} onChange={setImprovePoint} placeholder="개선이 필요한 부분이 있다면 편하게 적어주세요" />
              </div>
              <div className="mb-8">
                <label className="mb-1 block text-sm font-semibold text-slate-700">💬 운영진에게 하고 싶은 말</label>
                <Textarea value={toStaff} onChange={setToStaff} placeholder="건의사항, 요청사항, 응원 등 무엇이든 환영해요!" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60">
                {sending ? "제출 중…" : "1회차 전체 평가 제출"}
              </button>
            </form>
          )
        )}

        {/* 전체 평가 - 청강자 */}
        {tab === "overall" && role === "청강" && (
          submitted.overall ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
              <p className="text-4xl">🎉</p>
              <p className="mt-3 text-xl font-bold text-green-700">1회차 전체 설문 제출 완료!</p>
              <p className="mt-1 text-sm text-slate-500">소중한 피드백 감사해요. 다음 회차에 반영하겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleOverallSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-800">📋 1회차 전체 평가 (청강자)</h2>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">⭐ 1회차 전체 만족도 (5점 만점) *</label>
                <StarRating value={auditRating} onChange={setAuditRating} />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">💼 오늘 배운 내용 중 현업에서 바로 적용할 수 있는 부분이 있었나요?</label>
                <ChoiceButton value={applyable} onChange={setApplyable} labels={["전혀 없다", "거의 없다", "조금 있다", "꽤 있다", "많이 있다"]} />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-semibold text-slate-700">📝 있다면 어떤 내용인지 구체적으로 적어주세요</label>
                <Textarea value={applyDetail} onChange={setApplyDetail} placeholder="현업에 적용해보고 싶은 내용을 자유롭게 적어주세요" />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">🤝 이 교육을 주변 동료에게 추천하시겠어요?</label>
                <ChoiceButton value={recommend} onChange={setRecommend} labels={["절대 안 한다", "안 한다", "보통", "추천한다", "적극 추천한다"]} />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-slate-700">😊 오늘 교육에서 좋았던 점</label>
                <Textarea value={auditGood} onChange={setAuditGood} placeholder="강의 내용, 구성, 운영 등 자유롭게 적어주세요" />
              </div>
              <div className="mb-8">
                <label className="mb-1 block text-sm font-semibold text-slate-700">💬 운영진에게 하고 싶은 말</label>
                <Textarea value={auditToStaff} onChange={setAuditToStaff} placeholder="건의사항, 요청사항, 응원 등 무엇이든 환영해요!" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60">
                {sending ? "제출 중…" : "1회차 전체 평가 제출"}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
