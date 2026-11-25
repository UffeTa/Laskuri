const CHROMA = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function parseChord(symbol) {
  const match = String(symbol).match(/^([A-Ga-g])([#b]?)(m|maj7|7)?$/);
  if (!match) throw new Error(`Virheellinen sointu: ${symbol}`);
  let root = CHROMA[match[1].toLowerCase()];
  if (match[2] === '#') root += 1;
  if (match[2] === 'b') root -= 1;
  const quality = match[3] || '';
  const minor = quality === 'm';
  return {
    root: (root + 12) % 12,
    minor,
    third: minor ? 3 : 4,
    seventh: quality === '7' ? 10 : (quality === 'maj7' ? 11 : null),
  };
}

export function pitch(midi) {
  const wrapped = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NAMES[wrapped]}${octave}`;
}

function degree(chord, interval) {
  return chord.root + interval;
}

function leadInterval(chord, motif, step) {
  const interval = motif[((step % motif.length) + motif.length) % motif.length];
  if (interval === 2) return chord.minor ? 3 : 4;
  if (interval === 3) return chord.minor ? 3 : 4;
  return interval;
}

/**
 * Rakentaa yhden tahdin tapahtumat. step0 on tahdin ensimmäinen 16-osanuotti.
 * Variaatio pitää kolmen minuutin kierroksen elävänä ilman uutta sävelmää joka tahdissa.
 */
export function emitBar(events, chordSymbol, motif, feel, step0, variation, stepSeconds) {
  const chord = parseChord(chordSymbol);
  const root3 = 48 + chord.root;
  const sparse = variation.sparse;
  const busy = variation.busy;
  const fill = variation.fill;

  const bassHits = sparse ? [0, 8] : [0, 6, 8, 14];
  bassHits.forEach((step, index) => {
    const interval = index % 2 === 0 ? 0 : (busy ? 7 : 12);
    events.push({
      time: (step0 + step) * stepSeconds,
      kind: 'bass',
      note: pitch(root3 - 12 + (interval === 12 ? 0 : interval) + (interval === 12 ? 12 : 0)),
      dur: stepSeconds * (sparse ? 6 : 3),
      vel: 0.8,
    });
  });

  const arpSteps = busy ? [0, 2, 4, 6, 8, 10, 12, 14] : [0, 4, 8, 12];
  const tones = [0, chord.third, 7, chord.seventh == null ? 12 : chord.seventh];
  if (!sparse || variation.repeatIndex > 0) {
    arpSteps.forEach((step, index) => {
      const tone = tones[index % tones.length] + (variation.arpOctave && index % 2 === 0 ? 12 : 0);
      events.push({
        time: (step0 + step) * stepSeconds,
        kind: 'arp',
        note: pitch(60 + degree(chord, tone)),
        dur: stepSeconds * (busy ? 2 : 3.5),
        vel: 0.45,
      });
    });
  }

  if (!variation.dropLead && !variation.introMuteLead) {
    const leadSteps = busy ? [0, 2, 4, 6, 8, 10, 12, 14] : [0, 4, 6, 8, 12];
    leadSteps.forEach((step, index) => {
      if (sparse && index % 2 === 1) return;
      const interval = leadInterval(chord, motif, index + variation.motifShift);
      events.push({
        time: (step0 + step) * stepSeconds,
        kind: 'lead',
        note: pitch(72 + degree(chord, interval) + variation.leadOctave),
        dur: stepSeconds * (busy ? 2 : 3),
        vel: fill ? 0.9 : 0.7,
      });
    });
  }

  const kicks = fill ? [0, 4, 8, 12] : (sparse ? [0, 8] : [0, 8]);
  kicks.forEach((step) => {
    events.push({ time: (step0 + step) * stepSeconds, kind: 'kick', dur: stepSeconds * 2, vel: 0.9 });
  });
  const snares = fill ? [2, 6, 10, 12, 14] : [4, 12];
  if (!sparse || fill) {
    snares.forEach((step) => {
      events.push({ time: (step0 + step) * stepSeconds, kind: 'snare', dur: stepSeconds, vel: fill ? 0.7 : 0.55 });
    });
  }
  const hats = busy ? [2, 6, 10, 14] : (sparse ? [6, 14] : [4, 12]);
  hats.forEach((step) => {
    if (fill && step === 12) return;
    events.push({ time: (step0 + step) * stepSeconds, kind: 'hat', dur: stepSeconds * 0.5, vel: 0.35 });
  });
}

export function compileTrack(definition) {
  const stepSeconds = (60 / definition.bpm) / 4;
  const events = [];
  let step = 0;
  definition.sections.forEach((section) => {
    for (let repeatIndex = 0; repeatIndex < section.repeat; repeatIndex += 1) {
      section.chords.forEach((chord, barIndex) => {
        const lastBar = barIndex === section.chords.length - 1;
        emitBar(events, chord, section.motif, section.feel, step, {
          sparse: section.feel === 'night' && repeatIndex === 0 && barIndex < 2,
          busy: section.feel === 'race' || (section.feel === 'overworld' && repeatIndex % 2 === 1),
          fill: lastBar && repeatIndex === section.repeat - 1 && section.name !== 'intro',
          dropLead: section.name === 'bridge' && barIndex % 2 === 1,
          introMuteLead: section.name === 'intro' && repeatIndex === 0,
          leadOctave: repeatIndex % 2 === 1 && barIndex % 2 === 0 ? 12 : 0,
          arpOctave: repeatIndex % 3 === 2,
          motifShift: repeatIndex + barIndex,
          repeatIndex,
        }, stepSeconds);
        step += 16;
      });
    }
  });
  const seconds = step * stepSeconds;
  events.forEach((event) => {
    const remain = seconds - event.time;
    if (event.dur > remain - 0.02) event.dur = Math.max(0.05, remain - 0.02);
  });
  return {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    bpm: definition.bpm,
    seconds,
    bars: step / 16,
    events,
  };
}
