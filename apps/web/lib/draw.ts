import { useToolStore } from "../app/store/toolStore"
import { easyDrawState } from "../componentss/TopBar"
import { cursorStyle } from "./cursorStyle"
import { isPointOnShape } from "./PointOnShape"
import { resizeCanvas } from "./resizeCanvas"
import { screenToWorld } from "./ScreenToWorld"

export type Shape = {
    type:"rectangle" | "diamond" | "circle" | "arrow" | "line"
    x:number  
    y:number
    toX?:number
    toY?:number
    angle?:number
    height?:number
    width?:number
    radius?:number
    opacity:number
    strokeColour?:string | null
    strokeWidth?:number | null
    strokeStyle?:string | null
    bgColour?:string | null
} 

let existingShapes:Shape[] = []

let viewOffsetX = 0;
let viewOffsetY = 0;
let viewScale = 1;



export const initDraw =(canvas:HTMLCanvasElement)=>{

   resizeCanvas(canvas);

  let toolState = useToolStore.getState();
  
  let hoveredShape: Shape | null = null;
  canvas.style.cursor = cursorStyle(toolState.activeTool.type)

      useToolStore.subscribe((state) => {
      toolState = state;
      });

      const unsubscribeActiveTool = useToolStore.subscribe(
        (state) => state.activeTool,
        (activeTool) => {
          canvas.style.cursor = cursorStyle(activeTool.type)
        }
      );



      const ctx = canvas.getContext("2d")

      if (!ctx) {
        return
      }

       window.addEventListener("resize", () => {
          resizeCanvas(canvas);
          drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
        });

       let startX = 0;
       let startY = 0;

       let isClicked = false
      canvas.addEventListener("mousedown", (e)=>{
          
            toolState.strokeWidth?ctx.lineWidth=toolState.strokeWidth:null
                toolState.strokeColour?ctx.strokeStyle=toolState.strokeColour:null
                


                if (toolState.bgColour && toolState.bgColour !=="transparent") {   
                  ctx.fillStyle=toolState.bgColour
                }else{
                  ctx.fillStyle = "rgba(0, 0, 0, 0)"
                }

                if (toolState.strokeStyle === "dashed") {
                  ctx.setLineDash([10,5])
                }
                if (toolState.strokeStyle === "dotted") {
                  ctx.setLineDash([2,3])
                }
                if(toolState.strokeStyle === "solid"){
                  ctx.setLineDash([0,0])
                }
                isClicked = true
                const { x, y } = screenToWorld(canvas, e, viewOffsetX, viewOffsetY, viewScale);
                startX = x;
                startY = y;
             })

      canvas.addEventListener("mouseup", (e)=>{
            isClicked = false
            if(toolState.activeTool.type === "cursor") return null

            const { x: endX, y: endY } = screenToWorld(canvas, e, viewOffsetX, viewOffsetY, viewScale);
            let height =endY-startY;
            let width = endX-startX
            
            let dimensions:Shape
            if (toolState.activeTool.type==="rectangle") {
                dimensions ={type:"rectangle",x:startX, y:startY, height, width, strokeColour:toolState.strokeColour, bgColour:toolState.bgColour, strokeStyle:toolState.strokeStyle, strokeWidth:toolState.strokeWidth, opacity:toolState.opacity }
            }
            else if (toolState.activeTool.type==="circle"){
            const centerX = startX + width/2
            const centerY = startY + height/2
            const radius = Math.max(height, width)/2
                 dimensions ={type:"circle",x:centerX, y:centerY, radius, strokeColour:toolState.strokeColour, bgColour:toolState.bgColour,strokeStyle:toolState.strokeStyle, strokeWidth:toolState.strokeWidth, opacity:toolState.opacity}
            }
           else if (toolState.activeTool.type==="diamond") {
            const centerX = startX + width/2
            const centerY = startY + height/2
            dimensions ={type:"diamond",x:centerX, y:centerY, height:height/2, width:width/2, strokeColour:toolState.strokeColour, bgColour:toolState.bgColour, strokeStyle:toolState.strokeStyle, strokeWidth:toolState.strokeWidth, opacity:toolState.opacity}
            }
           else if (toolState.activeTool.type==="arrow") {
                 const angle = Math.atan2(endY - startY, endX - startX);
                dimensions ={type:"arrow",x:startX, y:startY, toX:endX, toY:endY, angle, strokeColour:toolState.strokeColour, strokeWidth:toolState.strokeWidth, strokeStyle:toolState.strokeStyle, opacity:toolState.opacity}
            }
            else if (toolState.activeTool.type==="line") {
                dimensions ={type:"line",x:startX, y:startY, toX:endX, toY:endY, angle:0, strokeColour:toolState.strokeColour, strokeWidth:toolState.strokeWidth, strokeStyle:toolState.strokeStyle, opacity:toolState.opacity}
            }
            else {
            throw new Error("Unknown shape  ");
            }

            existingShapes.push(dimensions)
            if (!toolState.activeTool.locked) {
              toolState.setActiveTool("cursor")
            }
        })
        
        canvas.addEventListener("mousemove", (e)=>{
            
          if (isClicked) {
            ctx.globalAlpha = toolState.opacity/100
            const { x: worldX, y: worldY } = screenToWorld(canvas, e, viewOffsetX, viewOffsetY, viewScale);
                
                let height = worldY-startY;
                let width = worldX-startX
                const centerX = startX + width/2
                const centerY = startY + height/2
               
                
                if (toolState.activeTool.type !== "pencil") {
                    drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);

                    ctx.save();
                    ctx.translate(viewOffsetX, viewOffsetY);
                    ctx.scale(viewScale, viewScale);
                  }

                if (toolState.activeTool.type==="rectangle") {
                    
                    ctx.strokeRect(startX, startY, width, height)
                    ctx.fillRect(startX, startY, width, height)
                }

                if (toolState.activeTool.type==="circle") {
                    
                    const radius = Math.max(height, width)/2
                   
                    if (radius>0) {
                      ctx.beginPath()
                      ctx.arc(centerX, centerY, radius, 0, Math.PI*2)
                      ctx.fill()
                      ctx.stroke()
                      ctx.closePath()
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
                    ctx.fill()
                  
                }

                if (toolState.activeTool.type === "arrow") {
                   
                  const angle = Math.atan2(worldY - startY, worldX - startX);
                  
                  ctx.save(); // Save the current canvas state

                  // Draw the main line
                  ctx.beginPath();
                  ctx.moveTo(startX, startY);
                  ctx.lineTo(worldX, worldY);
                  ctx.stroke();

                  // Draw the arrowhead
                  ctx.beginPath();
                  ctx.moveTo(worldX, worldY);
                  ctx.lineTo(worldX - 15 * Math.cos(angle - Math.PI / 6), worldY - 15 * Math.sin(angle - Math.PI / 6));
                  ctx.moveTo(worldX, worldY);
                  ctx.lineTo(worldX - 15 * Math.cos(angle + Math.PI / 6), worldY - 15 * Math.sin(angle + Math.PI / 6));
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

                  const { x, y } = screenToWorld(canvas, e, viewOffsetX, viewOffsetY, viewScale)
                  ctx.lineJoin = 'round'; 
                  ctx.lineCap = 'round';

                  ctx.beginPath();
                  ctx.moveTo(startX, startY);
                  ctx.lineTo(x, y)
                  ctx.stroke();
                  startX = x
                  startY = y


                  
                 
                }

                ctx.restore();
        } if (!isClicked && toolState.activeTool.type === "cursor") {

          const { x: worldX, y: worldY } = screenToWorld(canvas, e, viewOffsetX, viewOffsetY, viewScale);
          
                    hoveredShape = null;
                    // Check topmost shape first (last drawn)
                    for (let i = existingShapes.length - 1; i >= 0; i--) {
                       const shape = existingShapes[i];
                       if (!shape) continue;
              if (isPointOnShape(worldX, worldY, shape)) {
                      hoveredShape = shape;
                
                       break;
              }
            }

            canvas.style.cursor = hoveredShape ? "all-scroll" : "default";
        }
      })


     
                        canvas.addEventListener(
                        "wheel",
                        (e: WheelEvent) => {
                          e.preventDefault();

                          const rect = canvas.getBoundingClientRect();
                          const mouseX = e.clientX - rect.left;
                          const mouseY = e.clientY - rect.top;

                          // 🔍 ZOOM (Ctrl / Cmd + wheel)
                          if (e.ctrlKey || e.metaKey) {
                            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                            applyPinchZoom(canvas, zoomFactor, mouseX, mouseY);
                            return;
                          }

                          // 🧭 PAN (default wheel)
                          const panSpeed = 1;

                          // Trackpad horizontal scroll
                          viewOffsetX -= e.deltaX * panSpeed;
                          viewOffsetY -= e.deltaY * panSpeed;
                          

                          drawContent(canvas, viewOffsetX, viewOffsetY, viewScale);
                        },
                        { passive: false }
                      );





              



    }



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



  for (const shape of existingShapes) {

    ctx.save()

    shape.strokeWidth?ctx.lineWidth=shape.strokeWidth:null
    ctx.globalAlpha =shape.opacity/100
     if (shape.strokeStyle === "dashed") {
                  ctx.setLineDash([10,5])
                }
                if (shape.strokeStyle === "dotted") {
                  ctx.setLineDash([2,3])
                }
                if(shape.strokeStyle === "solid"){
                  ctx.setLineDash([0,0])
                }
    if (shape.bgColour && shape.bgColour !== "transparent") {
      ctx.fillStyle = shape.bgColour
    }else{
      ctx.fillStyle = "rgba(0, 0, 0, 0)"
    }

    if (shape.type === "rectangle") {
      ctx.strokeStyle = shape.strokeColour || "white"
      ctx.strokeRect(shape.x, shape.y, shape.width!, shape.height!);
      ctx.fillRect(shape.x, shape.y, shape.width!, shape.height!);
    }

    if (shape.type === "circle") {
      ctx.strokeStyle = shape.strokeColour || "white"
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius!, 0, Math.PI * 2);
      ctx.fill()
      ctx.stroke();
    }

    if (shape.type === "diamond") {
                   ctx.strokeStyle = shape.strokeColour || "white"

                   ctx.beginPath();

                    ctx.moveTo(shape.x, shape.y - shape.height!);

                    ctx.lineTo(shape.x + shape.width!, shape.y); 
                    ctx.lineTo(shape.x, shape.y + shape.height!); 
                    ctx.lineTo(shape.x - shape.width!, shape.y); 
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill()
                  
                }

    if (shape.type === "arrow") {
      ctx.strokeStyle = shape.strokeColour || "white"

      ctx.save(); // Save the current canvas state

                  // Draw the main line
                  ctx.beginPath();
                  ctx.moveTo(shape.x, shape.y);
                  ctx.lineTo(shape.toX!, shape.toY!);
                  ctx.stroke();

                  // Draw the arrowhead
                  ctx.beginPath();
                  ctx.moveTo(shape.toX!, shape.toY!);
                  ctx.lineTo(shape.toX! - 15 * Math.cos(shape.angle! - Math.PI / 6), shape.toY! - 15 * Math.sin(shape.angle! - Math.PI / 6));
                  ctx.moveTo(shape.toX!, shape.toY!);
                  ctx.lineTo(shape.toX! - 15 * Math.cos(shape.angle! + Math.PI / 6), shape.toY! - 15 * Math.sin(shape.angle! + Math.PI / 6));
                  ctx.stroke();

                  ctx.restore();
      
    }     
    
    if (shape.type === "line") {
      ctx.strokeStyle = shape.strokeColour || "white"
      ctx.beginPath();
                  ctx.moveTo(shape.x, shape.y);
                  ctx.lineTo(shape.toX!, shape.toY!);
                  ctx.stroke();
    }

    ctx.restore()
  }

  ctx.restore()

  
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
