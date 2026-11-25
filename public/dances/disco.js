const style = {
  id: 'disco',
  rootClass: 'dance-disco',
  walkClass: 'walk-disco',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes discoBody {
  0%, 100% { transform: translateX(-6px) rotate(-12deg); }
  50% { transform: translateX(8px) rotate(14deg) translateY(-6px); }
}
@keyframes discoArmL {
  0%, 100% { transform: rotate(-78deg); }
  50% { transform: rotate(-20deg); }
}
@keyframes discoArmR {
  0%, 100% { transform: rotate(36deg); }
  50% { transform: rotate(70deg); }
}
@keyframes discoLeg {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(18deg) translateY(-4px); }
}
.dance-disco .anim-dance-body { transform-origin: 48px 108px; animation: discoBody 0.48s ease-in-out infinite; }
.dance-disco .anim-dance-arm-l { transform-origin: 24px 54px; animation: discoArmL 0.48s steps(2, end) infinite; }
.dance-disco .anim-dance-arm-r { transform-origin: 72px 54px; animation: discoArmR 0.48s steps(2, end) infinite; }
.dance-disco .anim-dance-leg-l, .dance-disco .anim-dance-leg-r { animation: discoLeg 0.48s ease-in-out infinite; }
@keyframes discoWalk {
  0%, 100% { transform: translateY(0) rotate(-6deg); }
  50% { transform: translateY(-10px) rotate(6deg); }
}
.walk-disco .anim-walk-body { animation: discoWalk 0.36s ease-in-out infinite; }
.walk-disco .anim-leg-front, .walk-disco .anim-leg-back { animation-duration: 0.36s; }
.walk-disco .anim-arm-front, .walk-disco .anim-arm-back { animation-duration: 0.36s; }
`,
};

export default style;
