import { runtime } from './runtime.js';
import { RetroSynthMusicEngine } from './music.js';

function pad2(num) {
    return String(Math.floor(num)).padStart(2, '0');
}

export function updateTimeOfDayLighting() {
    const lightingClock = document.getElementById('lighting-clock');
    const lightingSlider = document.getElementById('lighting-slider');
    const lightingModeText = document.getElementById('lighting-mode-text');
    const lightingIcon = document.getElementById('lighting-icon');
    const lightingPhaseLabel = document.getElementById('lighting-phase-label');
    const stageLightingOverlay = document.getElementById('stage-lighting-overlay');
    if (!stageLightingOverlay) return;

            const now = new Date();
            const decimalHour = runtime.previewHourOverride !== null
                ? runtime.previewHourOverride
                : now.getHours() + now.getMinutes() / 60;

            const displayH = Math.floor(decimalHour) % 24;
            const displayM = Math.floor((decimalHour - Math.floor(decimalHour)) * 60);
            if (lightingClock) lightingClock.textContent = `${pad2(displayH)}:${pad2(displayM)}`;

            if (lightingSlider) {
                if (runtime.previewHourOverride === null) {
                    lightingSlider.value = (Math.round(decimalHour * 4) / 4).toFixed(2);
                }
            }
            if (lightingModeText) {
                lightingModeText.textContent = runtime.previewHourOverride === null
                    ? 'Reaaliaikainen'
                    : `Esikatselu (${pad2(displayH)}:${pad2(displayM)})`;
            }

            const envSky = document.getElementById('env-sky');
            const envStars = document.getElementById('env-stars');
            const envCelestial = document.getElementById('env-celestial');
            const envClouds = document.getElementById('env-clouds');
            const yardLampGlow = document.getElementById('yard-lamp-glow');
            const doorLampGlow = document.getElementById('door-lamp-glow');
            const ahlsellSign = document.getElementById('ahlsell-sign');
            const ahlsellWindows = document.getElementById('ahlsell-windows');
            const carBeam = document.getElementById('car-headlight-beam');

            if (!envSky) return;

            let phaseName = 'Päivä';
            let icon = '☀️';
            let skyBg = '';
            let overlayColor = 'rgba(0,0,0,0)';
            let starsOpacity = '0';
            let cloudsOpacity = '0.9';
            let lampOpacity = '0';
            let carBeamOpacity = '0';
            let signShadow = '0 0 6px rgba(130, 215, 255, 0.5)';
            let windowGlow = 'none';
            let celestialBg = '#FFD166';
            let celestialShadow = '0 0 18px rgba(255, 209, 102, 0.8)';

            const isDaytime = decimalHour >= 5 && decimalHour < 20.5;
            const arcProgress = isDaytime
                ? (decimalHour - 5) / 15.5
                : ((decimalHour >= 20.5 ? decimalHour - 20.5 : decimalHour + 3.5) / 8.5);
            const leftPct = 8 + arcProgress * 80;
            const topPct = 34 - Math.sin(arcProgress * Math.PI) * 26;

            if (decimalHour >= 5 && decimalHour < 8) {
                runtime.currentLightingPhase = 'dawn';
                phaseName = 'Aamunkoitto';
                icon = '🌅';
                skyBg = 'linear-gradient(180deg, #3a506b 0%, #c86d8a 48%, #ffbe76 100%)';
                overlayColor = 'rgba(255, 175, 110, 0.14)';
                starsOpacity = '0.2';
                lampOpacity = '0.45';
                carBeamOpacity = '0.35';
                signShadow = '0 0 14px rgba(140, 225, 255, 0.85)';
                windowGlow = '0 0 14px rgba(255, 232, 160, 0.55)';
                celestialBg = '#ffb347';
            } else if (decimalHour >= 8 && decimalHour < 17) {
                runtime.currentLightingPhase = 'day';
                phaseName = 'Päivä';
                icon = '☀️';
                skyBg = 'linear-gradient(180deg, #3a86ff 0%, #72c8f7 60%, #d4f1ff 100%)';
                overlayColor = 'rgba(255, 255, 255, 0)';
                starsOpacity = '0';
                lampOpacity = '0';
                carBeamOpacity = '0';
                signShadow = '0 0 5px rgba(255, 255, 255, 0.45)';
                windowGlow = 'none';
                celestialBg = '#FFD166';
            } else if (decimalHour >= 17 && decimalHour < 20.5) {
                runtime.currentLightingPhase = 'sunset';
                phaseName = 'Auringonlasku';
                icon = '🌇';
                skyBg = 'linear-gradient(180deg, #5e3a8c 0%, #c94b8f 42%, #ff7b6b 75%, #ffc875 100%)';
                overlayColor = 'rgba(180, 65, 110, 0.18)';
                starsOpacity = '0.25';
                lampOpacity = '0.6';
                carBeamOpacity = '0.5';
                signShadow = '0 0 16px rgba(130, 225, 255, 0.95)';
                windowGlow = '0 0 18px rgba(255, 225, 140, 0.7)';
                celestialBg = '#ff7b54';
                celestialShadow = '0 0 22px rgba(255, 123, 84, 0.9)';
            } else if (decimalHour >= 20.5 && decimalHour < 22.5) {
                runtime.currentLightingPhase = 'twilight';
                phaseName = 'Iltahämärä';
                icon = '🌆';
                skyBg = 'linear-gradient(180deg, #161b33 0%, #2c2a5a 55%, #663d66 100%)';
                overlayColor = 'rgba(20, 25, 65, 0.34)';
                starsOpacity = '0.75';
                cloudsOpacity = '0.35';
                lampOpacity = '0.9';
                carBeamOpacity = '0.8';
                signShadow = '0 0 22px rgba(120, 220, 255, 1), 0 0 40px rgba(30, 144, 255, 0.75)';
                windowGlow = '0 0 24px rgba(255, 225, 130, 0.85)';
                celestialBg = '#e8edf5';
                celestialShadow = '0 0 14px rgba(232, 237, 245, 0.8)';
            } else {
                runtime.currentLightingPhase = 'night';
                phaseName = 'Yö';
                icon = '🌙';
                skyBg = 'linear-gradient(180deg, #090d1a 0%, #131c36 65%, #1e2a4a 100%)';
                overlayColor = 'rgba(8, 14, 38, 0.44)';
                starsOpacity = '1';
                cloudsOpacity = '0.18';
                lampOpacity = '1';
                carBeamOpacity = '0.95';
                signShadow = '0 0 24px rgba(120, 225, 255, 1), 0 0 46px rgba(14, 165, 233, 0.9)';
                windowGlow = '0 0 28px rgba(255, 225, 130, 0.95)';
                celestialBg = '#f1f5f9';
                celestialShadow = '0 0 18px rgba(241, 245, 249, 0.9)';
            }

            lightingIcon.textContent = icon;
            lightingPhaseLabel.textContent = phaseName;

            envSky.style.background = skyBg;
            stageLightingOverlay.style.backgroundColor = overlayColor;
            envStars.style.opacity = starsOpacity;
            envClouds.style.opacity = cloudsOpacity;

            envCelestial.style.left = `${leftPct}%`;
            envCelestial.style.top = `${topPct}%`;
            envCelestial.style.background = celestialBg;
            envCelestial.style.boxShadow = celestialShadow;

            if (yardLampGlow) yardLampGlow.style.opacity = lampOpacity;
            if (doorLampGlow) doorLampGlow.style.opacity = lampOpacity;
            if (ahlsellSign) ahlsellSign.style.textShadow = signShadow;
            if (ahlsellWindows) ahlsellWindows.style.boxShadow = windowGlow;
            if (carBeam) carBeam.style.opacity = carBeamOpacity;

            RetroSynthMusicEngine.updateContext(runtime.currentLightingPhase, runtime.currentMood);
        }
