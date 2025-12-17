import { Shape } from "../app/store/shapeStore";


export function isPointOnShape(
  x: number,
  y: number,
  shape: Shape,
  tolerance = 5
): boolean {
  switch (shape.type) {
    case "rectangle":
      return (
        x >= shape.x &&
        x <= shape.x + shape.width! &&
        y >= shape.y &&
        y <= shape.y + shape.height!
      );

    case "circle": {
      const dx = x - shape.x;
      const dy = y - shape.y;
      return dx * dx + dy * dy <= shape.radius! * shape.radius!;
    }

    case "diamond": {
      const dx = Math.abs(x - shape.x);
      const dy = Math.abs(y - shape.y);
      return (
        dx / shape.width! + dy / shape.height! <= 1
      );
    }

    case "line":
    case "arrow":
      return distancePointToLine(
        x,
        y,
        shape.x,
        shape.y,
        shape.toX!,
        shape.toY!
      ) <= tolerance;

    default:
      return false;
  }
}




function distancePointToLine(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const param = lenSq !== 0 ? dot / lenSq : -1;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(dx * dx + dy * dy);
}
