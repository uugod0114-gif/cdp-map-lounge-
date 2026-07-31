"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { AnonAvatar, anonPersona } from "@/components/common/anon-avatar";
import { useDemoUser } from "@/features/auth/role-context";
import { ROLE_LABEL, isStaff } from "@/lib/permissions/roles";
import {
  submitLoungeCommentAction,
  submitLoungePostAction,
  toggleLoungeLikeAction,
  toggleLoungePinAction,
} from "@/features/lounge/feed-actions";
import type { LoungeBoard, LoungePost } from "@/types/content";

export function LoungeFeed({
  board,
  posts,
  sessionTags,
}: {
  board: LoungeBoard;
  posts: LoungePost[];
  sessionTags: string[];
}) {
  const { user, isLoggedIn } = useDemoUser();
  const router = useRouter();
  const canPin = user.role === "instructor" || isStaff(user.role);

  const [message, setMessage] = React.useState("");
  const [sessionTag, setSessionTag] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [commentDrafts, setCommentDrafts] = React.useState<Record<string, string>>({});
  const [openComments, setOpenComments] = React.useState<Record<string, boolean>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    await submitLoungePostAction(board, user.name, user.role, message.trim(), sessionTag || undefined);
    setSubmitting(false);
    setMessage("");
    router.refresh();
  }

  async function handleLike(postId: string) {
    await toggleLoungeLikeAction(board, postId, user.name);
    router.refresh();
  }

  async function handlePin(postId: string) {
    await toggleLoungePinAction(board, postId, user.name);
    router.refresh();
  }

  async function handleComment(postId: string) {
    const draft = commentDrafts[postId];
    if (!draft?.trim()) return;
    await submitLoungeCommentAction(board, postId, user.name, user.role, draft.trim());
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-map-navy/10">
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-map-mist px-3 py-2">
              <AnonAvatar seed={user.name} size={26} showLabel />
              <span className="text-xs text-slate-500">으로 익명 등록됩니다 · 아이콘은 자동 배정</span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="오늘 교육에서 얻은 인사이트를 한 줄로 남겨보세요"
              className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={sessionTag}
                onChange={(e) => setSessionTag(e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-600"
              >
                <option value="">자유</option>
                {sessionTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "등록 중…" : "등록"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-slate-400">소감을 남기려면 먼저 로그인해 주세요.</p>
        )}
      </Card>

      {posts.length === 0 ? (
        <Card className="border-map-navy/10">
          <p className="text-sm text-slate-400">아직 등록된 글이 없습니다. 첫 소감을 남겨보세요!</p>
        </Card>
      ) : (
        posts.map((post) => {
          const liked = post.likedBy.includes(user.name);
          const commentsOpen = !!openComments[post.id];
          return (
            <Card key={post.id} className={post.pinnedByInstructor ? "border-map-navy" : "border-map-navy/10"}>
              {post.pinnedByInstructor && (
                <p className="mb-2 flex items-center gap-1 text-xs font-bold text-map-navy">
                  <Star className="h-3.5 w-3.5" /> 교수자 추천
                </p>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-map-ink">
                  <AnonAvatar seed={post.authorName} size={28} showLabel />
                  <Badge variant="neutral">{ROLE_LABEL[post.authorRole]}</Badge>
                  {post.sessionTag && <Badge variant="navy">{post.sessionTag}</Badge>}
                </span>
                <span className="text-xs text-slate-400" suppressHydrationWarning>
                  {new Date(post.createdAt).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{post.message}</p>
              <div className="mt-3 flex items-center gap-2">
                <button type="button" onClick={() => handleLike(post.id)} disabled={!isLoggedIn}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${liked ? "border-map-navy bg-map-mist text-map-navy" : "border-slate-200 text-slate-500 hover:border-map-navy hover:text-map-navy"}`}>
                  <ThumbsUp className="h-3.5 w-3.5" /> 공감 {post.likedBy.length}
                </button>
                <button type="button" onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-map-navy hover:text-map-navy">
                  <MessageCircle className="h-3.5 w-3.5" /> 댓글 {post.comments.length}
                </button>
                {canPin && (
                  <button type="button" onClick={() => handlePin(post.id)}
                    className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-map-navy hover:text-map-navy">
                    <Star className="h-3.5 w-3.5" /> {post.pinnedByInstructor ? "추천 해제" : "추천"}
                  </button>
                )}
              </div>
              {commentsOpen && (
                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <AnonAvatar seed={comment.authorName} size={24} />
                      <div className="flex-1 rounded-xl bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-map-ink">익명의 {anonPersona(comment.authorName).label}</span>
                          <span className="text-[11px] text-slate-400" suppressHydrationWarning>
                            {new Date(comment.createdAt).toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                  {isLoggedIn && (
                    <div className="flex gap-2">
                      <input value={commentDrafts[post.id] ?? ""}
                        onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); handleComment(post.id); } }}
                        placeholder="익명 댓글 남기기"
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                      <Button size="sm" variant="outline" onClick={() => handleComment(post.id)}>등록</Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
