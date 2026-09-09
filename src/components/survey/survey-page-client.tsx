"use client";

import * as React from "react";

const SURVEY_URL = "https://script.google.com/macros/s/AKfycbyA17RG2ylCAv-P_sBlJdl_MWAXPU4Ji6yOAKMsyNngfCUTdEK-HLwCGjkWSowE8kfW/exec";
const SECRET = "cdpmap-survey-2026";

// 5회차 강의별 피드백 대상 (기존 강의별 설문과 동일한 문항 구조 유지)
const LECTURES = [
  { id: "L1", title: "마케팅본부에서의 성장 경험", instructor: "김민성 소장님" },
  { id: "L2", title: "마케팅본부에서의 거현량", instructor: "조병하 사업부장님" },
];

// Best of Best 선택용 - 1~5회차 전체 강의 목록
const ALL_LECTURES: { id: string; round: number; title: string; instructor: string }[] = [
  { id: "R1-1", round: 1, title: "PM의 성과창출 프로세스", instructor: "서욱 사업부장님" },
  { id: "R1-2", round: 1, title: "우리 본부 PM 평가 맛보기", instructor: "마케팅기획팀 평가파트" },
  { id: "R1-3", round: 1, title: "기초자료 검색법 & 논문의 이해", instructor: "채연지님" },
  { id: "R1-4", round: 1, title: "PM의 듀얼브레인, AI 실무 활용법", instructor: "황득경 팀장님" },
  { id: "R1-5", round: 1, title: "UBIST 데이터의 이해와 활용사례&실습", instructor: "마케팅기획팀 데이터파트" },
  { id: "R2-1", round: 2, title: "검증4단계 총론 및 가속화 노하우", instructor: "김화산님" },
  { id: "R2-2", round: 2, title: "처방명분 작성의 고찰", instructor: "김학준님" },
  { id: "R2-3", round: 2, title: "AI 시대의 메디컬 Sales Forecast", instructor: "이영민님" },
  { id: "R2-4", round: 2, title: "Brand Planning : 목표 & 전략수립", instructor: "배정현님" },
  { id: "R2-5", round: 2, title: "MBO 및 성공모델 확산시스템의 이해", instructor: "오창헌님" },
  { id: "R2-6", round: 2, title: "Projection A의 도출과정", instructor: "원성훈님" },
  { id: "R2-7", round: 2, title: "검증 4단계 과정에서의 고민 해결 노하우", instructor: "오재석님" },
  { id: "R3-1", round: 3, title: "PM으로서 알아야하는 CP기준", instructor: "지대웅님" },
  { id: "R3-2", round: 3, title: "신제품 발매 프로세스의 A to Z", instructor: "이상곤님" },
  { id: "R3-3", round: 3, title: "신제품 판촉자료 준비 프로세스", instructor: "윤지영님" },
  { id: "R3-4", round: 3, title: "시판 후 임상연구의 활용방안", instructor: "김소희님" },
  { id: "R3-5", round: 3, title: "유관부서 업무의 이해 (사업개발/신제품기획)", instructor: "임청하님" },
  { id: "R3-6", round: 3, title: "판매계획에 따른 공급 프로세스", instructor: "주민규님" },
  { id: "R3-7", round: 3, title: "PM 실전사례(직접판매 사전/사후 관리 고도화)", instructor: "김주빈님" },
  { id: "R4-1", round: 4, title: "디지털 헬스케어 시장의 미래와 우리의 할일", instructor: "이대영 팀장님" },
  { id: "R4-2", round: 4, title: "심포지엄 기획·운영의 차별화", instructor: "황득경 팀장님" },
  { id: "R4-3", round: 4, title: "학회 관리 통한 KOL 고객단계 증진", instructor: "김혁님" },
  { id: "R4-4", round: 4, title: "업무혁신을 이끄는 생성형AI 접목사례와 전략", instructor: "서로다님" },
  { id: "R4-5", round: 4, title: "닥터빌 기획·운영의 차별화", instructor: "심연주님" },
  { id: "R4-6", round: 4, title: "메일작성 Skill UP", instructor: "서동진님" },
  { id: "R4-7", round: 4, title: "관계저축 이론과 AI 활용전략", instructor: "서욱 사업부장님" },
  { id: "R5-1", round: 5, title: "마케팅본부에서의 성장 경험", instructor: "김민성 소장님" },
  { id: "R5-2", round: 5, title: "마케팅본부에서의 거현량", instructor: "조병하 사업부장님" },
  { id: "R5-3", round: 5, title: "PM 토크콘서트", instructor: "박영준/멘토" },
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

function EmojiChoice({ options, value, onChange }: {
  options: { emoji: string; label: string }[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((opt, i) => (
        <button key={i} type="button" onClick={() => onChange(i + 1)}
          className={`flex h-24 flex-col items-center justify-center gap-1 rounded-xl border px-2 text-center transition ${
            value === i + 1 ? "border-green-700 bg-green-50" : "border-slate-200 hover:border-green-700"
          }`}>
          <span className="text-2xl">{opt.emoji}</span>
          <span className={`text-xs font-semibold leading-tight ${value === i + 1 ? "text-green-700" : "text-slate-500"}`}>{opt.label}</span>
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

  // 강의별 (5회차 - 마케팅본부 성장경험 / 거현량)
  const [lectureRatings, setLectureRatings] = React.useState<Record<string, number>>({});
  const [lectureDifficulty, setLectureDifficulty] = React.useState<Record<string, number>>({});
  const [lectureUtility, setLectureUtility] = React.useState<Record<string, number>>({});
  const [lectureFlow, setLectureFlow] = React.useState<Record<string, number>>({});
  const [lectureReplay, setLectureReplay] = React.useState<Record<string, number>>({});
  const [lectureGood, setLectureGood] = React.useState<Record<string, string>>({});
  const [lectureMemo, setLectureMemo] = React.useState<Record<string, string>>({});
  const [lectureHard, setLectureHard] = React.useState<Record<string, string>>({});

  // 전체 과정(1~5회차) 만족도
  const [courseHelpful, setCourseHelpful] = React.useState(0);
  const [favoritePart, setFavoritePart] = React.useState("");
  const [lackingTopics, setLackingTopics] = React.useState("");
  const [applyPlan, setApplyPlan] = React.useState("");
  const [messageToStaff, setMessageToStaff] = React.useState("");
  const [bestLectures, setBestLectures] = React.useState<string[]>([]);

  const currentLecture = LECTURES[activeLecture];

  function toggleBestLecture(id: string) {
    setBestLectures((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  // no-cors 요청이라 응답 내용을 읽을 수 없고, 실패해도 어차피 조용히 무시하던
  // 구조라 await로 응답을 기다리는 게 의미가 없었다. await를 없애 제출 버튼이
  // 즉시 반응하도록 하고, keepalive로 탭을 빨리 넘어가도 요청이 살아있게 한다.
  function sendToSheet(payload: Record<string, unknown>) {
    fetch(SURVEY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: SECRET, role }),
      mode: "no-cors",
      keepalive: true,
    }).catch(() => {});
  }

  function handleLectureSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = currentLecture.id;
    if (!lectureRatings[id]) return alert("별점을 선택해주세요.");
    sendToSheet({
      type: "lecture",
      round: 5,
      lectureId: id,
      lectureTitle: currentLecture.title,
      rating: lectureRatings[id],
      difficulty: lectureDifficulty[id] ?? 0,
      utility: lectureUtility[id] ?? 0,
      flow: lectureFlow[id] ?? 0,
      replay: lectureReplay[id] ?? 0,
      good: lectureGood[id] ?? "",
      memo: lectureMemo[id] ?? "",
      hard: lectureHard[id] ?? "",
    });
    setSubmitted((prev) => ({ ...prev, [id]: true }));
    if (activeLecture < LECTURES.length - 1) setActiveLecture((v) => v + 1);
  }

  function handleOverallSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseHelpful) return alert("MAP 교육 과정이 PM 직무 준비에 도움이 되었는지 선택해주세요.");
    sendToSheet({
      type: "overall_course",
      courseHelpful,
      favoritePart,
      lackingTopics,
      applyPlan,
      messageToStaff,
      bestLectures,
    });
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
            <span className="ml-2 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">5회차 설문</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <p className="text-4xl mb-4">👋</p>
            <h2 className="text-xl font-bold text-slate-800 mb-2">반갑습니다!</h2>
            <p className="text-sm text-slate-500 mb-6">5회차 설문을 시작하기 전에<br />참여 유형을 선택해주세요.</p>
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
          <span className="ml-2 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">5회차 설문</span>
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-500">{role}자</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold text-slate-800">5회차 강의 설문 &amp; 전체 과정 만족도</h1>
        <p className="mb-6 text-sm text-slate-500">솔직한 피드백이 더 좋은 교육을 만들어요. 익명으로 제출됩니다.</p>

        {/* 탭 */}
        <div className="mb-6 flex gap-2">
          <button type="button" onClick={() => setTab("lecture")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "lecture" ? "bg-green-700 text-white" : "border border-slate-200 text-slate-500 hover:border-green-700"}`}>
            📚 강의별 평가
          </button>
          <button type="button" onClick={() => setTab("overall")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === "overall" ? "bg-green-700 text-white" : "border border-slate-200 text-slate-500 hover:border-green-700"}`}>
            🏆 전체 과정 만족도
          </button>
        </div>

        {/* 강의별 평가 (수강자/청강자 공통, 5회차 2개 강의) */}
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
                <p className="mt-1 text-sm text-slate-500">제출 완료! 다음 강의를 선택하거나 전체 과정 만족도를 남겨주세요.</p>
              </div>
            ) : (
              <form onSubmit={handleLectureSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-800">{currentLecture.title}</h2>
                <p className="mb-5 text-xs text-slate-400">교수진: {currentLecture.instructor}</p>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">1. 이해도 (내용 소화 정도) *</label>
                  <EmojiChoice
                    value={lectureRatings[currentLecture.id] ?? 0}
                    onChange={(v) => setLectureRatings((prev) => ({ ...prev, [currentLecture.id]: v }))}
                    options={[
                      { emoji: "🍽", label: "완벽 흡수" },
                      { emoji: "🍚", label: "대체로 소화" },
                      { emoji: "🥛", label: "조금 더 필요" },
                      { emoji: "❓", label: "아직 어려워요" },
                    ]}
                  />
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">2. 난이도</label>
                  <EmojiChoice
                    value={lectureDifficulty[currentLecture.id] ?? 0}
                    onChange={(v) => setLectureDifficulty((prev) => ({ ...prev, [currentLecture.id]: v }))}
                    options={[
                      { emoji: "🚶", label: "산책로(쉬움)" },
                      { emoji: "⛰", label: "뒷동산" },
                      { emoji: "🧗", label: "조금 가파름" },
                      { emoji: "🏔", label: "에베레스트" },
                    ]}
                  />
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">3. 실용성 (현업 적용도)</label>
                  <EmojiChoice
                    value={lectureUtility[currentLecture.id] ?? 0}
                    onChange={(v) => setLectureUtility((prev) => ({ ...prev, [currentLecture.id]: v }))}
                    options={[
                      { emoji: "🔧", label: "바로 쓰는 공구함" },
                      { emoji: "🎒", label: "곧 꺼내 쓸 도구" },
                      { emoji: "📦", label: "필요할 때 꺼낼 상자" },
                      { emoji: "🗂", label: "조금 더 고민 필요" },
                    ]}
                  />
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">4. 강의 구성/흐름</label>
                  <EmojiChoice
                    value={lectureFlow[currentLecture.id] ?? 0}
                    onChange={(v) => setLectureFlow((prev) => ({ ...prev, [currentLecture.id]: v }))}
                    options={[
                      { emoji: "🧵", label: "잘 짜인 스웨터" },
                      { emoji: "🧶", label: "살짝 풀린 실타래" },
                      { emoji: "🪢", label: "조금 복잡한 실타래" },
                      { emoji: "✂", label: "흐름이 끊김" },
                    ]}
                  />
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">5. 다시 듣고 싶은 정도</label>
                  <EmojiChoice
                    value={lectureReplay[currentLecture.id] ?? 0}
                    onChange={(v) => setLectureReplay((prev) => ({ ...prev, [currentLecture.id]: v }))}
                    options={[
                      { emoji: "❤️", label: "꼭 다시 듣고 싶어요" },
                      { emoji: "👍", label: "다시 들어도 좋아요" },
                      { emoji: "🙂", label: "한 번으로 충분해요" },
                      { emoji: "👀", label: "다른 강의도 궁금해요" },
                    ]}
                  />
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
                <button type="submit"
                  className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800">
                  이 강의 평가 제출
                </button>
              </form>
            )}
          </div>
        )}

        {/* 전체 과정(1~5회차) 만족도 - 수강자/청강자 공통 */}
        {tab === "overall" && (
          submitted.overall ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
              <p className="text-4xl">🎉</p>
              <p className="mt-3 text-xl font-bold text-green-700">전체 과정 만족도 제출 완료!</p>
              <p className="mt-1 text-sm text-slate-500">그동안 소중한 피드백 감사했어요. 다음 기수에 반영하겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleOverallSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-bold text-slate-800">🏆 26년 하반기 CDP MAP 전체 교육 과정 만족도</h2>
              <p className="mb-5 text-xs text-slate-400">1회차부터 5회차까지, 전체 과정을 돌아보며 답변해주세요.</p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">1️⃣ MAP 교육 과정이 PM 직무 수행을 준비하는 데 도움이 되셨나요? *</label>
                <ChoiceButton value={courseHelpful} onChange={setCourseHelpful} labels={["매우 도움이 되었다", "도움이 되었다", "보통", "별로 도움이 안 되었다", "전혀 도움이 안 되었다"]} />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-semibold text-slate-700">2️⃣ 전체 교육 과정에서 어떤 부분이 가장 만족스러우셨나요?</label>
                <Textarea value={favoritePart} onChange={setFavoritePart} placeholder="가장 만족스러웠던 내용, 강의, 운영 방식 등을 자유롭게 적어주세요" rows={3} />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-semibold text-slate-700">3️⃣ 부족하다고 느낀 주제나 추가되었으면 하는 내용이 있다면 자유롭게 작성 부탁드립니다.</label>
                <Textarea value={lackingTopics} onChange={setLackingTopics} placeholder="다뤄지지 않았지만 필요했던 주제, 아쉬웠던 점 등을 적어주세요" rows={3} />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-semibold text-slate-700">4️⃣ PM직무를 하게 되면, 바로 접목하고 실행할 사항을 간략히 작성해주세요.</label>
                <Textarea value={applyPlan} onChange={setApplyPlan} placeholder="교육에서 배운 내용 중 실제 업무에 바로 적용해볼 계획을 적어주세요" rows={3} />
              </div>
              <div className="mb-8">
                <label className="mb-1 block text-sm font-semibold text-slate-700">5️⃣ 마지막으로 CDP MAP 운영진에게 하고 싶은 말이 있으면 자유롭게 부탁드립니다.</label>
                <Textarea value={messageToStaff} onChange={setMessageToStaff} placeholder="운영진에게 전하고 싶은 말을 자유롭게 남겨주세요" rows={3} />
              </div>

              <div className="mb-2">
                <label className="mb-1 block text-sm font-semibold text-slate-700">🥇 전체 교육 과정 중에서 가장 좋았던 과정은 무엇인가요? (복수선택 가능)</label>
                <p className="mb-3 text-xs text-slate-400">Best of Best 강의를 뽑아주세요!</p>
              </div>
              <div className="mb-8 space-y-4">
                {[1, 2, 3, 4, 5].map((round) => (
                  <div key={round}>
                    <p className="mb-2 text-xs font-bold text-green-700">{round}회차</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_LECTURES.filter((lec) => lec.round === round).map((lec) => (
                        <button key={lec.id} type="button" onClick={() => toggleBestLecture(lec.id)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            bestLectures.includes(lec.id)
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-slate-200 text-slate-500 hover:border-green-700 hover:text-green-700"
                          }`}>
                          {bestLectures.includes(lec.id) ? "✓ " : ""}{lec.title}_{lec.instructor}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit"
                className="w-full rounded-full bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800">
                전체 과정 만족도 제출
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
