export default function SuitcaseOpen({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="열린 가방 내부"
    >
      {/* Outer suitcase frame */}
      <rect x="30" y="30" width="440" height="440" rx="24" fill="#3D2B1F" />
      <rect x="30" y="30" width="440" height="440" rx="24" stroke="#5A3E2E" strokeWidth="3" fill="none" />

      {/* Interior lining */}
      <rect x="50" y="50" width="400" height="400" rx="16" fill="#5C3D2E" />

      {/* Fabric pattern */}
      <defs>
        <pattern id="fabric" patternUnits="userSpaceOnUse" width="20" height="20">
          <path d="M0 10h20M10 0v20" stroke="#6B4A38" strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="50" y="50" width="400" height="400" rx="16" fill="url(#fabric)" />

      {/* Elastic straps */}
      <line x1="50" y1="140" x2="450" y2="140" stroke="#8B6914" strokeWidth="3" strokeDasharray="8,4" opacity="0.4" />
      <line x1="50" y1="360" x2="450" y2="360" stroke="#8B6914" strokeWidth="3" strokeDasharray="8,4" opacity="0.4" />
      <line x1="140" y1="50" x2="140" y2="450" stroke="#8B6914" strokeWidth="3" strokeDasharray="8,4" opacity="0.4" />
      <line x1="360" y1="50" x2="360" y2="450" stroke="#8B6914" strokeWidth="3" strokeDasharray="8,4" opacity="0.4" />

      {/* Corner pockets */}
      <path d="M50 66 Q50 50 66 50 L130 50 L50 130Z" fill="#4A3020" opacity="0.4" />
      <path d="M450 66 Q450 50 434 50 L370 50 L450 130Z" fill="#4A3020" opacity="0.4" />
      <path d="M50 434 Q50 450 66 450 L130 450 L50 370Z" fill="#4A3020" opacity="0.4" />
      <path d="M450 434 Q450 450 434 450 L370 450 L450 370Z" fill="#4A3020" opacity="0.4" />

      {/* Zipper around the inside */}
      <rect x="45" y="45" width="410" height="410" rx="20" stroke="#D4A853" strokeWidth="1.5" strokeDasharray="3,3" fill="none" opacity="0.3" />
    </svg>
  );
}
