const style = {
  id: 'oletus',
  rootClass: 'dance-oletus',
  walkClass: 'walk-disco',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes defBody { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
@keyframes defArmL { 0%, 100% { transform: rotate(-16deg); } 50% { transform: rotate(-86deg); } }
@keyframes defArmR { 0%, 100% { transform: rotate(70deg); } 50% { transform: rotate(8deg); } }
@keyframes defLeg { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(12deg) translateY(-4px); } }
.dance-oletus .anim-dance-body { transform-origin: 48px 108px; animation: defBody 0.6s ease-in-out infinite; }
.dance-oletus .anim-dance-arm-l { transform-origin: 28px 50px; animation: defArmL 0.6s ease-in-out infinite; }
.dance-oletus .anim-dance-arm-r { transform-origin: 68px 50px; animation: defArmR 0.6s ease-in-out infinite; }
.dance-oletus .anim-dance-leg-l, .dance-oletus .anim-dance-leg-r { animation: defLeg 0.6s ease-in-out infinite; }
`,
};
export default style;
