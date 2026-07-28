"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";

interface SessionFeedbackEntry {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  rating?: number;
}

const STORAGE_KEY_PREFIX = "cdp-map-session-feedback-";

const DEFAULT_ENTRIES: SessionFeedbackEntry[] = [
  {
    id: "sample-feedback-1",
    author: "교수진",
    message: "오늘 내용은 복습 자료를 꼭 확인해 주세요. 질문은 Q&A에 남겨주시면 바로 답변드릴게요.",
    createdAt: "2026-08-13T14:30:00+09:00",
    rating: 5,
  },
];

function createEntry(author: string, message: string, rating: number): SessionFeedbackEntry {
  return {
    id: `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    message,
    createdAt: new Date().toISOString(),
    rating,
  };
}

/**
 * 강의 실시간 피드백(만족도) 위젯.
 * Phase 1에서는 브라우저(localStorage)에만 저장되는 개인 기록이다.
 * 여러 사람이 함께 보는 공개 피드백 집계는 Phase 2에서 Supabase로 옮긴다.
 */
export function SessionExperiencePanel({
  sessionId,
  sessionTitle,
}: {
  sessionId: string;
  sessionTitle: string;
}) {
  const [entries, setEntries] = useState<SessionFeedbackEntry[]>(DEFAULT_ENTRIES);
  const [feedbackAuthor, setFeedbackAuthor] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [satisfaction, setSatisfaction] = useState("5");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as SessionFeedbackEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage(외부 시스템) 초기 동기화
          setEntries(parsed);
          return;
        }
      }
    } catch {
      // ignore invalid local storage data
    }
  }, [sessionId]);

  useEffect(() => {
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${sessionId}`, JSON.stringify(entries));
  }, [entries, sessionId]);

  const averageRating = useMemo(() => {
    const ratings = entries.filter((entry) => typeof entry.rating === "number").map((entry) => entry.rating as number);
    if (ratings.length === 0) return "0.0";
    return (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1);
  }, [entries]);

  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackAuthor.trim() || !feedbackMessage.trim()) return;
    const nextEntry = createEntry(feedbackAuthor.trim(), feedbackMessage.trim(), Number(satisfaction));
    setEntries((current) => [nextEntry, ...current]);
    setFeedbackAuthor("");
    setFeedbackMessage("");
    setSatisfaction("5");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-map-navy">실시간 피드백</p>
            <h2 className="mt-1 font-display text-xl font-medium text-map-ink">
              {sessionTitle}의 반응을 바로 확인해요
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              수업 후 만족도와 의견을 남겨주세요. (이 기기에만 저장되는 개인 기록입니다)
            </p>
          </div>
          <div className="rounded-2xl border border-map-gold/40 bg-map-gold-soft/40 px-4 py-3 text-sm text-map-navy">
            <p className="font-semibold">평균 만족도</p>
            <p className="mt-1 text-2xl font-bold">{averageRating}/5</p>
          </div>
        </div>
      </div>

      <Card className="border-map-navy/10">
        <h3 className="font-semibold text-map-ink">피드백 남기기</h3>
        <form className="mt-4 space-y-4" onSubmit={handleFeedbackSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">이름</label>
            <input
              value={feedbackAuthor}
              onChange={(event) => setFeedbackAuthor(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="이름을 입력해 주세요"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">오늘 강의는 어땠나요?</label>
            <textarea
              value={feedbackMessage}
              onChange={(event) => setFeedbackMessage(event.target.value)}
              className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="강의 내용, 진도, 이해도에 대한 의견을 남겨주세요"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">만족도</label>
            <select
              value={satisfaction}
              onChange={(event) => setSatisfaction(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="5">5점 · 매우 만족</option>
              <option value="4">4점 · 만족</option>
              <option value="3">3점 · 보통</option>
              <option value="2">2점 · 아쉬움</option>
              <option value="1">1점 · 매우 아쉬움</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="w-full">
            피드백 등록
          </Button>
        </form>
      </Card>

      {entries.length > 0 && (
        <Card className="border-map-navy/10">
          <h3 className="font-semibold text-map-ink">최근 피드백</h3>
          <div className="mt-4 flex flex-col gap-3">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-map-ink">{entry.author}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(entry.createdAt).toLocaleString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{entry.message}</p>
                {entry.rating ? <p className="mt-2 text-xs font-semibold text-map-navy">만족도 {entry.rating}/5</p> : null}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
