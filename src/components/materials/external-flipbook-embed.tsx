export function ExternalFlipbookEmbed({ url, title }: { url: string; title: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-card border border-slate-200 bg-slate-50">
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
  );
}
