import { useCallback, useRef } from 'react';

export function useOpenSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playOpen = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    // 지퍼/잠금장치 찰칵 소리
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
    clickGain.gain.setValueAtTime(0.15, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    clickOsc.start(now);
    clickOsc.stop(now + 0.08);

    // 슝~ 열림 스웹 사운드
    const swooshOsc = ctx.createOscillator();
    const swooshGain = ctx.createGain();
    swooshOsc.connect(swooshGain);
    swooshGain.connect(ctx.destination);
    swooshOsc.type = 'sine';
    swooshOsc.frequency.setValueAtTime(150, now + 0.05);
    swooshOsc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
    swooshOsc.frequency.exponentialRampToValueAtTime(400, now + 0.45);
    swooshGain.gain.setValueAtTime(0, now + 0.05);
    swooshGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    swooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    swooshOsc.start(now + 0.05);
    swooshOsc.stop(now + 0.5);

    // 부드러운 착지 노이즈
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noise.buffer = buffer;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2000, now + 0.08);
    noiseFilter.Q.setValueAtTime(0.5, now + 0.08);
    noiseGain.gain.setValueAtTime(0, now + 0.08);
    noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    noise.start(now + 0.08);
    noise.stop(now + 0.4);
  }, []);

  return playOpen;
}
