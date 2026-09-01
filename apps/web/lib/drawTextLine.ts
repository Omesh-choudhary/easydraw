

export const drawTextLine =(ctx:CanvasRenderingContext2D,x:number, y:number)=>{

    ctx.lineWidth = 2
    ctx.setLineDash([0, 0]);
    ctx.strokeStyle = "#60a5fa"
    
    ctx.beginPath()
    ctx.moveTo(x, y+10)
    ctx.lineTo(x, y-25)
    ctx.stroke()
   

}