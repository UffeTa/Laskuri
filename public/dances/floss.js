const style = {
  id: 'floss',
  rootClass: 'dance-floss',
  walkClass: 'walk-brisk',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes flossBody { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
@keyframes flossArmL { 0%, 100% { transform: rotate(-75deg) translate(0, 10px); } 50% { transform: rotate(55deg) translate(0, 6px); } }
@keyframes flossArmR { 0%, 100% { transform: rotate(75deg) translate(0, 6px); } 50% { transform: rotate(-55deg) translate(0, 10px); } }
.dance-floss .anim-dance-body { transform-origin: 48px 100px; animation: flossBody 0.42s linear infinite; }
.dance-floss .anim-dance-arm-l { transform-origin: 28px 52px; animation: flossArmL 0.42s linear infinite; }
.dance-floss .anim-dance-arm-r { transform-origin: 68px 52px; animation: flossArmR 0.42s linear infinite; }
.dance-floss .anim-dance-leg-l, .dance-floss .anim-dance-leg-r { animation: none; }
`,
};
export default style;
