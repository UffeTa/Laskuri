const style = {
  id: 'twist',
  rootClass: 'dance-twist',
  walkClass: 'walk-brisk',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes twistBody {
  0%, 100% { transform: rotate(-18deg) scaleX(0.92); }
  50% { transform: rotate(18deg) scaleX(1.06); }
}
@keyframes twistArm {
  0%, 100% { transform: rotate(-36deg); }
  50% { transform: rotate(36deg); }
}
@keyframes twistLegL {
  0%, 100% { transform: rotate(16deg); }
  50% { transform: rotate(-20deg); }
}
@keyframes twistLegR {
  0%, 100% { transform: rotate(-16deg); }
  50% { transform: rotate(20deg); }
}
.dance-twist .anim-dance-body { transform-origin: 48px 96px; animation: twistBody 0.4s linear infinite; }
.dance-twist .anim-dance-arm-l { transform-origin: 30px 54px; animation: twistArm 0.4s linear infinite; }
.dance-twist .anim-dance-arm-r { transform-origin: 66px 54px; animation: twistArm 0.4s linear infinite reverse; }
.dance-twist .anim-dance-leg-l { transform-origin: 40px 90px; animation: twistLegL 0.4s linear infinite; }
.dance-twist .anim-dance-leg-r { transform-origin: 56px 90px; animation: twistLegR 0.4s linear infinite; }
`,
};

export default style;
