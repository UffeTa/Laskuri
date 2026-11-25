const style = {
  id: 'thriller',
  rootClass: 'dance-thriller',
  walkClass: '',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes zombieBody { 0%, 100% { transform: translateX(-4px) rotate(-8deg); } 50% { transform: translateX(6px) rotate(6deg); } }
@keyframes zombieArmL { 0%, 100% { transform: rotate(-78deg); } 50% { transform: rotate(-58deg); } }
@keyframes zombieArmR { 0%, 100% { transform: rotate(78deg); } 50% { transform: rotate(58deg); } }
@keyframes zombieLeg { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(14deg); } }
.dance-thriller .anim-dance-body { transform-origin: 48px 96px; animation: zombieBody 0.7s steps(2, end) infinite; }
.dance-thriller .anim-dance-arm-l { transform-origin: 26px 48px; animation: zombieArmL 0.35s steps(2, end) infinite; }
.dance-thriller .anim-dance-arm-r { transform-origin: 70px 48px; animation: zombieArmR 0.35s steps(2, end) infinite; }
.dance-thriller .anim-dance-leg-l { transform-origin: 40px 92px; animation: zombieLeg 0.7s steps(2, end) infinite; }
.dance-thriller .anim-dance-leg-r { transform-origin: 56px 92px; animation: zombieLeg 0.7s steps(2, end) infinite reverse; }
`,
};
export default style;
