const style = {
  id: 'hop',
  rootClass: 'dance-hop',
  walkClass: 'walk-hop',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes hopBody {
  0%, 100% { transform: translateY(0) scaleY(0.9) scaleX(1.08); }
  40% { transform: translateY(-26px) scaleY(1.08) scaleX(0.94); }
  70% { transform: translateY(-8px) scaleY(1); }
}
@keyframes hopArm {
  0%, 100% { transform: rotate(8deg); }
  40% { transform: rotate(-30deg); }
}
@keyframes hopLeg {
  0%, 100% { transform: rotate(0deg); }
  40% { transform: rotate(-12deg) translateY(-4px); }
}
.dance-hop .anim-dance-body { transform-origin: 48px 112px; animation: hopBody 0.55s ease-in-out infinite; }
.dance-hop .anim-dance-arm-l, .dance-hop .anim-dance-arm-r { animation: hopArm 0.55s ease-in-out infinite; }
.dance-hop .anim-dance-leg-l, .dance-hop .anim-dance-leg-r { animation: hopLeg 0.55s ease-in-out infinite; }
@keyframes hopWalk {
  0%, 100% { transform: translateY(0) scaleY(0.94); }
  50% { transform: translateY(-16px) scaleY(1.05); }
}
.walk-hop .anim-walk-body { animation: hopWalk 0.42s ease-in-out infinite; }
.walk-hop .anim-leg-front, .walk-hop .anim-leg-back { animation-duration: 0.42s; }
.walk-hop .anim-arm-front, .walk-hop .anim-arm-back { animation-duration: 0.42s; }
`,
};

export default style;
