import { useState, useRef, useEffect } from 'react';

const EMOJI_GROUPS = [
  { label: '표정', emojis: ['😀', '😊', '😎', '🥰', '🤔', '😢', '😡', '🤗', '🥺', '😴', '🤩', '🫡'] },
  { label: '손/몸', emojis: ['👋', '👍', '👏', '🙌', '💪', '🙆‍♂️', '🙅‍♀️', '🤝', '✌️', '🫶', '👆', '✋'] },
  { label: '하트', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💝', '💖', '💕', '❣️'] },
  { label: '사물', emojis: ['💻', '📱', '🎮', '🎵', '📚', '📷', '🎨', '✈️', '🏠', '⚽', '🎯', '🔧'] },
  { label: '자연', emojis: ['🌟', '🔥', '⚡', '🌈', '🌸', '🍀', '🌊', '☀️', '🌙', '❄️', '🌍', '💎'] },
  { label: '기타', emojis: ['✉️', '📝', '💼', '🎓', '🏆', '🚀', '💡', '🗣️', '📖', '🎒', '🎭', '⭐'] },
];

interface EmojiInputProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export default function EmojiInput({ value, onChange, className = '' }: EmojiInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center rounded border border-white/10 bg-white/5 text-lg outline-none transition-colors hover:border-gold/30 focus:border-gold/50 ${className}`}
      >
        {value || <span className="text-card/25 text-sm">+</span>}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[240px] rounded-lg border border-white/10 bg-bg-dark p-2 shadow-xl">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="직접 입력"
            className="mb-2 w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm text-card outline-none focus:border-gold/50"
            maxLength={4}
          />
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label} className="mb-1">
              <p className="mb-0.5 text-[9px] text-card/30">{group.label}</p>
              <div className="flex flex-wrap gap-0.5">
                {group.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => { onChange(emoji); setOpen(false); }}
                    className="flex h-7 w-7 items-center justify-center rounded text-sm transition-colors hover:bg-white/10"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
