"use client";

import * as React from "react";
import HTMLFlipBookRaw from "react-pageflip";
import { Download, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/common/button";

// react-pageflip의 타입 정의가 실제 기본 props(defaultProps)를 반영하지 못해
// 필수처럼 표시되는 문제를 우회한다. 런타임에는 라이브러리 자체 기본값이 적용된다.
const HTMLFlipBook = HTMLFlipBookRaw as unknown as React.ComponentType<
  React.PropsWithChildren<Record<string, unknown>>
>;

interface FlipbookViewerProps {
  /** 원본 PDF URL (웍스드라이브/구글드라이브 등 외부 링크) */
  fileUrl: string;
  title: string;
  downloadAllowed?: boolean;
}

const PAGE_WIDTH = 480;
const PAGE_HEIGHT = 640;

export function FlipbookViewer({ fileUrl, title, downloadAllowed = true }: FlipbookViewerProps) {
  const [pageImages, setPageImages] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function renderPdf() {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(fileUrl)}`;
        const loadingTask = pdfjsLib.getDocument({ url: proxiedUrl });
        const pdf = await loadingTask.promise;

        const images: string[] = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          if (context) {
            await page.render({ canvasContext: context, viewport, canvas }).promise;
            images.push(canvas.toDataURL("image/jpeg", 0.85));
          }
        }

        if (!cancelled) {
          setPageImages(images);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "알 수 없는 오류";
          setErrorMessage(message);
          setStatus("error");
        }
      }
    }

    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex aspect-[3/4] max-w-md items-center justify-center rounded-card border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
        페이지를 불러오는 중… (분량에 따라 몇 초 걸릴 수 있어요)
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
        <p>플립북을 불러오지 못했습니다.</p>
        <p className="text-xs text-red-400">{errorMessage}</p>
        {downloadAllowed && (
          <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-2 underline">
            원본 파일 새 탭에서 열기
          </a>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3 bg-slate-50 p-4 rounded-card">
      <HTMLFlipBook
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        size="stretch"
        minWidth={280}
        maxWidth={600}
        minHeight={400}
        maxHeight={800}
        showCover={false}
        usePortrait
        mobileScrollSupport
        onFlip={(e: { data: number }) => setCurrentPage(e.data)}
        className="shadow-lg"
        style={{}}
      >
        {pageImages.map((src, idx) => (
          <div key={idx} className="bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL(캔버스 렌더링 결과), next/image 미지원 */}
            <img src={src} alt={`${title} ${idx + 1}페이지`} className="h-full w-full object-contain" />
          </div>
        ))}
      </HTMLFlipBook>

      <div className="flex w-full max-w-md items-center justify-between text-sm text-slate-500">
        <span>
          {currentPage + 1} / {pageImages.length} 페이지
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          {downloadAllowed && (
            <a href={fileUrl} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" /> 원본 다운로드
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
