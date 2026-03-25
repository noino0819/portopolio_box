import { useCallback, useRef } from 'react';
import bookSoundFile from '@/assets/book-sound.mp3';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  return useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(bookSoundFile);
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(() => {});
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
