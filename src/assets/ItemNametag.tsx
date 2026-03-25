export default function ItemNametag({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="이름표 목걸이"
    >
      {/* Lanyard */}
      <path
        d="M50 0 Q50 30 55 50 Q60 70 70 80"
        stroke="#2D8F7B"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M90 0 Q90 30 85 50 Q80 70 70 80"
        stroke="#2D8F7B"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Clip */}
      <rect x="60" y="75" width="20" height="12" rx="2" fill="#D4A853" />
      <rect x="65" y="80" width="10" height="4" rx="1" fill="#B8922E" />

      {/* Card */}
      <rect x="20" y="87" width="100" height="85" rx="8" fill="#F5EFE6" />
      <rect x="20" y="87" width="100" height="85" rx="8" stroke="#E0D5C7" strokeWidth="1.5" fill="none" />

      {/* Header band */}
      <rect x="20" y="87" width="100" height="24" rx="8" fill="#2D8F7B" />
      <rect x="20" y="99" width="100" height="12" fill="#2D8F7B" />
      <text x="70" y="103" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Outfit">
        HELLO
      </text>

      {/* Photo placeholder */}
      <circle cx="70" cy="133" r="16" fill="#E0D5C7" />
      <circle cx="70" cy="129" r="6" fill="#C4B5A5" />
      <ellipse cx="70" cy="141" rx="10" ry="6" fill="#C4B5A5" />

      {/* Lines */}
      <line x1="35" y1="156" x2="105" y2="156" stroke="#D5C9BB" strokeWidth="1" />
      <line x1="42" y1="163" x2="98" y2="163" stroke="#D5C9BB" strokeWidth="1" />
    </svg>
  );
}
