import { NextRequest, NextResponse } from "next/server";

/**
 * 플립북/브PDF 뷰어가 외부 PDF(웍스드라이브, 구글드라이브 등)를 읽어올 때 쓰는 프록시.
 *
 * 왜 필요한가:
 * - pdf.js는 브라우저에서 fetch로 PDF 바이트를 직접 읽는데, 외부 서버가
 *   CORS 헤더를 안 열어주면 브라우저가 요청을 막아버린다.
 * - 이 라우트가 서버 쪽에서 대신 받아온 뒤 우리 도메인(same-origin)으로
 *   돌려주면 브라우저 입장에서는 CORS 문제가 없다.
 *
 * 보안: 아무 URL이나 프록시하면 사내망 스캐닝 등에 악용될 수 있으므로
 * 허용된 도메인만 통과시킨다. 웍스드라이브 도메인이 확정되면
 * ALLOWED_PDF_PROXY_DOMAINS 환경변수에 추가해 주세요.
 * 예: ALLOWED_PDF_PROXY_DOMAINS=worksdrive.company.com,drive.google.com
 */

const DEFAULT_ALLOWED_DOMAINS = [
  "drive.google.com",
  "docs.google.com",
];

function getAllowedDomains(): string[] {
  const fromEnv = process.env.ALLOWED_PDF_PROXY_DOMAINS;
  if (!fromEnv) return DEFAULT_ALLOWED_DOMAINS;
  return fromEnv.split(",").map((d) => d.trim()).filter(Boolean);
}

function isAllowedHost(hostname: string): boolean {
  const allowed = getAllowedDomains();
  return allowed.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url 쿼리 파라미터가 필요합니다." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "유효하지 않은 URL입니다." }, { status: 400 });
  }

  if (target.protocol !== "https:") {
    return NextResponse.json({ error: "https 링크만 허용됩니다." }, { status: 400 });
  }

  if (!isAllowedHost(target.hostname)) {
    return NextResponse.json(
      {
        error: `허용되지 않은 도메인입니다: ${target.hostname}. 관리자 설정(ALLOWED_PDF_PROXY_DOMAINS)에서 추가해 주세요.`,
      },
      { status: 403 },
    );
  }

  try {
    const upstream = await fetch(target.toString(), {
      redirect: "follow",
      headers: { Accept: "application/pdf,*/*" },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `원본 파일을 가져오지 못했습니다 (status ${upstream.status}).` },
        { status: 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.includes("pdf") && !contentType.includes("octet-stream")) {
      // 다운로드 확인 페이지(HTML)가 반환된 경우 등 - 실제 파일 URL이 아닐 가능성이 높다.
      return NextResponse.json(
        {
          error:
            "PDF 파일이 아닌 응답을 받았습니다. 공유 링크가 '다운로드 확인' 페이지를 거치는 형식이라면, 실제 파일 다운로드 URL을 사용해야 합니다.",
        },
        { status: 502 },
      );
    }

    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "파일을 불러오는 중 오류가 발생했습니다." }, { status: 500 });
  }
}
