const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FOLDS = {
  ä: 'a',
  ö: 'o',
  å: 'a',
  æ: 'ae',
  ø: 'o',
  ü: 'u',
  é: 'e',
};

export function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length >= 2 && slug.length <= 48 && SLUG_RE.test(slug);
}

export function slugify(name) {
  let text = String(name || '').toLowerCase();
  text = text.replace(/[äöåæøüé]/g, (ch) => FOLDS[ch] || ch);
  text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  text = text.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  text = text.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  if (text.length < 2) return 'laskuri';
  return text;
}

export function randomSuffix() {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
