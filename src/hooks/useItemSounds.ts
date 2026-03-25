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

    const bufLen = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.Q.setValueAtTime(1.5, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.start(now);
    noise.stop(now + 0.15);

    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.type = 'sine';
    thud.frequency.setValueAtTime(120, now);
    thud.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    thudGain.gain.setValueAtTime(0.12, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    thud.start(now);
    thud.stop(now + 0.1);
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
