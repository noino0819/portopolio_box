import { useCallback, useRef } from 'react';

function getContext(ref: React.MutableRefObject<AudioContext | null>) {
  if (!ref.current) ref.current = new AudioContext();
  return ref.current;
}

function useNametagSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(() => {
    const ctx = getContext(ctxRef);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }, []);
}

function useBookSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(() => {
    const ctx = getContext(ctxRef);
    const now = ctx.currentTime;

    const playPage = (delay: number, freq: number, vol: number) => {
      const len = ctx.sampleRate * 0.12;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const src = ctx.createBufferSource();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();
      src.buffer = buf;
      src.connect(flt);
      flt.connect(g);
      g.connect(ctx.destination);
      flt.type = 'highpass';
      flt.frequency.setValueAtTime(freq, now + delay);
      flt.frequency.linearRampToValueAtTime(freq + 2000, now + delay + 0.08);
      flt.Q.setValueAtTime(0.8, now + delay);
      g.gain.setValueAtTime(vol, now + delay);
      g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
      src.start(now + delay);
      src.stop(now + delay + 0.12);
    };

    playPage(0, 2000, 0.15);
    playPage(0.06, 2500, 0.12);
    playPage(0.11, 3000, 0.08);
  }, []);
}

function useSwitchSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(() => {
    const ctx = getContext(ctxRef);
    const now = ctx.currentTime;

    [0, 0.08].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(delay === 0 ? 660 : 880, now + delay);
      gain.gain.setValueAtTime(0.08, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.07);
      osc.start(now + delay);
      osc.stop(now + delay + 0.07);
    });
  }, []);
}

function useCDSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(() => {
    const ctx = getContext(ctxRef);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.15);
    osc.frequency.linearRampToValueAtTime(500, now + 0.3);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);

    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(1200, now + 0.05);
    shimmer.frequency.exponentialRampToValueAtTime(800, now + 0.25);
    shimmerGain.gain.setValueAtTime(0.04, now + 0.05);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    shimmer.start(now + 0.05);
    shimmer.stop(now + 0.3);
  }, []);
}

export function useItemSounds() {
  const nametag = useNametagSound();
  const book = useBookSound();
  const switchSound = useSwitchSound();
  const cd = useCDSound();

  return { nametag, book, switch: switchSound, cd } as const;
}
