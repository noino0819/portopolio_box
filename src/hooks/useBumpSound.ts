import { useCallback, useRef } from 'react';

export function useBumpSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastBumpRef = useRef(0);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();

    return ctx;
  }, []);

  const play = useCallback(() => {
    const now = performance.now();
    if (now - lastBumpRef.current < 150) return;
    lastBumpRef.current = now;

    const ctx = ensureCtx();
    const t = ctx.currentTime;

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
    osc.stop(t + 0.08);
  }, [ensureCtx]);

  return { prepare: ensureCtx, play };
}
