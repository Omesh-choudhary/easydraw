"use client"
import { useEffect, useRef } from "react";
import { drawContent, initDraw } from "../lib/draw";
import TopBar from "../componentss/TopBar";
import { MdMenu } from "react-icons/md";
import SideBar from "../componentss/SideBar";
import { useRecoilValue } from "recoil";
import { activeTool as tool } from "../lib/atom";


export default function Home() {

let scale = 1;
let offsetX = 0;
let offsetY = 0;


 const canvasRef = useRef<HTMLCanvasElement>(null)
  const zoomRef = useRef(null)
  useEffect(()=>{
   if (canvasRef.current) {
    
    const canvas = canvasRef.current
    initDraw(canvas)

    canvas.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent page scrolling
    const zoomFactor = 0.1;
    const oldScale = scale;

    if (e.deltaY < 0) { // Zoom in
        scale += zoomFactor;
    } else { // Zoom out
        scale -= zoomFactor;
    }

    // Limit zoom level
    scale = Math.max(0.1, Math.min(5, scale)); // Example limits

    // Adjust offset to zoom towards cursor
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    offsetX = mouseX - (mouseX - offsetX) * (scale / oldScale);
    offsetY = mouseY - (mouseY - offsetY) * (scale / oldScale);

    // Redraw with new zoom/pan

    drawContent(canvas, offsetX, offsetY, scale);
});
   }
   
  },[canvasRef])


  
  return (
    <div className="relative">
      <div className="tool-box w-full absolute top-0 p-4 flex items-center justify-between   ">
        <div className="hamburger text-white text-2xl p-2 bg-gray-900 cursor-pointer">
          <MdMenu />
        </div>
        <TopBar/>
        <div className="share cursor-pointer">
          <h1 className="p-2 px-3 bg-[#a8a5ff] rounded font-thin">Share</h1>
        </div>
      </div>

      <SideBar/>
    <canvas ref={canvasRef} width={1536} height={838} className="bg-black "  ></canvas>
    <div ref={zoomRef}  className="zoom-in absolute left-18 bottom-3 p-2 px-4 bg-white rounded text-2xl cursor-pointer">+</div>
    
    </div>
  );
}
