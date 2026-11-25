const style = {
  id: 'gangnam',
  rootClass: 'dance-gangnam',
  walkClass: 'walk-hop',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes horseBody {
  0%, 100% { transform: translateY(0) rotate(-4deg) scaleY(0.92); }
  50% { transform: translateY(-14px) rotate(4deg) scaleY(1.06); }
}
@keyframes horseArmL { 0% { transform: rotate(-20deg); } 100% { transform: rotate(-80deg); } }
@keyframes horseArmR { 0%, 100% { transform: rotate(30deg); } 50% { transform: rotate(70deg); } }
@keyframes horseLeg { 0%, 100% { transform: rotate(18deg); } 50% { transform: rotate(-8deg) translateY(-3px); } }
.dance-gangnam .anim-dance-body { transform-origin: 48px 108px; animation: horseBody 0.38s ease-in-out infinite; }
.dance-gangnam .anim-dance-arm-l { transform-origin: 26px 48px; animation: horseArmL 0.5s linear infinite alternate; }
.dance-gangnam .anim-dance-arm-r { transform-origin: 70px 48px; animation: horseArmR 0.38s ease-in-out infinite; }
.dance-gangnam .anim-dance-leg-l, .dance-gangnam .anim-dance-leg-r { animation: horseLeg 0.38s ease-in-out infinite; }
`,
};
export default style;
