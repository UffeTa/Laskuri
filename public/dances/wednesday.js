const style = {
  id: 'wednesday',
  rootClass: 'dance-wednesday',
  walkClass: '',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes wedBody {
  0%, 20% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-6px) rotate(-8deg); }
  60% { transform: rotate(10deg) scaleX(0.96); }
  80% { transform: translateX(8px) rotate(-6deg); }
  100% { transform: translateY(0) rotate(0deg); }
}
@keyframes wedArmL {
  0%, 20% { transform: rotate(-88deg); }
  40% { transform: rotate(-20deg); }
  60% { transform: rotate(-70deg); }
  80% { transform: rotate(8deg); }
  100% { transform: rotate(-88deg); }
}
@keyframes wedArmR {
  0%, 20% { transform: rotate(88deg); }
  40% { transform: rotate(16deg); }
  60% { transform: rotate(74deg); }
  80% { transform: rotate(-12deg); }
  100% { transform: rotate(88deg); }
}
.dance-wednesday .anim-dance-body { transform-origin: 48px 96px; animation: wedBody 1.2s steps(5, end) infinite; }
.dance-wednesday .anim-dance-arm-l { transform-origin: 26px 48px; animation: wedArmL 1.2s steps(5, end) infinite; }
.dance-wednesday .anim-dance-arm-r { transform-origin: 70px 48px; animation: wedArmR 1.2s steps(5, end) infinite; }
.dance-wednesday .anim-dance-leg-l, .dance-wednesday .anim-dance-leg-r { animation: none; }
`,
};
export default style;
