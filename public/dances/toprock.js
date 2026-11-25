const style = {
  id: 'toprock',
  rootClass: 'dance-toprock',
  walkClass: 'walk-brisk',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes toprockBody {
  0%, 100% { transform: translateX(-16px) rotate(-8deg); }
  50% { transform: translateX(16px) rotate(8deg) translateY(-4px); }
}
@keyframes toprockArmL {
  0%, 100% { transform: rotate(24deg); }
  50% { transform: rotate(-50deg); }
}
@keyframes toprockArmR {
  0%, 100% { transform: rotate(-24deg); }
  50% { transform: rotate(50deg); }
}
@keyframes toprockLegL {
  0%, 100% { transform: rotate(22deg) translateY(-2px); }
  50% { transform: rotate(-6deg); }
}
@keyframes toprockLegR {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(-22deg) translateY(-2px); }
}
.dance-toprock .anim-dance-body { transform-origin: 48px 100px; animation: toprockBody 0.42s steps(2, end) infinite; }
.dance-toprock .anim-dance-arm-l { transform-origin: 28px 52px; animation: toprockArmL 0.42s steps(2, end) infinite; }
.dance-toprock .anim-dance-arm-r { transform-origin: 68px 52px; animation: toprockArmR 0.42s steps(2, end) infinite; }
.dance-toprock .anim-dance-leg-l { transform-origin: 38px 92px; animation: toprockLegL 0.42s steps(2, end) infinite; }
.dance-toprock .anim-dance-leg-r { transform-origin: 58px 92px; animation: toprockLegR 0.42s steps(2, end) infinite; }
@keyframes briskBody {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-6px) rotate(3deg); }
}
.walk-brisk .anim-walk-body { animation: briskBody 0.28s linear infinite; }
.walk-brisk .anim-leg-front, .walk-brisk .anim-leg-back,
.walk-brisk .anim-arm-front, .walk-brisk .anim-arm-back { animation-duration: 0.28s; }
`,
};

export default style;
