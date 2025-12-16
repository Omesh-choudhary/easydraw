export function screenToWorld(canvas: HTMLCanvasElement, e: MouseEvent, viewOffsetX:number, viewOffsetY:number, viewScale:number) {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;

  const worldX = (screenX - viewOffsetX) / viewScale;
  const worldY = (screenY - viewOffsetY) / viewScale;

  return { x: worldX, y: worldY };
}
