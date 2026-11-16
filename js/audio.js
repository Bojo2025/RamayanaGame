// RAMAYANA: PATH OF DHARMA - WebAudio synth (same graph as Zombi Lile Runner / Paille-en-queue:
// master -> compressor -> limiter, separate music / sfx / ambience buses, delay send, ducking, iOS unlock).
// Score: an Indian-classical-flavoured procedural piece - tanpura drone, tabla theka, bansuri lead,
// veena plucks (Ravana's motif). No sega. Everything is synthesised live; no audio files.
(function () {
  'use strict';
  var A = {}, ctx = null, master, musicBus, sfxBus, ambBus, delay, delayFb, limiter, comp, noiseBuf = null;
  var muted = false, musicOn = false, mode = 'off', intensity = 0.3, nextStep = 0, step = 0, musicGain = 0.36;
  var raga = 'bhupali', lead = 'flute', amb = null, ambKind = null, ambTimer = 0, phrase = [], pIdx = 0, lastNote = 0;
  var SA = 50; // D3
  var RAGAS = { bhupali: [0, 2, 4, 7, 9], yaman: [0, 2, 4, 6, 7, 9, 11], bhairav: [0, 1, 4, 5, 7, 8, 11], malkauns: [0, 3, 5, 8, 10] };

  function AC() { return window.AudioContext || window.webkitAudioContext; }
  function setupGraph() {
    master = ctx.createGain(); master.gain.value = muted ? 0 : 1;
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 8; comp.ratio.value = 3.5; comp.attack.value = 0.004; comp.release.value = 0.16;
    limiter = ctx.createDynamicsCompressor(); limiter.threshold.value = -3; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.06;
    master.connect(comp); comp.connect(limiter); limiter.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = musicGain; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 1.6; sfxBus.connect(master);
    ambBus = ctx.createGain(); ambBus.gain.value = 0.3; ambBus.connect(master);
    delay = ctx.createDelay(1.2); delay.delayTime.value = 0.42; delayFb = ctx.createGain(); delayFb.gain.value = 0.36;
    var dl = ctx.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 2400;
    delay.connect(dl); dl.connect(delayFb); delayFb.connect(delay); dl.connect(musicBus);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    nextStep = ctx.currentTime + 0.1;
  }
  function silentUnlock() { try { var b = ctx.createBuffer(1, 1, ctx.sampleRate), s = ctx.createBufferSource(); s.buffer = b; s.connect(master); s.start(0); } catch (e) {} }
  A.init = function () {
    var C = AC(); if (!C) return;
    if (!ctx) { try { ctx = new C(); setupGraph(); } catch (e) { ctx = null; return; } }
    if (ctx.state === 'suspended') { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); }
    silentUnlock();
  };
  A.ready = function () { return !!ctx; };
  A.setMuted = function (m) { muted = m; if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05); };
  A.isMuted = function () { return muted; };
  A.suspend = function () { if (ctx && ctx.state === 'running') ctx.suspend(); };
  A.resume = function () { if (ctx && ctx.state === 'suspended') ctx.resume(); if (ctx) silentUnlock(); };

  function env(g, t, a, peak, dec, sus, rel, len) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, sus), t + a + dec);
    if (len !== undefined) { g.gain.setValueAtTime(Math.max(0.0001, sus), t + len); g.gain.exponentialRampToValueAtTime(0.0001, t + len + rel); }
  }
  function osc(type, f, t, len, vol, dest, opt) {
    opt = opt || {};
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (opt.from) { o.frequency.setValueAtTime(opt.from, t); o.frequency.exponentialRampToValueAtTime(f, t + (opt.fromT || 0.08)); }
    if (opt.to) o.frequency.exponentialRampToValueAtTime(Math.max(1, opt.to), t + (opt.toT || len));
    if (opt.detune) o.detune.value = opt.detune;
    if (opt.vib) { var l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = opt.vibF || 5.2; lg.gain.value = opt.vib; l.connect(lg); lg.connect(o.frequency); l.start(t + (opt.vibD || 0.15)); l.stop(t + len + 0.6); }
    env(g, t, opt.a || 0.005, vol, opt.d || len * 0.5, opt.s || vol * 0.3, opt.r || 0.05, len);
    var last = g;
    if (opt.lp) { var f1 = ctx.createBiquadFilter(); f1.type = 'lowpass'; f1.frequency.setValueAtTime(opt.lp, t); if (opt.lpTo) f1.frequency.exponentialRampToValueAtTime(opt.lpTo, t + (opt.lpT || len)); f1.Q.value = opt.q || 1; g.connect(f1); last = f1; }
    o.connect(g); last.connect(dest || sfxBus);
    if (opt.send) { var sg = ctx.createGain(); sg.gain.value = opt.send; last.connect(sg); sg.connect(delay); }
    o.start(t); o.stop(t + len + (opt.r || 0.05) + 0.1);
    return o;
  }
  function noise(t, len, vol, type, f, dest, opt) {
    opt = opt || {};
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var fl = ctx.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.setValueAtTime(f || 1000, t); fl.Q.value = opt.q || 1;
    if (opt.fTo) fl.frequency.exponentialRampToValueAtTime(Math.max(1, opt.fTo), t + len);
    var g = ctx.createGain(); env(g, t, opt.a || 0.004, vol, opt.d || len * 0.6, opt.s || 0.0001, opt.r || 0.04, len);
    s.connect(fl); fl.connect(g); g.connect(dest || sfxBus);
    s.start(t, Math.random() * 1.5); s.stop(t + len + 0.3);
  }
  A.duck = function (amount, hold, rise) {
    if (!ctx || !musicBus) return;
    var t = ctx.currentTime, g = musicBus.gain, a = amount == null ? 0.7 : amount;
    hold = hold == null ? 0.16 : hold; rise = rise == null ? 0.2 : rise;
    try { g.cancelScheduledValues(t); } catch (e) {}
    g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(musicGain * (1 - a), t + 0.025); g.linearRampToValueAtTime(musicGain, t + 0.025 + hold + rise);
  };
  var N = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  function swoosh(t, v) { noise(t, 0.17, v * 0.9, 'bandpass', 4800, null, { fTo: 700, q: 3, a: 0.002 }); osc('sine', 1900, t, 0.13, v * 0.25, null, { to: 400 }); }
  function clang(t, v) { [1210, 1730, 2650].forEach(function (f, k) { osc('triangle', f, t, 0.35 - k * 0.08, v * (0.3 - k * 0.07), null, { send: 0.2 }); }); noise(t, 0.05, v * 0.6, 'highpass', 3000); }
  function thunk(t, v) { osc('sine', 180, t, 0.12, v * 0.7, null, { to: 70 }); noise(t, 0.06, v * 0.5, 'lowpass', 900); }
  function twang(t, v) { osc('triangle', 160, t, 0.22, v * 0.5, null, { to: 110, lp: 1800 }); noise(t, 0.12, v * 0.35, 'bandpass', 2600, null, { fTo: 900, q: 2 }); }
  function chime(t, v, base) { [0, 4, 7, 12].forEach(function (d, k) { osc('sine', N((base || 81) + d), t + k * 0.055, 0.5, v * 0.25, null, { send: 0.45 }); }); }
  function bellSound(t, v, f) { [1, 2.76, 5.4].forEach(function (m, k) { osc('sine', f * m, t, 1.6 - k * 0.4, v * (0.35 - k * 0.1), null, { send: 0.5, d: 0.4, s: 0.02 }); }); }

  A.sfx = function (name) {
    if (!ctx || muted) return; var t = ctx.currentTime;
    switch (name) {
      case 'jump': osc('triangle', 300, t, 0.12, 0.22, null, { to: 560, lp: 2200 }); noise(t, 0.08, 0.12, 'bandpass', 1500); break;
      case 'djump': osc('triangle', 420, t, 0.14, 0.22, null, { to: 900, lp: 2800 }); noise(t, 0.14, 0.18, 'highpass', 2600, null, { fTo: 6000 }); break;
      case 'land': noise(t, 0.09, 0.3, 'lowpass', 380); break;
      case 'slide': noise(t, 0.38, 0.3, 'bandpass', 900, null, { fTo: 300, q: 0.7 }); break;
      case 'swing': swoosh(t, 1); A.duck(0.5, 0.08, 0.12); break;
      case 'cleave': swoosh(t, 1.1); osc('sawtooth', 150, t + 0.03, 0.26, 0.3, null, { to: 50, lp: 900 }); noise(t + 0.03, 0.18, 0.6, 'lowpass', 700, null, { q: 3 }); A.duck(0.75, 0.2, 0.2); break;
      case 'spin': for (var i = 0; i < 4; i++) swoosh(t + i * 0.09, 0.85); osc('sawtooth', 120, t, 0.5, 0.26, null, { to: 520, lp: 1600 }); chime(t + 0.2, 0.7, 74); A.duck(0.85, 0.35, 0.25); break;
      case 'hit': thunk(t, 1); noise(t, 0.08, 0.5, 'highpass', 2000); A.duck(0.6, 0.1, 0.15); break;
      case 'clang': clang(t, 1); A.duck(0.5, 0.1, 0.15); break;
      case 'bow': twang(t, 1); break;
      case 'bowHeavy': twang(t, 1.2); osc('sine', 600, t + 0.05, 0.4, 0.18, null, { to: 1400, send: 0.4 }); break;
      case 'astra': twang(t, 1.2); chime(t, 0.9, 76); osc('sawtooth', 200, t, 0.6, 0.2, null, { to: 900, lp: 2400, send: 0.4 }); A.duck(0.85, 0.4, 0.3); break;
      case 'thunk': thunk(t, 1); break;
      case 'perfect': chime(t, 1, 81); break;
      case 'good': chime(t, 0.6, 76); break;
      case 'miss': osc('triangle', 300, t, 0.2, 0.2, null, { to: 160 }); break;
      case 'pickup': [86, 90, 93].forEach(function (m, k) { osc('sine', N(m), t + k * 0.06, 0.25, 0.22, null, { send: 0.4 }); }); break;
      case 'standard': bellSound(t, 0.7, 520); [74, 81].forEach(function (m, k) { osc('triangle', N(m), t + 0.1 + k * 0.1, 0.4, 0.2, null, { send: 0.4 }); }); break;
      case 'hurt': osc('sawtooth', 280, t, 0.3, 0.32, null, { to: 90, lp: 1400 }); noise(t, 0.2, 0.3, 'bandpass', 1200); A.duck(0.45, 0.15, 0.15); break;
      case 'bell': bellSound(t, 1, 610); A.duck(0.5, 0.3, 0.3); break;
      case 'gong': bellSound(t, 1.2, 140); osc('sine', 70, t, 2.2, 0.4, null, { d: 1.6, s: 0.01 }); break;
      case 'crack': noise(t, 0.05, 0.9, 'highpass', 1800); noise(t + 0.02, 0.3, 0.6, 'bandpass', 500, null, { q: 2 }); osc('square', 120, t, 0.1, 0.2, null, { to: 50, lp: 500 }); break;
      case 'smash': noise(t, 0.5, 0.8, 'lowpass', 900, null, { fTo: 120 }); osc('sine', 90, t, 0.3, 0.6, null, { to: 35 }); noise(t + 0.05, 0.3, 0.4, 'bandpass', 2400, null, { q: 1 }); A.duck(0.7, 0.2, 0.2); break;
      case 'rumble': noise(t, 1.2, 0.5, 'lowpass', 200, null, { a: 0.1, d: 0.9, s: 0.05 }); break;
      case 'howl': osc('sawtooth', 380, t, 1.1, 0.16, null, { from: 300, fromT: 0.3, to: 260, lp: 1400, vib: 8, a: 0.15 }); break;
      case 'screech': osc('sawtooth', 1300, t, 0.35, 0.16, null, { to: 1800, lp: 3200, q: 6 }); osc('sawtooth', 1350, t, 0.35, 0.1, null, { to: 1750, lp: 3200 }); break;
      case 'growl': osc('sawtooth', 70, t, 0.6, 0.35, null, { to: 55, lp: 500, q: 5 }); noise(t, 0.5, 0.3, 'bandpass', 300, null, { q: 3 }); break;
      case 'bark': [0, 0.22].forEach(function (d) { osc('square', 420, t + d, 0.1, 0.22, null, { to: 220, lp: 1600 }); noise(t + d, 0.08, 0.25, 'bandpass', 900); }); break;
      case 'wind': noise(t, 1.6, 0.4, 'bandpass', 500, null, { fTo: 1400, q: 1.5, a: 0.4, d: 1.1, s: 0.05 }); break;
      case 'whisper': noise(t, 1.2, 0.35, 'bandpass', 2600, null, { q: 6, a: 0.3, fTo: 1800 }); noise(t + 0.4, 0.8, 0.25, 'bandpass', 3200, null, { q: 8, a: 0.2 }); break;
      case 'shout': osc('sawtooth', 230, t, 0.35, 0.3, null, { to: 180, lp: 1800, q: 3 }); noise(t, 0.3, 0.2, 'bandpass', 1100, null, { q: 2 }); break;
      case 'drum': osc('sine', 110, t, 0.3, 0.6, null, { to: 60, toT: 0.2 }); noise(t, 0.05, 0.3, 'lowpass', 700); break;
      case 'tick': osc('sine', 1400, t, 0.04, 0.12, null, {}); break;
      case 'talk': osc('triangle', 520 + Math.random() * 120, t, 0.05, 0.07, null, { lp: 2400 }); break;
      case 'tap': osc('sine', 880, t, 0.06, 0.16, null, { send: 0.2 }); break;
      case 'click': osc('triangle', 700, t, 0.05, 0.16, null, { lp: 3000 }); break;
      case 'level': [62, 66, 69, 74].forEach(function (m, k) { osc('triangle', N(m), t + k * 0.12, 0.4, 0.22, null, { send: 0.45 }); }); break;
      case 'victory': [62, 66, 69, 74, 69, 74, 78].forEach(function (m, k) { osc('triangle', N(m), t + k * 0.15, 0.45, 0.24, null, { send: 0.45 }); osc('sine', N(m - 12), t + k * 0.15, 0.4, 0.1, null, {}); }); bellSound(t + 1.05, 0.5, 587); break;
      case 'over': [69, 68, 65, 62].forEach(function (m, k) { osc('sawtooth', N(m - 12), t + k * 0.3, 0.45, 0.18, null, { lp: 900, send: 0.4 }); }); break;
      case 'splash': noise(t, 0.5, 0.45, 'lowpass', 1400, null, { fTo: 300 }); noise(t, 0.15, 0.3, 'highpass', 3000); break;
      case 'fire': noise(t, 0.6, 0.35, 'lowpass', 700, null, { q: 2 }); noise(t, 0.2, 0.3, 'highpass', 3000); break;
      case 'aura': osc('sine', N(74), t, 1.6, 0.18, null, { a: 0.4, send: 0.5, vib: 3 }); osc('sine', N(81), t + 0.2, 1.4, 0.12, null, { a: 0.4, send: 0.5 }); break;
    }
  };

  // ---------------- Music ----------------
  A.setMusic = function (m, opts) {
    opts = opts || {};
    if (opts.raga) raga = opts.raga; if (opts.lead) lead = opts.lead; if (opts.intensity != null) intensity = opts.intensity;
    if (m === mode) return; mode = m; musicOn = m !== 'off'; phrase = []; pIdx = 0;
  };
  A.setIntensity = function (i) { intensity = Math.max(0, Math.min(1.2, i)); };
  function deg(d) { var sc = RAGAS[raga] || RAGAS.bhupali, n = sc.length, o = Math.floor(d / n); return SA + 12 * o + sc[((d % n) + n) % n]; }
  function tanpura(t, spb) {
    // Pa - Sa' - Sa' - Sa over 16 steps, long shimmering decay
    [[0, -5], [4, 12], [8, 12], [12, 0]].forEach(function (p) {
      var tt = t + p[0] * spb, f = N(SA - 12 + p[1]);
      osc('sawtooth', f, tt, 2.6, 0.05, musicBus, { a: 0.02, d: 1.4, s: 0.02, r: 0.9, lp: 1300, lpTo: 500, detune: (Math.random() - 0.5) * 6 });
      osc('sine', f * 2, tt, 2.0, 0.025, musicBus, { a: 0.03, d: 1, s: 0.01, r: 0.6 });
    });
  }
  function bayan(t, v) { osc('sine', 95, t, 0.32, v, musicBus, { from: 140, fromT: 0.03, to: 70, toT: 0.3, d: 0.25, s: 0.002 }); }
  function dayan(t, v, f) { osc('triangle', f || 520, t, 0.09, v, musicBus, { d: 0.07, s: 0.001 }); noise(t, 0.03, v * 0.6, 'highpass', 4000, musicBus); }
  function tin(t, v) { osc('sine', 760, t, 0.18, v, musicBus, { d: 0.15, s: 0.001, send: 0.1 }); }
  // Keherwa (8): Dha Ge Na Ti | Na Ka Dhi Na ; 2 steps per matra
  var THEKA = ['DG', '', 'g', '', 'n', '', 't', '', 'n', '', 'k', '', 'DG', '', 'n', ''];
  function flute(t, m, len, v) { osc('sine', N(m), t, len, v, musicBus, { a: 0.07, d: len * 0.4, s: v * 0.7, r: 0.25, vib: 3.5, vibF: 5.3, vibD: 0.2, send: 0.55, from: N(m - 1), fromT: 0.06 }); osc('triangle', N(m) * 2, t, len, v * 0.12, musicBus, { a: 0.08, s: v * 0.05, r: 0.2 }); noise(t, 0.12, v * 0.25, 'bandpass', N(m) * 2, musicBus, { q: 8, a: 0.03 }); }
  function veena(t, m, v) { osc('sawtooth', N(m), t, 0.9, v, musicBus, { a: 0.003, d: 0.5, s: v * 0.08, r: 0.35, lp: 3200, lpTo: 600, lpT: 0.5, q: 2, from: N(m - 2), fromT: 0.1, send: 0.35 }); osc('sine', N(m - 12), t, 0.7, v * 0.4, musicBus, { d: 0.4, s: 0.003 }); }
  function makePhrase() {
    var out = [], d = 2 + Math.floor(Math.random() * 3), steps = 0;
    var len = mode === 'arena' ? 24 : 32;
    while (steps < len) {
      var dur = [2, 2, 4, 4, 6, 8][Math.floor(Math.random() * (mode === 'arena' ? 3 : 6))];
      d += [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]; d = Math.max(-1, Math.min(9, d));
      out.push({ at: steps, m: deg(d) + 12, len: dur }); steps += dur + (Math.random() < 0.25 ? 2 : 0);
    }
    return out;
  }
  function schedule(t, s, spb) {
    var s16 = s % 16, s32 = s % 32;
    if (s16 === 0 && mode !== 'penance') tanpura(t, spb);
    if (mode === 'penance') {
      if (s % 32 === 0) { osc('sawtooth', N(SA - 12), t, 6, 0.06, musicBus, { a: 1.5, d: 2, s: 0.05, r: 2.5, lp: 600 }); osc('sawtooth', N(SA - 5), t, 6, 0.035, musicBus, { a: 1.8, d: 2, s: 0.03, r: 2.5, lp: 500 }); }
      if (s % 64 === 48) bellSound(t, 0.18, N(SA + 24));
      if (s % 32 === 16 && Math.random() < 0.6) veena(t, deg(Math.floor(Math.random() * 5)) + 12, 0.07);
      return;
    }
    var I = mode === 'arena' ? Math.max(0.85, intensity) : intensity;
    if ((mode === 'play' && I > 0.15) || mode === 'arena') {
      var b = THEKA[s16];
      if (b.indexOf('D') >= 0) { bayan(t, 0.42); dayan(t, 0.18); }
      else if (b === 'g') bayan(t, 0.22);
      else if (b === 'n') dayan(t, 0.14 + I * 0.06);
      else if (b === 't') tin(t, 0.12);
      else if (b === 'k') dayan(t, 0.1, 380);
      if (I > 0.7 && s16 % 2 === 1) dayan(t, 0.05, 620);
    } else if (mode === 'title' || mode === 'calm') {
      if (s32 === 0) bayan(t, 0.2); if (s32 === 20) dayan(t, 0.06);
    }
    if (!phrase.length || pIdx >= phrase.length) { if (s32 === 0) { phrase = makePhrase(); pIdx = 0; phrase.base = s; } else return; }
    var rel = s - phrase.base;
    while (pIdx < phrase.length && phrase[pIdx].at <= rel) {
      var n = phrase[pIdx++];
      var useVeena = lead === 'veena' || (mode === 'arena' && Math.random() < 0.5);
      var v = mode === 'title' || mode === 'calm' ? 0.09 : 0.07 + I * 0.04;
      if (mode === 'play' && I < 0.35 && Math.random() < 0.4) continue;
      if (useVeena) { veena(t, n.m, v * 1.4); if (n.len >= 4) veena(t + spb * 2, n.m, v * 0.8); }
      else flute(t, n.m, n.len * spb * 0.95, v);
    }
  }
  A.update = function (dt) {
    if (!ctx) return;
    if (musicOn) {
      var bpm = mode === 'title' ? 68 : mode === 'calm' ? 64 : mode === 'penance' ? 56 : mode === 'arena' ? 112 : 84 + 30 * Math.min(1, intensity);
      var spb = 60 / bpm / 2;
      if (nextStep < ctx.currentTime - 0.5) nextStep = ctx.currentTime + 0.05;
      while (nextStep < ctx.currentTime + 0.15) { if (!muted) schedule(nextStep, step, spb); step++; nextStep += spb; }
    }
    ambTimer -= dt;
    if (ambKind && ambTimer <= 0 && !muted) {
      var t = ctx.currentTime; ambTimer = 1.4 + Math.random() * 3;
      if (ambKind === 'palace' || ambKind === 'yard' || ambKind === 'court') {
        var f = 2400 + Math.random() * 1800; for (var k = 0; k < 2 + Math.floor(Math.random() * 3); k++) osc('sine', f, t + k * 0.09, 0.06, 0.04, ambBus, { to: f * 1.25 });
        if (ambKind === 'palace' && Math.random() < 0.15) bellSound(t + 0.3, 0.12, 880);
        if (ambKind === 'palace' && Math.random() < 0.12) { osc('sawtooth', 700, t, 0.5, 0.05, ambBus, { to: 1100, lp: 2000, q: 4 }); osc('sawtooth', 900, t + 0.5, 0.4, 0.04, ambBus, { to: 600, lp: 2000, q: 4 }); }
      } else if (ambKind === 'battle') { noise(t, 0.3, 0.12, 'highpass', 2500, ambBus); if (Math.random() < 0.3) noise(t, 1.4, 0.12, 'lowpass', 180, ambBus, { a: 0.3 }); }
      else if (ambKind === 'mountain' || ambKind === 'peak' || ambKind === 'range') { noise(t, 2.6, ambKind === 'range' ? 0.14 : 0.09, 'bandpass', 400 + Math.random() * 600, ambBus, { a: 0.9, d: 1.4, s: 0.02, q: 3 }); if (ambKind === 'peak' && Math.random() < 0.4) { var cf = 4200 + Math.random() * 600; for (var c = 0; c < 4; c++) osc('sine', cf, t + c * 0.05, 0.03, 0.015, ambBus, {}); } }
    }
  };
  A.setAmbience = function (kind) {
    if (!ctx || kind === ambKind) return; ambKind = kind;
    if (amb) { try { amb.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3); var old = amb; setTimeout(function () { try { old.s.stop(); } catch (e) {} }, 1500); } catch (e) {} amb = null; }
    if (!kind) return;
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var f = ctx.createBiquadFilter(), g = ctx.createGain(); g.gain.value = 0.0001;
    var lfo = ctx.createOscillator(), lg = ctx.createGain();
    var cfg = { battle: ['lowpass', 300, 0.2, 0.07, 0.08], palace: ['lowpass', 900, 0.06, 0.1, 0.03], yard: ['lowpass', 800, 0.08, 0.1, 0.04], court: ['lowpass', 600, 0.06, 0.1, 0.03],
      mountain: ['bandpass', 600, 0.2, 0.08, 0.14], peak: ['bandpass', 450, 0.18, 0.05, 0.12], range: ['bandpass', 700, 0.22, 0.13, 0.18] }[kind] || ['lowpass', 400, 0.08, 0.1, 0.04];
    f.type = cfg[0]; f.frequency.value = cfg[1]; lfo.frequency.value = cfg[3]; lg.gain.value = cfg[4];
    lfo.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(ambBus);
    g.gain.setTargetAtTime(cfg[2], ctx.currentTime, 0.8); s.start(); lfo.start();
    amb = { s: s, g: g }; ambTimer = 1;
  };
  // Offline peak test for the headless suite (each SFX rendered into its own OfflineAudioContext).
  A.measureSfx = function (names) {
    var OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OC) return Promise.reject(new Error('no OfflineAudioContext'));
    var results = [], sr = 44100;
    function one(i) {
      if (i >= names.length) return Promise.resolve(results);
      var oc = new OC(2, Math.ceil(sr * 0.8), sr);
      var saved = [ctx, master, musicBus, sfxBus, ambBus, delay, noiseBuf, muted];
      ctx = oc; muted = false; setupGraph(); A.sfx(names[i]);
      return oc.startRendering().then(function (buf) {
        var d = buf.getChannelData(0), peak = 0; for (var n = 0; n < d.length; n++) peak = Math.max(peak, Math.abs(d[n]));
        results.push({ name: names[i], peak: peak });
        ctx = saved[0]; master = saved[1]; musicBus = saved[2]; sfxBus = saved[3]; ambBus = saved[4]; delay = saved[5]; noiseBuf = saved[6]; muted = saved[7];
        return one(i + 1);
      });
    }
    return one(0);
  };
  window.RPDAudio = A;
})();
