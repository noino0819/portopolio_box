import { useCallback, useRef } from 'react';

export function useKnockSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playKnock = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    // 버클 달칵 — 금속 클릭음 2번
    [0, 0.12].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(delay === 0 ? 1200 : 900, now + delay);
      osc.frequency.exponentialRampToValueAtTime(400, now + delay + 0.04);
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);
      osc.start(now + delay);
      osc.stop(now + delay + 0.06);
    });

    // 가방 열림 — 부드러운 스웹 + 힌지 삐걱
    const swoosh = ctx.createOscillator();
    const swooshGain = ctx.createGain();
    swoosh.connect(swooshGain);
    swooshGain.connect(ctx.destination);
    swoosh.type = 'sine';
    swoosh.frequency.setValueAtTime(200, now + 0.2);
    swoosh.frequency.exponentialRampToValueAtTime(500, now + 0.4);
    swoosh.frequency.exponentialRampToValueAtTime(350, now + 0.55);
    swooshGain.gain.setValueAtTime(0, now + 0.2);
    swooshGain.gain.linearRampToValueAtTime(0.1, now + 0.3);
    swooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    swoosh.start(now + 0.2);
    swoosh.stop(now + 0.55);

    // 가죽 마찰 노이즈
    const bufLen = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    noise.buffer = buffer;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1500, now + 0.22);
    noiseFilter.Q.setValueAtTime(1, now + 0.22);
    noiseGain.gain.setValueAtTime(0, now + 0.22);
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    noise.start(now + 0.22);
    noise.stop(now + 0.5);
  }, []);

  return playKnock;
}
