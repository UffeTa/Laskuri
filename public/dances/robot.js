/**
 * Esimerkkityyli: robottitanssi. Todistaa, että tyyli vaihtuu laskurikohtaisesti.
 * Uusi tyyli syntyy kopioimalla tämä tiedosto ja lisäämällä rivi registry.js-tiedostoon.
 */
const style = {
  id: 'robot',
  rootClass: 'dance-robot',
  svgUrl: '/assets/character-dance-robot.svg',
  css: `
@keyframes robotBody {
  0%, 49.9% { transform: translate(0px, 0px) rotate(-8deg); }
  50%, 100% { transform: translate(0px, -16px) rotate(8deg); }
}
@keyframes robotArmLeft {
  0%, 49.9% { transform: rotate(-85deg); }
  50%, 100% { transform: rotate(8deg); }
}
@keyframes robotArmRight {
  0%, 49.9% { transform: rotate(85deg); }
  50%, 100% { transform: rotate(-8deg); }
}
@keyframes robotLegLeft {
  0%, 49.9% { transform: translateY(0px) rotate(0deg); }
  50%, 100% { transform: translateY(-10px) rotate(-22deg); }
}
@keyframes robotLegRight {
  0%, 49.9% { transform: translateY(-10px) rotate(22deg); }
  50%, 100% { transform: translateY(0px) rotate(0deg); }
}
.dance-robot .anim-dance-body {
  transform-origin: 48px 100px;
  animation: robotBody 0.44s steps(2, end) infinite;
}
.dance-robot .anim-dance-arm-l {
  transform-origin: 24px 54px;
  animation: robotArmLeft 0.44s steps(2, end) infinite;
}
.dance-robot .anim-dance-arm-r {
  transform-origin: 72px 54px;
  animation: robotArmRight 0.44s steps(2, end) infinite;
}
.dance-robot .anim-dance-leg-l {
  transform-origin: 37px 90px;
  animation: robotLegLeft 0.44s steps(2, end) infinite;
}
.dance-robot .anim-dance-leg-r {
  transform-origin: 58px 90px;
  animation: robotLegRight 0.44s steps(2, end) infinite;
}
`,
};

export default style;
