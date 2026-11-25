import { RetroSynthMusicEngine } from './music.js';
import { loadTrack, nextTrackId } from '../music/index.js';

const MUTE_KEY = 'ahlsell_comic_music_muted';

let musicBus = null;
let fxLead = null;
let lead = null;
let bass = null;
let arp = null;
let kick = null;
let snare = null;
let hat = null;
let part = null;
let current = null;

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch (e) {
    return false;
  }
}

export function rememberMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch (e) {}
}

function ensureGraph() {
  if (musicBus || typeof Tone === 'undefined') return;
  musicBus = new Tone.Volume(-18).toDestination();
  const fxBus = new Tone.Volume(-4).toDestination();

  lead = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.15, release: 0.08 },
  }).connect(musicBus);
  lead.volume.value = -8;

  bass = new Tone.MonoSynth({
    oscillator: { type: 'square' },
    filter: { Q: 1, type: 'lowpass', rolloff: -24 },
    envelope: { attack: 0.01, decay: 0.08, sustain: 0.35, release: 0.06 },
    filterEnvelope: { attack: 0.01, decay: 0.08, sustain: 0.15, baseFrequency: 140, octaves: 1.6 },
  }).connect(musicBus);
  bass.volume.value = -8;

  arp = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.07, sustain: 0.02, release: 0.04 },
  }).connect(musicBus);
  arp.volume.value = -16;

  kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    envelope: { attack: 0.001, decay: 0.16, sustain: 0, release: 0.08 },
  }).connect(musicBus);
  kick.volume.value = -10;

  snare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
  }).connect(musicBus);
  snare.volume.value = -18;

  hat = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.03, sustain: 0 },
  }).connect(musicBus);
  hat.volume.value = -24;

  fxLead = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.005, decay: 0.08, sustain: 0.35, release: 0.18 },
  }).connect(fxBus);
  fxLead.volume.value = 0;
  musicBus.mute = isMuted();
}

function schedule(compiled) {
  if (part) {
    part.stop();
    part.dispose();
    part = null;
  }
  RetroSynthMusicEngine.playlistOwnsClock = true;
  Tone.Transport.bpm.value = compiled.bpm;
  part = new Tone.Part((time, event) => {
    if (event.kind === 'lead') lead.triggerAttackRelease(event.note, event.dur, time, event.vel);
    else if (event.kind === 'bass') bass.triggerAttackRelease(event.note, event.dur, time, event.vel);
    else if (event.kind === 'arp') arp.triggerAttackRelease(event.note, event.dur, time, event.vel);
    else if (event.kind === 'kick') kick.triggerAttackRelease('C1', '8n', time, event.vel);
    else if (event.kind === 'snare') snare.triggerAttackRelease('16n', time, event.vel);
    else if (event.kind === 'hat') hat.triggerAttackRelease('32n', time, event.vel);
  }, compiled.events);
  part.loop = true;
  part.loopEnd = compiled.seconds;
  if (Tone.Transport.state === 'started') Tone.Transport.pause();
  Tone.Transport.seconds = 0;
  part.start(0);
  Tone.Transport.start();
  current = compiled;
}

export function currentTrack() {
  return current;
}

export async function unlockAudio() {
  if (typeof Tone === 'undefined') return false;
  await Tone.start();
  ensureGraph();
  return true;
}

export async function startTrack(trackId) {
  if (!(await unlockAudio())) return null;
  const compiled = await loadTrack(trackId);
  musicBus.mute = isMuted();
  schedule(compiled);
  return compiled;
}

export async function switchTrack(trackId) {
  if (typeof Tone === 'undefined') return null;
  ensureGraph();
  const compiled = await loadTrack(trackId);
  const wasMuted = isMuted();
  schedule(compiled);
  musicBus.mute = wasMuted;
  return compiled;
}

export async function playNext() {
  const id = current ? nextTrackId(current.id) : nextTrackId('');
  return switchTrack(id);
}

export function setMusicMuted(muted) {
  rememberMuted(muted);
  if (musicBus) musicBus.mute = muted;
}

export function toggleMute() {
  const next = !isMuted();
  setMusicMuted(next);
  return next;
}

export function playFanfare() {
  if (!fxLead || typeof Tone === 'undefined') return;
  try {
    const now = Tone.now();
    const notes = [
      { n: 'C5', t: 0, d: '16n' },
      { n: 'E5', t: 0.12, d: '16n' },
      { n: 'G5', t: 0.24, d: '16n' },
      { n: 'C6', t: 0.38, d: '4n' },
      { n: 'G5', t: 0.62, d: '16n' },
      { n: 'C6', t: 0.76, d: '2n' },
    ];
    notes.forEach((item) => {
      fxLead.triggerAttackRelease(item.n, item.d, now + item.t, 0.95);
    });
  } catch (e) {}
}
