import { AnimationType, ShapeType } from "./types";

export const ANIMATION_OPTIONS: { label: string; value: AnimationType }[] = [
  { label: 'None', value: 'none' },
  { label: 'Rotate (360°)', value: 'rotate' },
  { label: 'Pulse (Scale)', value: 'pulse' },
  { label: 'Bounce (Up/Down)', value: 'bounce' },
  { label: 'Slide Horizontal', value: 'slide-x' },
  { label: 'Slide Vertical', value: 'slide-y' },
  { label: 'Fade In/Out', value: 'fade' },
];

export const SHAPE_OPTIONS: { label: string; value: ShapeType }[] = [
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Circle', value: 'circle' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Polygon (Hexagon)', value: 'polygon' },
  { label: 'Line', value: 'line' },
  { label: 'Path (Custom)', value: 'path' },
];

export const CSS_ANIMATIONS = `
@keyframes rotate {
  from { transform-box: fill-box; transform-origin: center; transform: rotate(0deg); }
  to { transform-box: fill-box; transform-origin: center; transform: rotate(360deg); }
}
@keyframes pulse {
  0% { transform-box: fill-box; transform-origin: center; transform: scale(1); }
  50% { transform-box: fill-box; transform-origin: center; transform: scale(1.1); }
  100% { transform-box: fill-box; transform-origin: center; transform: scale(1); }
}
@keyframes bounce {
  0%, 100% { transform-box: fill-box; transform: translateY(0); }
  50% { transform-box: fill-box; transform: translateY(-20px); }
}
@keyframes slide-x {
  0% { transform-box: fill-box; transform: translateX(0); }
  50% { transform-box: fill-box; transform: translateX(20px); }
  100% { transform-box: fill-box; transform: translateX(0); }
}
@keyframes slide-y {
  0% { transform-box: fill-box; transform: translateY(0); }
  50% { transform-box: fill-box; transform: translateY(20px); }
  100% { transform-box: fill-box; transform: translateY(0); }
}
@keyframes fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.anim-rotate { animation: rotate linear infinite; }
.anim-pulse { animation: pulse ease-in-out infinite; }
.anim-bounce { animation: bounce ease-in-out infinite; }
.anim-slide-x { animation: slide-x ease-in-out infinite; }
.anim-slide-y { animation: slide-y ease-in-out infinite; }
.anim-fade { animation: fade ease-in-out infinite; }
`;
