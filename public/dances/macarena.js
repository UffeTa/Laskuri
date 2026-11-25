const style = {
  id: 'macarena',
  rootClass: 'dance-macarena',
  walkClass: '',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes macaBody {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  80% { transform: translateY(-4px) rotate(8deg); }
}
@keyframes macaArmL {
  0% { transform: rotate(-90deg); }
  25% { transform: rotate(-10deg); }
  50% { transform: rotate(-70deg); }
  75% { transform: rotate(15deg); }
  100% { transform: rotate(-90deg); }
}
@keyframes macaArmR {
  0% { transform: rotate(90deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(70deg); }
  75% { transform: rotate(-15deg); }
  100% { transform: rotate(90deg); }
}
.dance-macarena .anim-dance-body { transform-origin: 48px 108px; animation: macaBody 1.05s steps(4, end) infinite; }
.dance-macarena .anim-dance-arm-l { transform-origin: 26px 50px; animation: macaArmL 1.05s steps(4, end) infinite; }
.dance-macarena .anim-dance-arm-r { transform-origin: 70px 50px; animation: macaArmR 1.05s steps(4, end) infinite; }
.dance-macarena .anim-dance-leg-l, .dance-macarena .anim-dance-leg-r { animation: none; }
`,
};

export default style;
