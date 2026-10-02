// Procedural ambient drone — soft Am7 chord with slow LFO breathing.
// Nothing streams or downloads; built on the fly with Web Audio API.
// Default off; toggle starts/stops a smooth fade.

export function createAmbient() {
  let ctx = null;
  let master = null;
  let on = false;

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.7;

    master.connect(filter);
    filter.connect(ctx.destination);

    // Am7 drone (A, C, E, G) spread across octaves.
    // [frequency, gain, LFO rate]
    const notes = [
      [55.00, 0.26, 0.038],   // A1  — root
      [110.00, 0.14, 0.051],  // A2  — root octave for warmth
      [130.81, 0.11, 0.067],  // C3  — minor third
      [164.81, 0.09, 0.079],  // E3  — fifth
      [196.00, 0.07, 0.093],  // G3  — seventh
      [220.00, 0.05, 0.113],  // A3  — top octave shimmer
    ];

    notes.forEach(([freq, gain, lfoRate], i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 8;

      const g = ctx.createGain();
      g.gain.value = gain * 0.6;

      // Slow LFO modulating amplitude for a breathing texture.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = lfoRate;
      lfo.type = 'sine';
      const lfoAmp = ctx.createGain();
      lfoAmp.gain.value = gain * 0.35;
      lfo.connect(lfoAmp);
      lfoAmp.connect(g.gain);

      osc.connect(g);
      g.connect(master);

      osc.start();
      lfo.start();
    });

    // One slow second-order shimmer — a sine two octaves up on E, panned around.
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 329.63; // E4
    shimmer.detune.value = 4;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.015;
    const shimmerLfo = ctx.createOscillator();
    shimmerLfo.frequency.value = 0.17;
    const shimmerLfoAmp = ctx.createGain();
    shimmerLfoAmp.gain.value = 0.02;
    shimmerLfo.connect(shimmerLfoAmp);
    shimmerLfoAmp.connect(shimmerGain.gain);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(master);
    shimmer.start();
    shimmerLfo.start();
  }

  return {
    get on() { return on; },
    async toggle() {
      if (!ctx) build();
      if (!ctx) return false;
      if (ctx.state === 'suspended') await ctx.resume();
      on = !on;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(on ? 0.11 : 0, now + 2.0);
      return on;
    },
  };
}
