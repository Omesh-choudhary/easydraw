export function drawEraserCursor(ctx: CanvasRenderingContext2D, cursorWorldX:number, cursorWorldY:number) {
  const eraserRadius = 8; // world units

  ctx.save();
  ctx.beginPath();
  ctx.arc(cursorWorldX, cursorWorldY, eraserRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
