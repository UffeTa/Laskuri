import { DANCE_STYLES } from './registry.js';

export { DANCE_STYLES };

const cache = new Map();

/**
 * Lataa yhden tyylin moduulin. Tuntematon id palauttaa rekisterin ensimmäisen tyylin.
 */
export async function loadDance(id) {
  const entry = DANCE_STYLES.find((item) => item.id === id) || DANCE_STYLES[0];
  if (cache.has(entry.id)) return cache.get(entry.id);
  const mod = await import(new URL(entry.module, import.meta.url).href);
  const dance = {
    ...mod.default,
    id: entry.id,
    name: entry.name,
    description: entry.description,
  };
  cache.set(entry.id, dance);
  return dance;
}

export async function loadAllDances() {
  const loaded = [];
  for (const entry of DANCE_STYLES) {
    loaded.push(await loadDance(entry.id));
  }
  return loaded;
}

/** Lisää tyylin CSS kerran <style>-elementtinä. Teksti tulee moduulista, ei käyttäjältä. */
export function ensureDanceStylesheet(dance) {
  const elementId = `dance-css-${dance.id}`;
  if (document.getElementById(elementId)) return;
  const style = document.createElement('style');
  style.id = elementId;
  style.textContent = dance.css;
  document.head.appendChild(style);
}
