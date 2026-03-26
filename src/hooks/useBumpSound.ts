import { useCallback, useMemo, useRef } from 'react';

export function useBumpSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastBumpRef = useRef(0);

  const prepare = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
  }, []);

  const play = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || ctx.state !== 'running') return;

    const now = performance.now();
    if (now - lastBumpRef.current < 300) return;
    lastBumpRef.current = now;

    try {
      const t = ctx.currentTime + 0.01;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.09);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    } catch { /* context not ready */ }
  }, []);

  return useMemo(() => ({ prepare, play }), [prepare, play]);
}
