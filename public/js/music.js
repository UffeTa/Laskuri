let notify = () => {};

export function setMusicNotifier(fn) {
    notify = typeof fn === 'function' ? fn : () => {};
}

export function updateMusicButtonsUI() {
    const on = RetroSynthMusicEngine.isPlaying;
    const btn = document.getElementById('btn-music-toggle');
    const fsBtn = document.getElementById('btn-fs-music');
    if (btn) {
        btn.textContent = on ? '🔊 Musiikki: PÄÄLLÄ' : '🔇 Musiikki: POIS';
        btn.classList.toggle('bg-[#06D6A0]', on);
        btn.classList.toggle('bg-[#FFD166]', !on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (fsBtn) {
        fsBtn.textContent = on ? '🔊 Musiikki' : '🔇 Musiikki';
        fsBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
}

export const RetroSynthMusicEngine = {
            isPlaying: false,
            initialized: false,
            phase: 'day',
            mood: 'walk',
            stepIndex: 0,
            leadSynth: null,
            bassSynth: null,
            arpSynth: null,
            kickSynth: null,
            hatSynth: null,
            loopEvent: null,

            tracks: {
                dawn: {
                    bpm: 100,
                    lead: ['E4', null, 'G4', null, 'B4', null, 'A4', 'G4', 'E4', null, 'D4', null, 'G4', null, 'B4', null],
                    bass: ['C2', null, 'C2', null, 'G2', null, 'G2', null, 'A1', null, 'A1', null, 'E2', null, 'G2', null],
                    arp:  ['C4', 'E4', 'G4', 'B4', 'D4', 'G4', 'B4', 'D5', 'A3', 'C4', 'E4', 'A4', 'G3', 'B3', 'D4', 'G4']
                },
                day: {
                    bpm: 116,
                    lead: ['C5', null, 'E5', 'G5', null, 'E5', 'D5', 'C5', 'A4', null, 'C5', 'D5', 'E5', null, 'G5', null],
                    bass: ['C2', 'C3', 'C2', 'C3', 'F2', 'F3', 'F2', 'F3', 'A1', 'A2', 'A1', 'A2', 'G2', 'G3', 'G2', 'G3'],
                    arp:  ['C4', 'G4', 'E4', 'G4', 'F4', 'A4', 'C5', 'A4', 'A3', 'E4', 'C4', 'E4', 'G3', 'D4', 'B3', 'D4']
                },
                sunset: {
                    bpm: 108,
                    lead: ['A4', null, 'C5', null, 'E5', 'D5', 'C5', null, 'G4', null, 'B4', null, 'D5', 'C5', 'B4', null],
                    bass: ['A1', 'A1', 'A2', 'A1', 'F1', 'F1', 'F2', 'F1', 'C2', 'C2', 'C3', 'C2', 'G1', 'G1', 'G2', 'G1'],
                    arp:  ['A3', 'C4', 'E4', 'A4', 'F3', 'A3', 'C4', 'F4', 'C4', 'E4', 'G4', 'C5', 'G3', 'B3', 'D4', 'G4']
                },
                twilight: {
                    bpm: 98,
                    lead: ['D4', null, 'F4', null, 'A4', null, 'G4', null, 'C4', null, 'E4', null, 'G4', 'F4', 'E4', null],
                    bass: ['D2', null, 'D2', 'A2', 'Bb1', null, 'Bb1', 'F2', 'C2', null, 'C2', 'G2', 'A1', null, 'A1', 'E2'],
                    arp:  ['D4', 'F4', 'A4', 'D5', 'Bb3', 'D4', 'F4', 'Bb4', 'C4', 'E4', 'G4', 'C5', 'A3', 'C4', 'E4', 'A4']
                },
                night: {
                    bpm: 90,
                    lead: ['E4', null, null, 'B4', null, 'A4', 'G4', null, 'D4', null, null, 'A4', null, 'G4', 'F#4', null],
                    bass: ['E2', null, 'B1', null, 'C2', null, 'G1', null, 'D2', null, 'A1', null, 'B1', null, 'E2', null],
                    arp:  ['E3', 'G3', 'B3', 'E4', 'C3', 'E3', 'G3', 'C4', 'D3', 'F#3', 'A3', 'D4', 'B2', 'D3', 'F#3', 'B3']
                },
                dance: {
                    bpm: 132,
                    lead: ['C5', 'E5', 'G5', 'C6', 'B5', 'G5', 'A5', 'G5', 'F5', 'A5', 'C6', 'A5', 'G5', 'E5', 'D5', 'G5'],
                    bass: ['C2', 'C3', 'G2', 'C3', 'A1', 'A2', 'E2', 'A2', 'F1', 'F2', 'C2', 'F2', 'G1', 'G2', 'B1', 'G2'],
                    arp:  ['C4', 'E4', 'G4', 'C5', 'A3', 'C4', 'E4', 'A4', 'F3', 'A3', 'C4', 'F4', 'G3', 'B3', 'D4', 'G4']
                }
            },

            init() {
                if (this.initialized || typeof Tone === 'undefined') return;
                try {
                    const masterVol = new Tone.Volume(-10).toDestination();

                    this.leadSynth = new Tone.PolySynth(Tone.Synth, {
                        oscillator: { type: 'square' },
                        envelope: { attack: 0.01, decay: 0.14, sustain: 0.25, release: 0.2 }
                    }).connect(masterVol);
                    this.leadSynth.volume.value = -6;

                    this.bassSynth = new Tone.MonoSynth({
                        oscillator: { type: 'sawtooth' },
                        filter: { Q: 2, type: 'lowpass', rolloff: -24 },
                        envelope: { attack: 0.01, decay: 0.18, sustain: 0.4, release: 0.15 },
                        filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.2, baseFrequency: 180, octaves: 2.2 }
                    }).connect(masterVol);
                    this.bassSynth.volume.value = -5;

                    this.arpSynth = new Tone.Synth({
                        oscillator: { type: 'triangle' },
                        envelope: { attack: 0.005, decay: 0.1, sustain: 0.1, release: 0.1 }
                    }).connect(masterVol);
                    this.arpSynth.volume.value = -12;

                    this.kickSynth = new Tone.MembraneSynth({
                        pitchDecay: 0.04,
                        octaves: 6,
                        envelope: { attack: 0.001, decay: 0.22, sustain: 0.01, release: 0.2 }
                    }).connect(masterVol);
                    this.kickSynth.volume.value = -4;

                    this.hatSynth = new Tone.NoiseSynth({
                        noise: { type: 'white' },
                        envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
                    }).connect(masterVol);
                    this.hatSynth.volume.value = -16;

                    this.loopEvent = new Tone.Loop((time) => {
                        const trackKey = (this.mood === 'dance' || this.mood === 'celebrate')
                            ? 'dance'
                            : (this.tracks[this.phase] ? this.phase : 'day');
                        const track = this.tracks[trackKey];
                        const i = this.stepIndex % 16;

                        const leadNote = track.lead[i];
                        const bassNote = track.bass[i];
                        const arpNote = track.arp[i];

                        if (leadNote) {
                            this.leadSynth.triggerAttackRelease(leadNote, '16n', time);
                        }
                        if (bassNote) {
                            this.bassSynth.triggerAttackRelease(bassNote, '8n', time);
                        }
                        if (arpNote && (this.mood === 'cheerful' || this.mood === 'dance' || this.mood === 'celebrate' || this.phase === 'sunset' || this.phase === 'dawn')) {
                            this.arpSynth.triggerAttackRelease(arpNote, '16n', time);
                        }

                        const isNightChill = this.phase === 'night' && this.mood === 'walk';
                        if (!isNightChill) {
                            if (i % 4 === 0) {
                                this.kickSynth.triggerAttackRelease('C1', '8n', time);
                            }
                            if (i % 4 === 2 || (this.mood === 'dance' && i % 2 === 1)) {
                                this.hatSynth.triggerAttackRelease('32n', time);
                            }
                        } else if (i === 0 || i === 8) {
                            this.kickSynth.triggerAttackRelease('C1', '8n', time);
                        }

                        this.stepIndex = (this.stepIndex + 1) % 16;
                    }, '16n');

                    this.initialized = true;
                } catch (e) {
                    this.initialized = false;
                }
            },

            getTargetBpm() {
                const trackKey = (this.mood === 'dance' || this.mood === 'celebrate')
                    ? 'dance'
                    : (this.tracks[this.phase] ? this.phase : 'day');
                let bpm = this.tracks[trackKey].bpm;
                if (this.mood === 'cheerful') bpm += 8;
                return bpm;
            },

            updateContext(phase, mood) {
                this.phase = phase || this.phase;
                this.mood = mood || this.mood;
                if (this.isPlaying && typeof Tone !== 'undefined') {
                    try {
                        Tone.Transport.bpm.rampTo(this.getTargetBpm(), 0.8);
                    } catch (e) {}
                }
            },

            async start({ quiet = false } = {}) {
                if (typeof Tone === 'undefined') {
                    if (!quiet) notify('Äänimoottoria ei voitu ladata selaimessa.');
                    return false;
                }
                try {
                    if (this.isPlaying) return true;
                    await Tone.start();
                    this.init();
                    if (!this.initialized) return false;
                    this.stepIndex = 0;
                    Tone.Transport.bpm.value = this.getTargetBpm();
                    this.loopEvent.start(0);
                    Tone.Transport.start();
                    this.isPlaying = true;
                    updateMusicButtonsUI();
                    if (!quiet) notify('80–90-luvun retromusiikki päällä! 🎹');
                    return true;
                } catch (e) {
                    if (!quiet) notify('Äänen käynnistys estettiin selaimessa.');
                    return false;
                }
            },

            async toggle() {
                if (this.isPlaying) {
                    this.stop();
                    notify('Musiikki mykistetty.');
                    return;
                }
                await this.start({ quiet: false });
            },

            stop() {
                if (typeof Tone !== 'undefined' && this.loopEvent) {
                    try {
                        this.loopEvent.stop();
                        Tone.Transport.stop();
                    } catch (e) {}
                }
                this.isPlaying = false;
                updateMusicButtonsUI();
            },

            playVictoryFanfare() {
                if (!this.isPlaying || !this.initialized || typeof Tone === 'undefined') return;
                try {
                    const now = Tone.now();
                    const notes = [
                        { n: 'C5', t: 0.0, d: '16n' },
                        { n: 'E5', t: 0.12, d: '16n' },
                        { n: 'G5', t: 0.24, d: '16n' },
                        { n: 'C6', t: 0.38, d: '4n' },
                        { n: 'G5', t: 0.62, d: '16n' },
                        { n: 'C6', t: 0.76, d: '2n' }
                    ];
                    notes.forEach(item => {
                        this.leadSynth.triggerAttackRelease(item.n, item.d, now + item.t);
                    });
                } catch (e) {}
            }
        };
