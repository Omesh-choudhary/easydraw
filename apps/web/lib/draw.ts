import { json } from "stream/consumers";
import { Shape, useShapeStore } from "../app/store/shapeStore";
import { useToolStore } from "../app/store/toolStore";

import { cursorStyle } from "./cursorStyle";
import { drawEraserCursor } from "./drawEraserCursor";
import { drawHandle } from "./drawHandle";
import { drawTextLine } from "./drawTextLine";
import { isPointOnShape } from "./PointOnShape";
import { resizeCanvas } from "./resizeCanvas";
import { screenToWorld } from "./ScreenToWorld";
import { v4 as uuidv4 } from "uuid";

let viewOffsetX = 0;
let viewOffsetY = 0;
let viewScale = 1;
let cursorWorldX = 0;
let cursorWorldY = 0;
let clearEraseDot = false;
let dragMode: "none" | "move" | "resize" = "none";
let activeHandle: "nw" | "ne" | "sw" | "se" | null = null;
let dragStartX = 0;
let dragStartY = 0;
let selectedShape = null ;
let handleDimesions:Shape | null = null ;
let isShapeSelected = false
let textShapeId : string 
let caretVisible = true;
let caretTimer: number | null = null;


let toolState = useToolStore.getState();
let shapeState = useShapeStore.getState();

function startCaretBlink(canvas: HTMLCanvasElement) {
  stopCaretBlink();

  caretVisible = true;

  caretTimer = window.setInterval(() => {
    caretVisible = !caretVisible;
    drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
  }, 500);
}

function stopCaretBlink() {
  if (caretTimer !== null) {
    clearInterval(caretTimer);
    caretTimer = null;
  }
  caretVisible = false;
}


