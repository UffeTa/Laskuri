/**
 * Alkuperäinen viimeisen päivän tanssi.
 * Moduuli vie CSS:n, juuriluokan ja tanssiasennon SVG-osoitteen.
 */
const style = {
  id: 'groove',
  rootClass: 'dance-groove',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes grooveBody {
  0%, 100% { transform: translateY(0px) rotate(-5deg) scaleY(1); }
  25% { transform: translateY(-9px) rotate(0deg) scaleY(1.04); }
  50% { transform: translateY(-2px) rotate(5deg) scaleY(0.96); }
  75% { transform: translateY(-10px) rotate(0deg) scaleY(1.04); }
}
@keyframes grooveArmLeft {
  0%, 100% { transform: rotate(-28deg); }
  50% { transform: rotate(24deg); }
}
@keyframes grooveArmRight {
  0%, 100% { transform: rotate(28deg); }
  50% { transform: rotate(-24deg); }
}
@keyframes grooveLegLeft {
  0%, 100% { transform: rotate(-16deg) translateY(0px); }
  50% { transform: rotate(18deg) translateY(-3px); }
}
@keyframes grooveLegRight {
  0%, 100% { transform: rotate(18deg) translateY(-3px); }
  50% { transform: rotate(-16deg) translateY(0px); }
}
.dance-groove .anim-dance-body {
  transform-origin: 48px 110px;
  animation: grooveBody 0.52s ease-in-out infinite;
}
.dance-groove .anim-dance-arm-l {
  transform-origin: 30px 54px;
  animation: grooveArmLeft 0.38s ease-in-out infinite;
}
.dance-groove .anim-dance-arm-r {
  transform-origin: 66px 54px;
  animation: grooveArmRight 0.38s ease-in-out infinite;
}
.dance-groove .anim-dance-leg-l {
  transform-origin: 37px 90px;
  animation: grooveLegLeft 0.38s ease-in-out infinite;
}
.dance-groove .anim-dance-leg-r {
  transform-origin: 58px 90px;
  animation: grooveLegRight 0.38s ease-in-out infinite;
}
`,
};

export default style;
