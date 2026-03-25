export default function ItemBook({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="책"
    >
      {/* Book body */}
      <rect x="15" y="20" width="120" height="150" rx="4" fill="#534AB7" />
      <rect x="15" y="20" width="120" height="150" rx="4" stroke="#3D3490" strokeWidth="2" fill="none" />

      {/* Spine */}
      <rect x="15" y="20" width="16" height="150" rx="4" fill="#3D3490" />

      {/* Pages side */}
      <rect x="19" y="24" width="8" height="142" fill="#F5EFE6" rx="1" />

      {/* Cover decorations */}
      <rect x="45" y="50" width="76" height="3" rx="1.5" fill="#D4A853" />
      <rect x="45" y="60" width="76" height="3" rx="1.5" fill="#D4A853" opacity="0.5" />

      <text x="83" y="95" textAnchor="middle" fill="#D4A853" fontSize="11" fontWeight="bold" fontFamily="Outfit">
        PROJECTS
      </text>
      <text x="83" y="110" textAnchor="middle" fill="#8B83D4" fontSize="8" fontFamily="Gowun Batang">
        & Experience
      </text>

      <rect x="45" y="125" width="76" height="3" rx="1.5" fill="#D4A853" opacity="0.5" />
      <rect x="45" y="135" width="76" height="3" rx="1.5" fill="#D4A853" />

      {/* Bookmark ribbon */}
      <path d="M115 20 L115 45 L120 38 L125 45 L125 20" fill="#C0392B" />
    </svg>
  );
}
