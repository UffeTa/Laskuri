const style = {
  id: 'dab',
  rootClass: 'dance-dab',
  walkClass: '',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes dabBody {
  0%, 15% { transform: translate(0, 0) rotate(0deg); }
  30%, 70% { transform: translate(6px, 8px) rotate(22deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes dabArmL {
  0%, 15% { transform: rotate(-20deg); }
  30%, 70% { transform: rotate(78deg); }
  100% { transform: rotate(-20deg); }
}
@keyframes dabArmR {
  0%, 15% { transform: rotate(16deg); }
  30%, 70% { transform: rotate(-72deg); }
  100% { transform: rotate(16deg); }
}
.dance-dab .anim-dance-body { transform-origin: 40px 90px; animation: dabBody 1.1s ease-in-out infinite; }
.dance-dab .anim-dance-arm-l { transform-origin: 30px 50px; animation: dabArmL 1.1s ease-in-out infinite; }
.dance-dab .anim-dance-arm-r { transform-origin: 66px 50px; animation: dabArmR 1.1s ease-in-out infinite; }
.dance-dab .anim-dance-leg-l, .dance-dab .anim-dance-leg-r { animation: none; }
`,
};
export default style;
