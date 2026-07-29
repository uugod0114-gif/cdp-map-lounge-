import { Download } from "lucide-react";
import { Button } from "@/components/common/button";

export function ExternalFlipbookEmbed({
  url,
  title,
  downloadAllowed,
  downloadUrl,
}: {
  url: string;
  title: string;
  downloadAllowed?: boolean;
  downloadUrl?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="overflow-hidden rounded-card border border-slate-200 bg-slate-50">
        <div className="aspect-[4/3] w-full">
          <iframe
            src={url}
            title={title}
            className="h-full w-full"
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-fullscreen"
          />
        </div>
      </div>
      {downloadAllowed && downloadUrl && (
        <a href={downloadUrl} target="_blank" rel="noreferrer" className="self-start">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4" /> 원본 다운로드
          </Button>
        </a>
      )}
    </div>
  );
}