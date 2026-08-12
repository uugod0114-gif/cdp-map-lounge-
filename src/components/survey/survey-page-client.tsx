"use client";

import * as React from "react";

const LECTURES = [
  { id: "L1", title: "1강의 PM의 성과창출 프로세스", instructor: "서욱" },
  { id: "L2", title: "2강의 우리 본부 PM 평가 맛보기", instructor: "박미경/김유신" },
  { id: "L3", title: "3강의 기초자료 검색법 & 논문의 이해", instructor: "채연지" },
  { id: "L4", title: "4강의 PM의 듀얼브레인, AI 실무 활용법", instructor: "황득경" },
  { id: "L5", title: "5강의 UBIST 데이터의 이해와 활용사례 & 실전 UBIST", instructor: "마케팅기획팀 데이터파트" },
];

type Tab = "lecture" | "overall";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-3xl transition-transform hover:scale-110 ${star <= value ? "text-yellow-400" : "text-slate-200"}`}
        >
          ★
        </button>
      ))}
      {value > 0 && <span className="ml-2 self-center text-sm font-semibold text-slate-500">{value}점</span>}
    </div>
  );
}

function SelfCheck({ value, onChange, labels }: { value: number; onChange: (v: number) => void; labels: string[] }) {
  return (
    <div className="flex gap-3">
      {labels.map((label, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            value === i + 1
              ? "border-green-600 bg-green-600 text-white"
              : "border-slate-200 text-slate-500 hover:border-green-600 hover:text-green-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function SurveyPageClient() {
  const [tab, setTab] = React.useState<Tab>("lecture");
  const [activeLecture, setActiveLecture] = React.useState(0);
  const [submitted, setSubmitted] = React.useState<Record<string, boolean>>({});

  // 강의별 설문 상태
  const [lectureRatings, setLectureRatings] = React.useState<Record<string, number>>({});
  const [lectureGood, setLectureGood] = React.useState<Record<string, string>>({});
  const [lectureMemo, setLectureMemo] = React.useState<Record<string, string>>({});
  const [lectureHard, setLectureHard] = React.useState<Record<string, string>>({});

  // 전체 설문 상태
  const [overallRating, setOverallRating] = React.useState(0);
  const [goalMet, setGoalMet] = React.useState(0);
  const [pmRole, setPmRole] = React.useState("");
  const [selfCheck, setSelfCheck] = React.useState(0);

  const currentLecture = LECTURES[activeLecture];

  function handleLectureSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = currentLecture.id;
    if (!lectureRatings[id]) return alert("별점을 선택해주세요.");
    setSubmitted((prev) => ({ ...prev, [id]: true }));
    if (activeLecture < LECTURES.length - 1) setActiveLecture((v) => v + 1);
  }

  function handleOverallSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!overallRating) return alert("전체 만족도 별점을 선택해주세요.");
    if (!pmRole.trim()) return alert("PM 역할/책임 한 줄 정리를 입력해주세요.");
    setSubmitted((prev) => ({ ...prev, overall: true }));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-sm font-bold text-white">MAP</span>
          <span className="font-bold text-slate-800">CDP MAP Lounge</span>
          <span className="ml-2 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">1회차 설문</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">1회차 강의 설문조사</h1>
        <p className="mb-6 text-sm text-slate-500">솔직한 피드백이 더 좋은 교육을 만들어요. 익명으로 제출됩니다.</p>

        {/* 탭 */}
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("lecture")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              tab === "lecture" ? "bg-green-700 text-white" : "border border-slate-200 text-slate-500 hover:border-green-700"
            }`}
          >
            📚 강의별 평가
          </button>
          <button
            type="button"
            onClick={() => setTab("overall")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              tab === "overall" ? "bg-green-700 text-white" : "border border-slate-200 text-slate-500 hover:border-green-700"
            }`}
          >
            📋 1회차 전체 평가
          </button>
        </div>

        {/* 강의별 평가 */}
        {tab === "lecture" && (
          <div>
            {/* 강의 선택 */}
            <div className="mb-5 flex flex-wrap gap-2">
              {LECTURES.map((lec, i) => (
                <button
                  key={lec.id}
                  type="button"
                  onClick={() => setActiveLecture(i)}
                  className={`relative rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    activeLecture === i
                      ? "border-green-700 bg-green-700 text-white"
                      : submitted[lec.id]
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-slate-200 text-slate-500 hover:border-green-700"
                  }`}
                >
                  {i + 1}강의
                  {submitted[lec.id] && <span className="ml-1">✓</span>}
                </button>
              ))}
            </div>

            {submitted[currentLecture.id] ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <p className="text-3xl">✅</p>
                <p className="mt-2 font-bold text-green-700">{currentLecture.title}</p>
                <p className="mt-1 text-sm text-slate-500">제출 완료! 다음 강의를 선택해주세요.</p>
              </div>
            ) : (
              <form onSubmit={handleLectureSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-800">{currentLecture.title}</h2>
                <p className="mb-5 text-xs text-slate-400">강사: {currentLecture.instructor}</p>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">⭐ 강의 만족도 (5점 만점)</label>
                  <StarRating
                    value={lectureRatings[currentLecture.id] ?? 0}
                    onChange={(v) => setLectureRatings((prev) => ({ ...prev, [currentLecture.id]: v }))}
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">👍 좋았던 점</label>
                  <textarea
                    value={lectureGood[currentLecture.id] ?? ""}
                    onChange={(e) => setLectureGood((prev) => ({ ...prev, [currentLecture.id]: e.target.value }))}
                    placeholder="강의에서 좋았던 점을 자유롭게 적어주세요"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-green-600 focus:outline-none"
                    rows={2}
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">💡 가장 기억에 남는 점</label>
                  <textarea
                    value={lectureMemo[currentLecture.id] ?? ""}
                    onChange={(e) => setLectureMemo((prev) => ({ ...prev, [currentLecture.id]: e.target.value }))}
                    placeholder="인상 깊었거나 새로 알게 된 내용은?"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-green-600 focus:outline-none"
                    rows={2}
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">🤔 어려웠거나 더 알고 싶은 점</label>
                  <textarea
                    value={lectureHard[currentLecture.id] ?? ""}
                    onChange={(e) => setLectureHard((prev) => ({ ...prev, [currentLecture.id]: e.target.value }))}
                    placeholder="이해가 어려웠거나 더 다뤄줬으면 했던 내용은?"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-green-600 focus:outline-none"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800 active:opacity-80"
                >
                  이 강의 평가 제출
                </button>
              </form>
            )}
          </div>
        )}

        {/* 전체 평가 */}
        {tab === "overall" && (
          submitted.overall ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
              <p className="text-4xl">🎉</p>
              <p className="mt-3 text-xl font-bold text-green-700">1회차 전체 설문 제출 완료!</p>
              <p className="mt-1 text-sm text-slate-500">소중한 피드백 감사해요. 다음 회차에 반영하겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleOverallSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-800">📋 1회차 전체 평가</h2>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ⭐ 1회차 전체 만족도 (5점 만점)
                </label>
                <StarRating value={overallRating} onChange={setOverallRating} />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  🎯 1회차 교육이 목표에 맞게 잘 이뤄졌다고 생각하시나요?
                </label>
                <SelfCheck
                  value={goalMet}
                  onChange={setGoalMet}
                  labels={["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"]}
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  💼 PM에게 가장 중요한 역할/책임이 무엇인지 한 줄로 정리해주세요
                </label>
                <textarea
                  value={pmRole}
                  onChange={(e) => setPmRole(e.target.value)}
                  placeholder="예) PM은 데이터 기반으로 의사결정을 이끌고 팀의 방향성을 제시하는 사람이다."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-green-600 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  📊 기본지식 · 학술자료분석 · 시장분석 기초가 쌓였다고 느끼시나요? (셀프 평가)
                </label>
                <SelfCheck
                  value={selfCheck}
                  onChange={setSelfCheck}
                  labels={["전혀 아니다", "조금 부족", "보통", "어느 정도", "충분히 쌓였다"]}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800 active:opacity-80"
              >
                1회차 전체 평가 제출
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}