export const initDraw = (canvas: HTMLCanvasElement, roomId?:string, ws?:WebSocket) => {
  resizeCanvas(canvas);
  drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);

  let hoveredShape: Shape | null = null;
  canvas.style.cursor = cursorStyle(toolState.activeTool.type);

  useToolStore.subscribe((state) => {
    toolState = state;
  });

  useShapeStore.subscribe((state) => {
    shapeState = state;

    drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
  });

  useToolStore.subscribe(
    (state) => state.activeTool,
    (activeTool) => {
      canvas.style.cursor = cursorStyle(activeTool.type);

      if (activeTool.type === "text") {
      startCaretBlink(canvas);
    } else {
      stopCaretBlink();
    }
    }
  );

  useToolStore.subscribe(
    (state) => state.selectedShapeId,
    (selectedShapeId) => {
      drawContent(canvas, viewOffsetX, viewOffsetY, viewScale)
    }
  );

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  window.addEventListener("resize", () => {
    resizeCanvas(canvas);
    drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
  });

  let startX = 0;
  let startY = 0;

  let isClicked = false;
  canvas.addEventListener("mousedown", (e) => {
    toolState.strokeWidth ? (ctx.lineWidth = toolState.strokeWidth) : null;
    toolState.strokeColour ? (ctx.strokeStyle = toolState.strokeColour) : null;

    if (toolState.bgColour && toolState.bgColour !== "transparent") {
      ctx.fillStyle = toolState.bgColour;
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
    }

    if (toolState.strokeStyle === "dashed") {
      ctx.setLineDash([10, 5]);
    }
    if (toolState.strokeStyle === "dotted") {
      ctx.setLineDash([2, 3]);
    }
    if (toolState.strokeStyle === "solid") {
      ctx.setLineDash([0, 0]);
    }
    isClicked = true;
    const { x, y } = screenToWorld(
      canvas,
      e,
      viewOffsetX,
      viewOffsetY,
      viewScale
    );
    startX = x;
    startY = y;

    if (toolState.activeTool.type === "text" && textShapeId) {
      let textShape = shapeState.shapes.find(s=>s.id === textShapeId)
      if (textShape && textShape.text?.length === 0) {
        shapeState.eraseShape(textShape)
      }
      textShapeId = "" 
      stopCaretBlink()      
    }else {
      startCaretBlink(canvas)
      textShapeId = uuidv4()
      shapeState.addShape({id:textShapeId, type:"text", x:startX, y:startY, opacity:toolState.opacity, text:"", strokeColour:toolState.strokeColour, height:30})
      // toolState.setselectedShapeId(textShapeId)

    }


      if (toolState.activeTool.type !== "text") {
            stopCaretBlink();
          }

    if (toolState.activeTool.type !== "cursor") return;

    dragStartX = x;
    dragStartY = y;

    if (toolState.selectedShapeId && handleDimesions) {

      const handle = getResizeHandleAtPoint(handleDimesions, x, y);

      if (handle) {
      dragMode = "resize";
      activeHandle = handle;
      return;
    }
      
    }
  
    for (let i = shapeState.shapes.length - 1; i >= 0; i--) {
        const shape = shapeState.shapes[i];
        if (!shape) continue;
        if (isPointOnShape(x, y, shape)) {
           toolState.setselectedShapeId(shape.id)
           isShapeSelected =true
          break;
        }else {
              toolState.setselectedShapeId(null)
        drawContent(canvas, viewOffsetX, viewOffsetY, viewScale)
        }
      }

     

    

     selectedShape = shapeState.shapes.find(
      (s) => s.id === toolState.selectedShapeId
    );

    if (!selectedShape) return;

    if (isPointOnShape(x, y, selectedShape)) {
      dragMode = "move";
    }

    drawContent(canvas, viewOffsetX, viewOffsetY, viewScale)
  });

    document.addEventListener("keydown", (e) => {
      if (toolState.activeTool.type !== "text") return;
      if (e.key.length !== 1) return;

      caretVisible = true;

      shapeState.updateText(textShapeId, e.key);

      startX += ctx.measureText(e.key).width;

      drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
    });


  canvas.addEventListener("mouseup", (e) => {
    isClicked = false;

    if (
      toolState.activeTool.type === "cursor" ||
      toolState.activeTool.type === "eraser" ||
      toolState.activeTool.type === "text" 
    )
      return null;

    const { x: endX, y: endY } = screenToWorld(
      canvas,
      e,
      viewOffsetX,
      viewOffsetY,
      viewScale
    );
    let height = endY - startY;
    let width = endX - startX;

    let dimensions: Shape;

    if (toolState.activeTool.type === "rectangle") {
      dimensions = {
        id: uuidv4(),
        type: "rectangle",
        x: startX,
        y: startY,
        height,
        width,
        strokeColour: toolState.strokeColour,
        bgColour: toolState.bgColour,
        strokeStyle: toolState.strokeStyle,
        strokeWidth: toolState.strokeWidth,
        opacity: toolState.opacity,
      };
    } else if (toolState.activeTool.type === "circle") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      const radius = Math.max(height, width) / 2;
      dimensions = {
        id: uuidv4(),
        type: "circle",
        x: centerX,
        y: centerY,
        radius,
        strokeColour: toolState.strokeColour,
        bgColour: toolState.bgColour,
        strokeStyle: toolState.strokeStyle,
        strokeWidth: toolState.strokeWidth,
        opacity: toolState.opacity,
      };
    } else if (toolState.activeTool.type === "diamond") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      dimensions = {
        id: uuidv4(),
        type: "diamond",
        x: centerX,
        y: centerY,
        height: height / 2,
        width: width / 2,
        strokeColour: toolState.strokeColour,
        bgColour: toolState.bgColour,
        strokeStyle: toolState.strokeStyle,
        strokeWidth: toolState.strokeWidth,
        opacity: toolState.opacity,
      };
    } else if (toolState.activeTool.type === "arrow") {
      const angle = Math.atan2(endY - startY, endX - startX);
      dimensions = {
        id: uuidv4(),
        type: "arrow",
        x: startX,
        y: startY,
        toX: endX,
        toY: endY,
        angle,
        strokeColour: toolState.strokeColour,
        strokeWidth: toolState.strokeWidth,
        strokeStyle: toolState.strokeStyle,
        opacity: toolState.opacity,
      };
    } else if (toolState.activeTool.type === "line") {
      dimensions = {
        id: uuidv4(),
        type: "line",
        x: startX,
        y: startY,
        toX: endX,
        toY: endY,
        angle: 0,
        strokeColour: toolState.strokeColour,
        strokeWidth: toolState.strokeWidth,
        strokeStyle: toolState.strokeStyle,
        opacity: toolState.opacity,
      };
    } else {
      throw new Error("Unknown shape  ");
    }

    shapeState.addShape(dimensions);

    if (!toolState.activeTool.locked) {
      toolState.setActiveTool("cursor");
      toolState.setselectedShapeId(dimensions.id);
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isClicked && toolState.activeTool.type !== "eraser") {
      if (dragMode === "move") {
          const { x, y } = screenToWorld(
            canvas,
            e,
            viewOffsetX,
            viewOffsetY,
            viewScale
          );

          const dx = x - dragStartX;
          const dy = y - dragStartY;

          const selectedShape = shapeState.shapes.find(
            s => s.id === toolState.selectedShapeId
          );

          if (!selectedShape) return;

          shapeState.updateShape(selectedShape.id, {
            x: selectedShape.x + dx,
            y: selectedShape.y + dy,
            ...(selectedShape.type === "line" || selectedShape.type === "arrow"
              ? {
                  toX: selectedShape.toX! + dx,
                  toY: selectedShape.toY! + dy,
                }
              : {}),
          });

          dragStartX = x;
          dragStartY = y;

          drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
          return;
        }


     if (dragMode === "resize" && activeHandle) {
          canvas.style.cursor = `${activeHandle}-resize`
          const { x, y } = screenToWorld(
            canvas,
            e,
            viewOffsetX,
            viewOffsetY,
            viewScale
          );

          const dx = x - dragStartX;
          const dy = y - dragStartY;

          const selectedShape = shapeState.shapes.find(
            s => s.id === toolState.selectedShapeId
          );

          if (!selectedShape) return;

          let updates: Partial<Shape> = {};

          switch (activeHandle) {
            case "se":
              updates = {
                width: selectedShape.width! + dx,
                height: selectedShape.height! + dy,
              };
              break;

            case "sw":
              updates = {
                x: selectedShape.x + dx,
                width: selectedShape.width! - dx,
                height: selectedShape.height! + dy,
              };
              break;

            case "ne":
              updates = {
                y: selectedShape.y + dy,
                width: selectedShape.width! + dx,
                height: selectedShape.height! - dy,
              };
              break;

            case "nw":
              updates = {
                x: selectedShape.x + dx,
                y: selectedShape.y + dy,
                width: selectedShape.width! - dx,
                height: selectedShape.height! - dy,
              };
              break;
          }

          
          if (updates.width !== undefined) {
            updates.width = Math.max(10, updates.width);
          }
          if (updates.height !== undefined) {
            updates.height = Math.max(10, updates.height);
          }

          
          if (selectedShape.type === "circle") {
            shapeState.updateShape(selectedShape.id, {...updates, radius:Math.max(updates.height!, updates.width!)});
            
          }else {
            shapeState.updateShape(selectedShape.id, updates);

          }

          dragStartX = x;
          dragStartY = y;

          drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
          return;
        }


      ctx.globalAlpha = toolState.opacity / 100;
      const { x: worldX, y: worldY } = screenToWorld(
        canvas,
        e,
        viewOffsetX,
        viewOffsetY,
        viewScale
      );

      let height = worldY - startY;
      let width = worldX - startX;
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;

      if (toolState.activeTool.type !== "pencil") {
        drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);

        ctx.save();
        ctx.translate(viewOffsetX, viewOffsetY);
        ctx.scale(viewScale, viewScale);
      }

      if (toolState.activeTool.type === "rectangle") {
        ctx.strokeRect(startX, startY, width, height);
        ctx.fillRect(startX, startY, width, height);
      }

      if (toolState.activeTool.type === "circle") {
        const radius = Math.max(height, width) / 2;

        if (radius > 0) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
        }
      }

      if (toolState.activeTool.type === "diamond") {
        const hw = width / 2;
        const hh = height / 2;

        ctx.beginPath();

        ctx.moveTo(centerX, centerY - hh);
        ctx.lineTo(centerX + hw, centerY);
        ctx.lineTo(centerX, centerY + hh);
        ctx.lineTo(centerX - hw, centerY);

        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }

      if (toolState.activeTool.type === "arrow") {
        const angle = Math.atan2(worldY - startY, worldX - startX);

        ctx.save(); 

       
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(worldX, worldY);
        ctx.stroke();

      
        ctx.beginPath();
        ctx.moveTo(worldX, worldY);
        ctx.lineTo(
          worldX - 15 * Math.cos(angle - Math.PI / 6),
          worldY - 15 * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(worldX, worldY);
        ctx.lineTo(
          worldX - 15 * Math.cos(angle + Math.PI / 6),
          worldY - 15 * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();

        ctx.restore();
      }

      if (toolState.activeTool.type === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(worldX, worldY);
        ctx.stroke();
      }

      if (toolState.activeTool.type === "pencil") {
        const { x, y } = screenToWorld(
          canvas,
          e,
          viewOffsetX,
          viewOffsetY,
          viewScale
        );
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        startX = x;
        startY = y;
      }

      ctx.restore();
    }
    if ( toolState.activeTool.type === "cursor") {
      const { x: worldX, y: worldY } = screenToWorld(
        canvas,
        e,
        viewOffsetX,
        viewOffsetY,
        viewScale
      );

      if (ws) {

        setTimeout(() => {
          ws?.send(
            JSON.stringify({
              type:"mouse-move",
              roomId:roomId,
              data:{worldX, worldY},
              userName:"omesh"
            })
          )
        }, 1500);
      }
      

      hoveredShape = null;
    
      for (let i = shapeState.shapes.length - 1; i >= 0; i--) {
        const shape = shapeState.shapes[i];
        if (!shape) continue;
        if (isPointOnShape(worldX, worldY, shape)) {
          hoveredShape = shape;

          break;
        }
      }

      canvas.style.cursor = hoveredShape ? "all-scroll" : "default";

      if (toolState.selectedShapeId) {
         let shape = shapeState.shapes.find(s=>s.id === toolState.selectedShapeId)
         if (handleDimesions) {
          let handle = getResizeHandleAtPoint(handleDimesions, worldX, worldY)
          canvas.style.cursor = `${handle}-resize`
         }
      }
    }

    if (toolState.activeTool.type === "eraser") {
      const { x, y } = screenToWorld(
        canvas,
        e,
        viewOffsetX,
        viewOffsetY,
        viewScale
      );
      clearEraseDot = false;
      canvas.style.cursor = "none";

      cursorWorldX = x;
      cursorWorldY = y;

      if (isClicked) {
        hoveredShape = null;
        
        for (let i = shapeState.shapes.length - 1; i >= 0; i--) {
          const shape = shapeState.shapes[i];
          if (!shape) continue;
          if (isPointOnShape(x, y, shape)) {
            hoveredShape = shape;

            break;
          }
        }

        if (hoveredShape) {
          shapeState.eraseShape(hoveredShape);
        }
      }

      drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
    }
  });

  canvas.addEventListener("mouseleave", () => {
    clearEraseDot = true;
    drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
  });

  canvas.addEventListener(
    "wheel",
    (e: WheelEvent) => {
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY < 0 ? 1.01 : 0.99;
        applyPinchZoom(canvas, zoomFactor, mouseX, mouseY);
        return;
      }

      
      const panSpeed = 1;

      // Trackpad horizontal scroll
      viewOffsetX -= e.deltaX * panSpeed;
      viewOffsetY -= e.deltaY * panSpeed;

      drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
    },
    { passive: false }
  );
};

