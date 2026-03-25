export default function SuitcaseClosed({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="닫힌 여행가방"
    >
      {/* Handle */}
      <path
        d="M160 50 Q160 20 200 20 Q240 20 240 50"
        stroke="#8B6914"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="155" y="45" width="18" height="12" rx="3" fill="#A07830" />
      <rect x="227" y="45" width="18" height="12" rx="3" fill="#A07830" />

      {/* Main body */}
      <rect x="40" y="55" width="320" height="220" rx="18" fill="#C4956A" />
      <rect x="40" y="55" width="320" height="220" rx="18" stroke="#A07830" strokeWidth="3" fill="none" />

      {/* Leather texture lines */}
      <line x1="40" y1="165" x2="360" y2="165" stroke="#A07830" strokeWidth="2" />

      {/* Belt strap */}
      <rect x="30" y="130" width="340" height="28" rx="4" fill="#8B6914" />
      <rect x="30" y="130" width="340" height="28" rx="4" stroke="#6B5210" strokeWidth="1.5" fill="none" />

      {/* Buckle left */}
      <rect x="115" y="125" width="30" height="38" rx="5" fill="#D4A853" stroke="#B8922E" strokeWidth="2" />
      <rect x="122" y="132" width="16" height="24" rx="3" fill="#B8922E" />
      <circle cx="130" cy="144" r="3" fill="#D4A853" />

      {/* Buckle right */}
      <rect x="255" y="125" width="30" height="38" rx="5" fill="#D4A853" stroke="#B8922E" strokeWidth="2" />
      <rect x="262" y="132" width="16" height="24" rx="3" fill="#B8922E" />
      <circle cx="270" cy="144" r="3" fill="#D4A853" />

      {/* Corner protectors */}
      <path d="M40 73 Q40 55 58 55" stroke="#8B6914" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M360 73 Q360 55 342 55" stroke="#8B6914" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M40 257 Q40 275 58 275" stroke="#8B6914" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M360 257 Q360 275 342 275" stroke="#8B6914" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Travel sticker 1 */}
      <g transform="translate(280, 190) rotate(-8)">
        <rect width="55" height="35" rx="4" fill="#C0392B" opacity="0.9" />
        <text x="27.5" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Outfit">
          TOKYO
        </text>
      </g>

      {/* Travel sticker 2 */}
      <g transform="translate(60, 200) rotate(5)">
        <rect width="50" height="32" rx="4" fill="#2D8F7B" opacity="0.9" />
        <text x="25" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Outfit">
          SEOUL
        </text>
      </g>

      {/* Label tag */}
      <g transform="translate(160, 80)">
        <rect width="80" height="50" rx="6" fill="#F5EFE6" />
        <rect width="80" height="16" rx="6" fill="#2D8F7B" />
        <rect y="10" width="80" height="6" fill="#2D8F7B" />
        <text x="40" y="12" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Outfit">
          PORTFOLIO
        </text>
        <line x1="10" y1="30" x2="70" y2="30" stroke="#ccc" strokeWidth="0.5" />
        <line x1="10" y1="38" x2="55" y2="38" stroke="#ccc" strokeWidth="0.5" />
      </g>

      {/* Bottom feet */}
      <rect x="80" y="275" width="30" height="10" rx="5" fill="#6B5210" />
      <rect x="290" y="275" width="30" height="10" rx="5" fill="#6B5210" />
    </svg>
  );
}
