export function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-map-navy py-10 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 text-sm sm:px-6">
        <p className="font-display text-lg font-bold text-white">CDP MAP Lounge</p>
        <p className="mt-2 max-w-xl text-slate-400">
          ETC마케팅본부 CDP · Marketing Assignment Program 교육 운영 플랫폼입니다.
          문의는 <a href="mailto:dw_cdpmap@daewoong.co.kr" className="text-map-gold underline">dw_cdpmap@daewoong.co.kr</a> 로 보내주세요.
        </p>
        <p className="mt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} ETC Marketing HQ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
