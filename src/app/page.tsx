import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { BlockList } from "@/components/cms/block-renderer";
import { Button } from "@/components/common/button";
import { Reveal } from "@/components/common/reveal";
import { GradientBox } from "@/components/common/gradient-box";
import { Check, CalendarDays, MapPin, PlayCircle } from "lucide-react";
import { getPageBySlug, listSessions } from "@/services/content-service";

const PARTICIPATION_TRACKS = [
  {
    label: "청강자",
    tagline: "가볍게 시작하기",
    features: ["강의 일정 확인", "강의 자료 열람", "강의 후기 남기기"],
    highlighted: false,
  },
  {
    label: "수강자",
    tagline: "제대로 성장하기",
    features: [
      "전체 커리큘럼 수강",
      "1:1 멘토 PM 매칭",
      "주차별 과제 협업",
      "실시간 피드백 참여",
      "수료증 발급",
    ],
    highlighted: true,
  },
  {
    label: "교수자 / 멘토",
    tagline: "함께 이끌어가기",
    features: ["담당 강의 자료 등록", "수강자 과제 피드백", "질문/Q&A 답변"],
    highlighted: false,
  },
];

export default async function HomePage() {
  const page = await getPageBySlug("main");
  const sessions = await listSessions();

  return (
    <PublicShell>
      <BlockList blocks={page?.publishedBlocks ?? []} role="auditor" />

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <Reveal className="mb-8 text-center">
          <p className="text-sm font-semibold text-map-navy">Care For Your Growth</p>
          <h2 className="mt-1 font-display text-2xl font-medium text-map-ink sm:text-3xl">
            참여 방식을 선택하세요
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PARTICIPATION_TRACKS.map((track, idx) => (
            <Reveal key={track.label} delay={idx * 120}>
              <div
                className={
                  track.highlighted
                    ? "flex h-full flex-col rounded-[1.75rem] bg-gradient-to-br from-map-navy-soft to-map-navy p-7 text-white shadow-[0_20px_40px_-15px_rgba(18,63,69,0.4)] md:-translate-y-3"
                    : "flex h-full flex-col rounded-[1.75rem] border border-map-line bg-white p-7 text-map-ink shadow-[0_8px_24px_-8px_rgba(18,63,69,0.12)]"
                }
              >
                <p
                  className={
                    track.highlighted
                      ? "text-xs font-semibold uppercase tracking-wide text-map-navy-mute"
                      : "text-xs font-semibold uppercase tracking-wide text-map-navy"
                  }
                >
                  {track.tagline}
                </p>
                <h3 className="mt-2 font-display text-xl font-medium">{track.label}</h3>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {track.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check
                        className={track.highlighted ? "h-4 w-4 text-map-navy-mute" : "h-4 w-4 text-map-navy"}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/apply" className="mt-6">
                  <Button variant={track.highlighted ? "inverse" : "outline"} className="w-full">
                    신청 안내 보기
                  </Button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <Reveal className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-map-navy">강의 일정</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-map-ink">1~5회차 교육 일정</h2>
          </div>
          <Link href="/schedule">
            <Button variant="outline" size="sm">
              전체 일정 보기
            </Button>
          </Link>
        </Reveal>

        <div className="flex flex-col gap-4">
          {sessions.map((session, idx) => (
            <Reveal key={session.id} delay={idx * 80}>
              <GradientBox>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-map-navy">{session.week}회차</p>
                    <h3 className="mt-1 text-lg font-bold text-map-ink">{session.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{session.summary}</p>
                  </div>
                  <span className="rounded-full bg-map-gold-soft/50 px-3 py-1 text-xs font-semibold text-map-navy">
                    {session.date}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> {session.startTime}-{session.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {session.location || "미정"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/sessions/${session.id}`}>
                    <Button variant="primary" size="sm">
                      <PlayCircle className="h-4 w-4" /> 회차별 세부 아젠다 보러가기
                    </Button>
                  </Link>
                </div>
              </GradientBox>
            </Reveal>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
