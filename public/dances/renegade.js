const style = {
  id: 'renegade',
  rootClass: 'dance-renegade',
  walkClass: 'walk-brisk',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes renBody {
  0% { transform: translateX(-8px) rotate(-6deg); }
  25% { transform: translateX(4px) rotate(8deg) translateY(-6px); }
  50% { transform: translateX(10px) rotate(-4deg); }
  75% { transform: translateX(-2px) rotate(10deg); }
  100% { transform: translateX(-8px) rotate(-6deg); }
}
@keyframes renArmL {
  0% { transform: rotate(-30deg); }
  25% { transform: rotate(-90deg); }
  50% { transform: rotate(10deg); }
  75% { transform: rotate(60deg); }
  100% { transform: rotate(-30deg); }
}
@keyframes renArmR {
  0% { transform: rotate(40deg); }
  25% { transform: rotate(-10deg); }
  50% { transform: rotate(80deg); }
  75% { transform: rotate(-40deg); }
  100% { transform: rotate(40deg); }
}
.dance-renegade .anim-dance-body { transform-origin: 48px 102px; animation: renBody 0.9s steps(4, end) infinite; }
.dance-renegade .anim-dance-arm-l { transform-origin: 28px 50px; animation: renArmL 0.9s steps(4, end) infinite; }
.dance-renegade .anim-dance-arm-r { transform-origin: 68px 50px; animation: renArmR 0.9s steps(4, end) infinite; }
.dance-renegade .anim-dance-leg-l, .dance-renegade .anim-dance-leg-r { animation: none; }
`,
};
export default style;
