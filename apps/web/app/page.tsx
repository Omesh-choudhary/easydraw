"use client";

import { useEffect, useRef } from "react";
import { initDraw } from "../lib/draw";
import TopBar from "../componentss/TopBar";
import SideBar from "../componentss/SideBar";
import { MdMenu } from "react-icons/md";
import { useShapeStore } from "./store/shapeStore";
import { useToolStore } from "./store/toolStore";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initializedRef = useRef(false);

  const shapeState = useShapeStore();
  const toolState = useToolStore();

  useEffect(() => {
    if (!shapeState.hasHydrated) return;
    if (!canvasRef.current) return;
    if (initializedRef.current) return;

    initializedRef.current = true;
    initDraw(canvasRef.current);
  }, [shapeState.hasHydrated]);

 
  if (!shapeState.hasHydrated) {
    return null; // or skeleton
  }

  return (
    <div className="relative">
      {shapeState.shapes.length === 0 &&
        toolState.activeTool.type === "cursor" && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-white" >
            <img className="w-72" src="/images/logo.png" alt="EasyDraw" />
            <h4 className="font-[ExcaliFont] text-xl text-gray-400">All your data is saved locally in your browser.</h4>
          </div>
        )}

      <div className="tool-box w-full absolute top-0 p-4 flex items-center justify-between">
        <div className="hamburger text-white text-2xl p-2 bg-gray-900 cursor-pointer">
          <MdMenu />
        </div>
        <TopBar />
        <div className="share cursor-pointer">
          <h1 className="p-2 px-3 bg-[#a8a5ff] rounded font-thin">
            Share
          </h1>
        </div>
      </div>

      <SideBar />
      <canvas
        ref={canvasRef}
        className="bg-black h-screen w-full"
      />
    </div>
  );
}
