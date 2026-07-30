"use client";

import Link from "next/link";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/common/button";
import { useDemoUser } from "@/features/auth/role-context";

export function MaterialActions({
  materialId,
  fileUrl,
  downloadUrl,
  flipbookEnabled,
  downloadAllowed,
}: {
  materialId: string;
  fileUrl: string;
  downloadUrl?: string;
  flipbookEnabled: boolean;
  downloadAllowed: boolean;
}) {
  const { isLoggedIn } = useDemoUser();

  if (!isLoggedIn) {
    return (
      <Link href="/login">
        <Button size="sm" variant="subtle">
          <Lock className="h-4 w-4" /> 로그인 후 열람
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {flipbookEnabled && (
        <Link href={`/materials/${materialId}`}>
          <Button size="sm" variant="outline">
            플립북으로 보기
          </Button>
        </Link>
      )}
      {downloadAllowed && (
        <a href={downloadUrl ?? fileUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="subtle">
            <Download className="h-4 w-4" /> 다운로드
          </Button>
        </a>
      )}
    </div>
  );
}
