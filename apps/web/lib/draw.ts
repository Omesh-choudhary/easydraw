import { easyDrawState } from "../componentss/TopBar"

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
    strokeColour?:string | null
    bgColour?:string | null
} 

let existingShapes:Shape[] = []

export const initDraw =(canvas:HTMLCanvasElement)=>{

  let shape:easyDrawState["activeTool"] | null ;
  let strokeColour:easyDrawState["strokeColour"] | null ;
  let bgColour:easyDrawState["bgColour"] | null ;

      const ctx = canvas.getContext("2d")

      if (!ctx) {
        return
      }

       let startX = 0;
       let startY = 0;

       let isClicked = false
      canvas.addEventListener("mousedown", (e)=>{
          const raw = localStorage.getItem("easyDrawState");

            if (raw) {
              try {
                const state = JSON.parse(raw) as easyDrawState;
                shape = state.activeTool; 
                strokeColour = state.strokeColour;
                bgColour = state.bgColour
                 if (strokeColour) {
                  ctx.strokeStyle = strokeColour  
                }

                if (bgColour) {
                  ctx.fillStyle = bgColour
                }
              } catch (err) {
                console.error("Invalid easyDrawState in localStorage:", err);
                shape = null;
              }
            } else {
              shape = null;
            }
           isClicked = true
           startX = e.clientX;
           startY = e.clientY;
      })

      canvas.addEventListener("mouseup", (e)=>{
            isClicked = false
            let height = e.clientY-startY;
            let width = e.clientX-startX
            
            let dimensions:Shape
            if (shape==="rectangle") {
                dimensions ={type:"rectangle",x:startX, y:startY, height, width, strokeColour, bgColour}
            }
            else if (shape==="circle"){
            const centerX = startX + width/2
            const centerY = startY + height/2
            const radius = Math.max(height, width)/2
                 dimensions ={type:"circle",x:centerX, y:centerY, radius, strokeColour, bgColour}
            }
           else if (shape==="diamond") {
            const centerX = startX + width/2
            const centerY = startY + height/2
            dimensions ={type:"diamond",x:centerX, y:centerY, height, width, strokeColour, bgColour}
            }
           else if (shape==="arrow") {
                 const angle = Math.atan2(e.clientY - startY, e.clientX - startX);
                dimensions ={type:"arrow",x:startX, y:startY, toX:e.clientX, toY:e.clientY, angle, strokeColour}
            }
            else if (shape==="line") {
                dimensions ={type:"line",x:startX, y:startY, toX:e.clientX, toY:e.clientY, angle:0, strokeColour}
            }
            else {
            throw new Error("Unknown shape type: " + shape);
            }

            existingShapes.push(dimensions)
        })
        
        canvas.addEventListener("mousemove", (e)=>{
            
            if (isClicked) {
                
                let height = e.clientY-startY;
                let width = e.clientX-startX
                const centerX = startX + width/2
                const centerY = startY + height/2
                ctx.strokeStyle = "rgba(255, 255, 255)"
               
                
                if (shape !== "pencil") {
                    drawContent(canvas);
                  }

                if (shape==="rectangle") {
                    
                    ctx.fillRect(startX, startY, width, height)
                }

                if (shape==="circle") {
                    
                    const radius = Math.max(height, width)/2
                   
                    if (radius>0) {
                      ctx.beginPath()
                      ctx.arc(centerX, centerY, radius, 0, Math.PI*2)
                      ctx.fill()
                      ctx.stroke()
                      ctx.closePath()
                    }
                }

                if (shape === "diamond") {

                   ctx.beginPath();

                    ctx.moveTo(centerX, centerY - height);

                    ctx.lineTo(centerX + width, centerY); 
                    ctx.lineTo(centerX, centerY + height); 
                    ctx.lineTo(centerX - width, centerY); 
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill()
                  
                }

                if (shape === "arrow") {

                  const angle = Math.atan2(e.clientY - startY, e.clientX - startX);
                  
                  ctx.save(); // Save the current canvas state

                  // Draw the main line
                  ctx.beginPath();
                  ctx.moveTo(startX, startY);
                  ctx.lineTo(e.clientX, e.clientY);
                  ctx.stroke();

                  // Draw the arrowhead
                  ctx.beginPath();
                  ctx.moveTo(e.clientX, e.clientY);
                  ctx.lineTo(e.clientX - 15 * Math.cos(angle - Math.PI / 6), e.clientY - 15 * Math.sin(angle - Math.PI / 6));
                  ctx.moveTo(e.clientX, e.clientY);
                  ctx.lineTo(e.clientX - 15 * Math.cos(angle + Math.PI / 6), e.clientY - 15 * Math.sin(angle + Math.PI / 6));
                  ctx.stroke();

                  ctx.restore();
                }

                if (shape === "line") {  
                  ctx.beginPath();
                  ctx.moveTo(startX, startY);
                  ctx.lineTo(e.clientX, e.clientY);
                  ctx.stroke();
                }

                 if (shape === "pencil") {  
                     console.log("pencil")
                     console.log(startX, startY)
                  ctx.lineWidth = 1; // Line thickness
                  ctx.lineJoin = 'round'; // Rounded corners for lines
                  ctx.lineCap = 'round';

                  ctx.beginPath();
                  ctx.moveTo(startX, startY);
                  ctx.lineTo(e.offsetX, e.offsetY);
                  ctx.stroke();
                  startX = e.offsetX
                  startY = e.offsetY
                }

                
        }
      })

    }

export const drawContent = (
  canvas: HTMLCanvasElement,
  offsetX: number = 0,
  offsetY: number = 0,
  scale: number = 1
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  ctx.strokeStyle = "white";



  for (const shape of existingShapes) {

    if (shape.bgColour) {
      ctx.fillStyle = shape.bgColour
    }
    if (shape.type === "rectangle") {
      ctx.strokeStyle = shape.strokeColour || "white"
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
  }

  ctx.restore();
};
