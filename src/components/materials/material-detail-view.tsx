"use client";

import { FileText, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";
import { FlipbookViewer } from "@/components/materials/flipbook-viewer";
import { ExternalFlipbookEmbed } from "@/components/materials/external-flipbook-embed";
import { isFlipHtml5Url } from "@/lib/embeds/detect";
import { useDemoUser } from "@/features/auth/role-context";
import type { MaterialItem } from "@/types/content";

export function MaterialDetailView({ material }: { material: MaterialItem }) {
  const { isLoggedIn } = useDemoUser();

  if (!isLoggedIn) {
    return (
      <Card className="flex flex-col items-center gap-3 py-12 text-center">
        <Lock className="h-8 w-8 text-slate-300" />
        <p className="font-semibold text-map-ink">로그인 후 열람할 수 있는 자료예요.</p>
        <Link href="/login">
          <Button variant="primary" size="sm">
            로그인하러 가기
          </Button>
        </Link>
      </Card>
    );
  }

  if (material.flipbookEnabled && isFlipHtml5Url(material.fileUrl)) {
    return (
      <ExternalFlipbookEmbed
        url={material.fileUrl}
        title={material.title}
        downloadAllowed={material.downloadAllowed}
        downloadUrl={material.downloadUrl}
      />
    );
  }

  if (material.flipbookEnabled) {
    return (
      <FlipbookViewer
        fileUrl={material.fileUrl}
        title={material.title}
        downloadAllowed={material.downloadAllowed}
        downloadUrl={material.downloadUrl}
      />
    );
  }

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-map-navy/10 text-map-navy">
          <FileText className="h-5 w-5" />
        </div>
        <p className="font-semibold text-map-ink">{material.title}</p>
      </div>
      {material.downloadAllowed && (
        <a href={material.downloadUrl ?? material.fileUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline">
            다운로드
          </Button>
        </a>
      )}
    </Card>
  );
}