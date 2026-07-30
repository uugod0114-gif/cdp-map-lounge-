export function OrbCluster({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 320"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="orbBig" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="var(--color-map-navy-mute)" />
          <stop offset="55%" stopColor="var(--color-map-navy-soft)" />
          <stop offset="100%" stopColor="var(--color-map-navy)" />
        </radialGradient>
        <radialGradient id="orbGold" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff3d6" />
          <stop offset="60%" stopColor="var(--color-map-gold)" />
          <stop offset="100%" stopColor="#d99a2b" />
        </radialGradient>
        <radialGradient id="orbMint" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="var(--color-map-navy-mute)" />
          <stop offset="100%" stopColor="var(--color-map-navy-soft)" />
        </radialGradient>
        <filter id="orbShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="var(--color-map-navy)" floodOpacity="0.28" />
        </filter>
      </defs>

      <circle cx="175" cy="160" r="120" fill="url(#orbBig)" filter="url(#orbShadow)" />
      <circle cx="255" cy="70" r="42" fill="url(#orbGold)" filter="url(#orbShadow)" />
      <circle cx="60" cy="240" r="34" fill="url(#orbMint)" filter="url(#orbShadow)" />
      <circle cx="70" cy="70" r="18" fill="var(--color-map-navy-mute)" opacity="0.6" />
    </svg>
  );
}