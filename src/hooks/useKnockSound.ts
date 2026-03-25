import { useCallback, useRef } from 'react';

export function useKnockSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playKnock = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;

    const playOne = (delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + delay + 0.08);

      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.12);
    };

    playOne(0);
    playOne(0.18);
  }, []);

  return playKnock;
}
