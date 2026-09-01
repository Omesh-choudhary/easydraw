import {Shape} from "../app/store/shapeStore"

export const drawHandle =(shape:Shape, ctx:CanvasRenderingContext2D)=>{

    if (shape.type === "rectangle") {

        ctx.strokeStyle = "#60a5fa"
        ctx.fillStyle = "#60a5fa"
        ctx.setLineDash([0,0])
        ctx.lineWidth = 1
      ctx.strokeRect(shape.x-7, shape.y-7, shape.width!+14, shape.height!+14)      
      ctx.fillRect(shape.x-12, shape.y-12, 10, 10)      
      ctx.fillRect(shape.x+shape.width!+2, shape.y-12, 10, 10)      
      ctx.fillRect(shape.x-12, shape.y+shape.height!+2, 10, 10)      
      ctx.fillRect(shape.x+shape.width!+2, shape.y+shape.height!+2, 10, 10)   
      return { x:shape.x-7, y:shape.y-7, width:shape.width!+14, height:shape.height!+14, id:"1", type:"rectangle", opacity:1} 
    }

    if (shape.type === "circle") {
        console.log("executed", shape)

        ctx.strokeStyle = "#60a5fa"
        ctx.fillStyle = "#60a5fa"
        ctx.setLineDash([0,0])
        ctx.lineWidth = 1
      ctx.strokeRect(shape.x-shape.radius!-5, shape.y-shape.radius!-5, shape.radius!*2+10, shape.radius!*2+10)      
      ctx.fillRect(shape.x-shape.radius!-10, shape.y-shape.radius!-10, 10, 10)      
      ctx.fillRect(shape.x+shape.radius!, shape.y-shape.radius!-10, 10, 10)      
      ctx.fillRect(shape.x-shape.radius!-10, shape.y+shape.radius!, 10, 10)      
      ctx.fillRect(shape.x+shape.radius!, shape.y+shape.radius!, 10, 10)  
      
      return { x:shape.x-shape.radius!-5, y:shape.y-shape.radius!-5, width:shape.radius!*2+10, height:shape.radius!*2+10, id:"2", type:"rectangle", opacity:1} 
    }

    if (shape.type === "diamond") {
        console.log("executed", shape)

        ctx.strokeStyle = "#60a5fa"
        ctx.fillStyle = "#60a5fa"
        ctx.setLineDash([0,0])
        ctx.lineWidth = 1
      ctx.strokeRect(shape.x-shape.width!-5, shape.y-shape.height!-5, shape.width!*2+10, shape.height!*2+10)      
      ctx.fillRect(shape.x-shape.width!-10, shape.y-shape.height!-10, 10, 10)      
      ctx.fillRect(shape.x+shape.width!, shape.y-shape.height!-10, 10, 10)      
      ctx.fillRect(shape.x-shape.width!-10, shape.y+shape.height!, 10, 10)      
      ctx.fillRect(shape.x+shape.width!, shape.y+shape.height!, 10, 10)  
      
      return { x:shape.x-shape.width!-5, y:shape.y-shape.height!-5, width:shape.width!*2+10, height:shape.height!*2+10, id:"3", type:"rectangle", opacity:1} 
    }


     if (shape.type === "text") {

      const fontSize = shape.height!;

      // Measure width using an offscreen canvas
      const measureCanvas = document.createElement("canvas");
      const measureCtx = measureCanvas.getContext("2d")!;
      measureCtx.font = `${fontSize}px ExcaliFont`;

      const textWidth = measureCtx.measureText(shape.text!).width;
      const textHeight = fontSize;

        ctx.strokeStyle = "#60a5fa"
        ctx.fillStyle = "#60a5fa"
        ctx.setLineDash([0,0])
        ctx.lineWidth = 1
      ctx.strokeRect(shape.x-5, shape.y-textHeight, textWidth+10, textHeight+(textHeight/2))      
      ctx.fillRect(shape.x-10, shape.y-textHeight-5, 10, 10)      
      ctx.fillRect(shape.x+textWidth, shape.y-textHeight-5, 10, 10)      
      ctx.fillRect(shape.x-10, shape.y+(textHeight/2)-5, 10, 10)      
      ctx.fillRect(shape.x+textWidth, shape.y+(textHeight/2)-5, 10, 10)   
      return { x:shape.x-5, y:shape.y-textHeight, width:textWidth+10, height:textHeight+(textHeight/2), id:"4", type:"rectangle", opacity:1} 
    }


    
}