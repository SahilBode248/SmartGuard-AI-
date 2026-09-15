// Web Audio API Synthesizer for SmartGuard 105dB Emergency Tactical Siren

let audioCtx = null;
let sirenOsc = null;
let sirenGain = null;
let sirenInterval = null;

export const startTacticalSiren = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (sirenOsc) stopTacticalSiren();

    sirenOsc = audioCtx.createOscillator();
    sirenGain = audioCtx.createGain();

    sirenOsc.type = 'sawtooth';
    sirenGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

    let pitchHigh = true;
    sirenInterval = setInterval(() => {
      if (!sirenOsc || !audioCtx) return;
      try {
        if (pitchHigh) {
          sirenOsc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.35);
        } else {
          sirenOsc.frequency.exponentialRampToValueAtTime(550, audioCtx.currentTime + 0.35);
        }
        pitchHigh = !pitchHigh;
      } catch (err) {
        // Silently handle context ramp timing errors
      }
    }, 400);

    sirenOsc.connect(sirenGain);
    sirenGain.connect(audioCtx.destination);
    sirenOsc.start();
    return true;
  } catch (err) {
    console.warn("Web Audio API siren error:", err);
    return false;
  }
};

export const stopTacticalSiren = () => {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOsc) {
    try {
      sirenOsc.stop();
      sirenOsc.disconnect();
    } catch (e) {}
    sirenOsc = null;
  }
};

export const playAudioBeep = (freq = 880, duration = 0.2) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
};
