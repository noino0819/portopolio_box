export default function ItemCD({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="CD"
    >
      <defs>
        <radialGradient id="cdGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#378ADD" />
          <stop offset="30%" stopColor="#534AB7" />
          <stop offset="50%" stopColor="#D4537E" />
          <stop offset="70%" stopColor="#D4A853" />
          <stop offset="90%" stopColor="#2D8F7B" />
          <stop offset="100%" stopColor="#378ADD" />
        </radialGradient>
        <radialGradient id="cdShine" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* CD disc */}
      <circle cx="80" cy="80" r="72" fill="url(#cdGradient)" />
      <circle cx="80" cy="80" r="72" fill="url(#cdShine)" />
      <circle cx="80" cy="80" r="72" stroke="#555" strokeWidth="1" fill="none" />

      {/* Track grooves */}
      <circle cx="80" cy="80" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
      <circle cx="80" cy="80" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
      <circle cx="80" cy="80" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
      <circle cx="80" cy="80" r="55" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" />
      <circle cx="80" cy="80" r="45" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" />

      {/* Center hole */}
      <circle cx="80" cy="80" r="14" fill="#1A1614" />
      <circle cx="80" cy="80" r="14" stroke="#888" strokeWidth="1" fill="none" />
      <circle cx="80" cy="80" r="10" stroke="#666" strokeWidth="0.5" fill="none" />

      {/* Label area */}
      <circle cx="80" cy="80" r="28" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
      <text x="80" y="68" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Outfit" opacity="0.8">
        MY
      </text>
      <text x="80" y="98" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Outfit" opacity="0.8">
        PLAYLIST
      </text>
    </svg>
  );
}
