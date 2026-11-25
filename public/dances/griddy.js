const style = {
  id: 'griddy',
  rootClass: 'dance-griddy',
  walkClass: '',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes gridBody { 0%, 100% { transform: translateX(-12px); } 50% { transform: translateX(12px) translateY(-3px); } }
@keyframes gridArm { 0%, 100% { transform: rotate(12deg); } 50% { transform: rotate(-18deg); } }
@keyframes gridLegL { 0%, 100% { transform: rotate(16deg); } 50% { transform: rotate(-4deg); } }
@keyframes gridLegR { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(-18deg); } }
.dance-griddy .anim-dance-body { transform-origin: 48px 104px; animation: gridBody 0.32s steps(2, end) infinite; }
.dance-griddy .anim-dance-arm-l, .dance-griddy .anim-dance-arm-r { animation: gridArm 0.32s steps(2, end) infinite; }
.dance-griddy .anim-dance-leg-l { transform-origin: 40px 92px; animation: gridLegL 0.32s steps(2, end) infinite; }
.dance-griddy .anim-dance-leg-r { transform-origin: 56px 92px; animation: gridLegR 0.32s steps(2, end) infinite; }
`,
};
export default style;
