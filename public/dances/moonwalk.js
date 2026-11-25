const style = {
  id: 'moonwalk',
  rootClass: 'dance-moonwalk',
  walkClass: 'walk-moonwalk',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes moonBody {
  0% { transform: translateX(10px) rotate(14deg); }
  50% { transform: translateX(-14px) rotate(10deg) translateY(-2px); }
  100% { transform: translateX(10px) rotate(14deg); }
}
@keyframes moonArm {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(12deg); }
}
@keyframes moonLegL {
  0%, 100% { transform: translateX(0) rotate(4deg); }
  50% { transform: translateX(6px) rotate(-10deg); }
}
@keyframes moonLegR {
  0%, 100% { transform: translateX(6px) rotate(10deg); }
  50% { transform: translateX(0) rotate(-4deg); }
}
.dance-moonwalk .anim-dance-body { transform-origin: 48px 100px; animation: moonBody 0.7s linear infinite; }
.dance-moonwalk .anim-dance-arm-l, .dance-moonwalk .anim-dance-arm-r { animation: moonArm 0.7s linear infinite; }
.dance-moonwalk .anim-dance-leg-l { transform-origin: 40px 92px; animation: moonLegL 0.7s linear infinite; }
.dance-moonwalk .anim-dance-leg-r { transform-origin: 56px 92px; animation: moonLegR 0.7s linear infinite; }
@keyframes moonWalkBody {
  0% { transform: translateX(8px) rotate(10deg); }
  100% { transform: translateX(-10px) rotate(8deg); }
}
@keyframes moonWalkLeg {
  0%, 100% { transform: rotate(8deg); }
  50% { transform: rotate(-14deg); }
}
.walk-moonwalk .anim-walk-body { animation: moonWalkBody 0.55s linear infinite alternate; }
.walk-moonwalk .anim-leg-front, .walk-moonwalk .anim-leg-back { animation: moonWalkLeg 0.55s steps(2, end) infinite; }
.walk-moonwalk .anim-arm-front, .walk-moonwalk .anim-arm-back { animation-duration: 0.55s; }
`,
};

export default style;
