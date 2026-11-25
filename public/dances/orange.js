const style = {
  id: 'orange',
  rootClass: 'dance-orange',
  walkClass: 'walk-disco',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes ojBody { 0%, 100% { transform: translateX(-10px) rotate(-14deg); } 50% { transform: translateX(12px) rotate(16deg); } }
@keyframes ojArmL { 0%, 100% { transform: rotate(-100deg); } 50% { transform: rotate(20deg); } }
@keyframes ojArmR { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(100deg); } }
.dance-orange .anim-dance-body { transform-origin: 48px 100px; animation: ojBody 0.46s ease-in-out infinite; }
.dance-orange .anim-dance-arm-l { transform-origin: 24px 52px; animation: ojArmL 0.46s ease-in-out infinite; }
.dance-orange .anim-dance-arm-r { transform-origin: 72px 52px; animation: ojArmR 0.46s ease-in-out infinite; }
.dance-orange .anim-dance-leg-l, .dance-orange .anim-dance-leg-r { animation: none; }
`,
};
export default style;