export const drawContent = (
  canvas: HTMLCanvasElement,
  viewOffsetX: number = 0,
  viewOffsetY: number = 0,
  viewScale: number = 1
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(viewOffsetX, viewOffsetY);
  ctx.scale(viewScale, viewScale);

  ctx.strokeStyle = "white";

  if (toolState.activeTool.type === "eraser" && !clearEraseDot) {
    drawEraserCursor(ctx, cursorWorldX, cursorWorldY);
  }

  for (const shape of shapeState.shapes) {
    ctx.save();

    shape.strokeWidth ? (ctx.lineWidth = shape.strokeWidth) : null;
    ctx.globalAlpha = shape.opacity / 100;
    if (shape.strokeStyle === "dashed") {
      ctx.setLineDash([10, 5]);
    }
    if (shape.strokeStyle === "dotted") {
      ctx.setLineDash([2, 3]);
    }
    if (shape.strokeStyle === "solid") {
      ctx.setLineDash([0, 0]);
    }
    if (shape.bgColour && shape.bgColour !== "transparent") {
      ctx.fillStyle = shape.bgColour;
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
    }

    if (shape.type === "rectangle") {
      ctx.strokeStyle = shape.strokeColour || "white";
      ctx.strokeRect(shape.x, shape.y, shape.width!, shape.height!);
      ctx.fillRect(shape.x, shape.y, shape.width!, shape.height!);
    }

    if (shape.type === "circle") {
      ctx.strokeStyle = shape.strokeColour || "white";
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius!, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    if (shape.type === "diamond") {
      ctx.strokeStyle = shape.strokeColour || "white";

      ctx.beginPath();

      ctx.moveTo(shape.x, shape.y - shape.height!);

      ctx.lineTo(shape.x + shape.width!, shape.y);
      ctx.lineTo(shape.x, shape.y + shape.height!);
      ctx.lineTo(shape.x - shape.width!, shape.y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

    if (shape.type === "arrow") {
      ctx.strokeStyle = shape.strokeColour || "white";

      ctx.save(); // Save the current canvas state

      // Draw the main line
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.toX!, shape.toY!);
      ctx.stroke();

      // Draw the arrowhead
      ctx.beginPath();
      ctx.moveTo(shape.toX!, shape.toY!);
      ctx.lineTo(
        shape.toX! - 15 * Math.cos(shape.angle! - Math.PI / 6),
        shape.toY! - 15 * Math.sin(shape.angle! - Math.PI / 6)
      );
      ctx.moveTo(shape.toX!, shape.toY!);
      ctx.lineTo(
        shape.toX! - 15 * Math.cos(shape.angle! + Math.PI / 6),
        shape.toY! - 15 * Math.sin(shape.angle! + Math.PI / 6)
      );
      ctx.stroke();

      ctx.restore();
    }

    if (shape.type === "line") {
     
      ctx.strokeStyle = shape.strokeColour || "white";
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.toX!, shape.toY!);
      ctx.stroke();
    }

    if (shape.type === "text") {
      ctx.font = `${shape.height}px ExcaliFont`;
      ctx.fillStyle = shape.strokeColour!
      ctx.fillText(shape.text!, shape.x, shape.y);

      if (
        toolState.activeTool.type === "text" &&
        textShapeId === shape.id && caretVisible
      ) {
        const width = ctx.measureText(shape.text ?? "").width;
        drawTextLine(ctx, shape.x + width + 2, shape.y);
      }
    }

    ctx.restore();
  }

  if (toolState.selectedShapeId !== null) {
    let shape = shapeState.shapes.find(s=>s.id === toolState.selectedShapeId)
    if (shape) {     
     let value = drawHandle(shape, ctx);
     if (value) {
      handleDimesions = value
     }
    }
  }

  ctx.restore();
};

function applyPinchZoom(
  canvas: HTMLCanvasElement,
  zoomDelta: number,
  screenX: number,
  screenY: number
) {
  // Convert screen → world
  const worldX = (screenX - viewOffsetX) / viewScale;
  const worldY = (screenY - viewOffsetY) / viewScale;

  // Apply zoom
  viewScale *= zoomDelta;
  viewScale = Math.max(0.1, Math.min(5, viewScale));

  // Keep pinch center fixed
  viewOffsetX = screenX - worldX * viewScale;
  viewOffsetY = screenY - worldY * viewScale;

  drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
}

function getResizeHandleAtPoint(shape: Shape, x: number, y: number) {
  const size = 8;

  const handles = [
    { type: "nw", x: shape.x, y: shape.y },
    { type: "ne", x: shape.x + shape.width!, y: shape.y },
    { type: "sw", x: shape.x, y: shape.y + shape.height! },
    { type: "se", x: shape.x + shape.width!, y: shape.y + shape.height! },
  ];

  for (const h of handles) {
    if (Math.abs(x - h.x) < size && Math.abs(y - h.y) < size) {
      return h.type as "nw" | "ne" | "sw" | "se";
    }
  }

  return null;
}
