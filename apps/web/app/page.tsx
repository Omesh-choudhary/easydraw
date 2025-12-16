"use client"
import { useEffect, useRef } from "react";
import { initDraw } from "../lib/draw";
import TopBar from "../componentss/TopBar";
import { MdMenu } from "react-icons/md";
import SideBar from "../componentss/SideBar";
import "./globals.css";

export default function Home() {


 const canvasRef = useRef<HTMLCanvasElement>(null)
  const zoomRef = useRef(null)
  useEffect(()=>{
   if (canvasRef.current) {
    
    const canvas = canvasRef.current
    initDraw(canvas)
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
          <h1 className="p-2 px-3 bg-[#a8a5ff] rounded font-thin cursor-w-resize">Share</h1>
        </div>
      </div>

      <SideBar/>
    <canvas ref={canvasRef} className="bg-black h-screen w-full"  ></canvas>
    <div ref={zoomRef}  className="zoom-in absolute left-18 bottom-3 p-2 px-4 bg-white rounded text-2xl cursor-pointer">+</div>
    
    </div>
  );
}
