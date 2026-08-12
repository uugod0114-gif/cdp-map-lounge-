"use client";

import { ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/common/button";

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
  return (
    <div className="flex flex-wrap items-center gap-2">
      {downloadAllowed && (
        <a href={downloadUrl ?? fileUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="primary">
            <ExternalLink className="h-4 w-4" /> 드라이브 바로가기 (개별 다운로드)
          </Button>
        </a>
      )}
      {flipbookEnabled && fileUrl && (
        <a href={fileUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline">
            <BookOpen className="h-4 w-4" /> 플립북 보러가기
          </Button>
        </a>
      )}
    </div>
  );
}