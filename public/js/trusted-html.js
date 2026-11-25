/**
 * Sijoittaa vain sovelluksen omat staattiset assetit (SVG/piha).
 * Käyttäjän nimiä, aikoja ja viestejä ei saa antaa tähän — ne kuuluvat textContentille.
 * <template> ei aja skriptejä.
 */
export function mountTrustedMarkup(element, markup) {
  const template = document.createElement('template');
  template.innerHTML = markup;
  element.replaceChildren(template.content);
}
