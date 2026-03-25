export default function ItemSwitch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="닌텐도 스위치"
    >
      {/* Left Joy-Con */}
      <rect x="10" y="5" width="50" height="90" rx="12" fill="#D4537E" />
      <rect x="10" y="5" width="50" height="90" rx="12" stroke="#B8416A" strokeWidth="1.5" fill="none" />
      {/* Left stick */}
      <circle cx="35" cy="35" r="10" fill="#B8416A" />
      <circle cx="35" cy="35" r="7" fill="#C65A7E" />
      {/* D-pad */}
      <rect x="29" y="58" width="12" height="4" rx="1" fill="#B8416A" />
      <rect x="33" y="54" width="4" height="12" rx="1" fill="#B8416A" />
      {/* Minus button */}
      <rect x="48" y="18" width="6" height="2" rx="1" fill="#B8416A" />

      {/* Screen */}
      <rect x="60" y="8" width="80" height="84" rx="4" fill="#1a1a2e" />
      <rect x="65" y="13" width="70" height="74" rx="2" fill="#16213e" />
      {/* Screen content */}
      <text x="100" y="45" textAnchor="middle" fill="#D4537E" fontSize="8" fontFamily="Outfit" fontWeight="600">
        HOBBIES
      </text>
      <text x="100" y="58" textAnchor="middle" fill="#666" fontSize="7" fontFamily="Outfit">
        ▶ PLAY
      </text>

      {/* Right Joy-Con */}
      <rect x="140" y="5" width="50" height="90" rx="12" fill="#378ADD" />
      <rect x="140" y="5" width="50" height="90" rx="12" stroke="#2B72BB" strokeWidth="1.5" fill="none" />
      {/* Right stick */}
      <circle cx="165" cy="60" r="10" fill="#2B72BB" />
      <circle cx="165" cy="60" r="7" fill="#4594DD" />
      {/* ABXY buttons */}
      <circle cx="165" cy="28" r="3.5" fill="#2B72BB" />
      <circle cx="158" cy="35" r="3.5" fill="#2B72BB" />
      <circle cx="172" cy="35" r="3.5" fill="#2B72BB" />
      <circle cx="165" cy="42" r="3.5" fill="#2B72BB" />
      {/* Plus button */}
      <rect x="147" y="17" width="6" height="2" rx="1" fill="#2B72BB" />
      <rect x="149" y="15" width="2" height="6" rx="1" fill="#2B72BB" />
    </svg>
  );
}
