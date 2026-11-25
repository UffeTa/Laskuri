const style = {
  id: 'runningman',
  rootClass: 'dance-runningman',
  walkClass: 'walk-brisk',
  svgUrl: '/assets/character-dance-groove.svg',
  css: `
@keyframes runBody { 0% { transform: translateX(8px) rotate(8deg); } 100% { transform: translateX(-10px) rotate(6deg); } }
@keyframes runArm { 0%, 100% { transform: rotate(-40deg); } 50% { transform: rotate(35deg); } }
@keyframes runLegL { 0%, 100% { transform: rotate(-24deg) translateY(0); } 50% { transform: rotate(20deg) translateY(-8px); } }
@keyframes runLegR { 0%, 100% { transform: rotate(20deg) translateY(-8px); } 50% { transform: rotate(-24deg) translateY(0); } }
.dance-runningman .anim-dance-body { transform-origin: 48px 100px; animation: runBody 0.36s linear infinite alternate; }
.dance-runningman .anim-dance-arm-l { transform-origin: 28px 52px; animation: runArm 0.36s linear infinite; }
.dance-runningman .anim-dance-arm-r { transform-origin: 68px 52px; animation: runArm 0.36s linear infinite reverse; }
.dance-runningman .anim-dance-leg-l { transform-origin: 40px 90px; animation: runLegL 0.36s linear infinite; }
.dance-runningman .anim-dance-leg-r { transform-origin: 56px 90px; animation: runLegR 0.36s linear infinite; }
`,
};
export default style;
