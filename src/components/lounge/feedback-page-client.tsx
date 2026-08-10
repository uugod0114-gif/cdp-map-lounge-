"use client";

import * as React from "react";
import { LoungeFeed } from "@/components/lounge/lounge-feed";
import { cn } from "@/lib/utils/cn";
import type { SessionRecord } from "@/types/content";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoungePost = any;

export function FeedbackPageClient({
  sessions,
  allPosts,
  sessionTags,
}: {
  sessions: SessionRecord[];
  allPosts: LoungePost[];
  sessionTags: string[];
}) {
  const [activeTab, setActiveTab] = React.useState<string>("전체");
  const tabs = ["전체", ...sessions.map((s) => `${s.week}회차`)];

  const filteredPosts =
    activeTab === "전체"
      ? allPosts
      : allPosts.filter((p: LoungePost) => p.sessionTag === activeTab);

  return (
    <div>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
              activeTab === tab
                ? "border-map-navy bg-map-navy text-white"
                : "border-map-line text-slate-500 hover:border-map-navy hover:text-map-navy",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <LoungeFeed
        board="auditor"
        posts={filteredPosts}
        sessionTags={sessionTags}
      />
    </div>
  );
}