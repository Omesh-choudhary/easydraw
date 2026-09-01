"use client";

import { useEffect, useRef, useState } from "react";
import { initDraw } from "../lib/draw";
import TopBar from "../componentss/TopBar";
import SideBar from "../componentss/SideBar";
import { MdContentCopy, MdMenu } from "react-icons/md";
import { useShapeStore } from "./store/shapeStore";
import { useToolStore } from "./store/toolStore";
import { IoPlayOutline } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { FaStop } from "react-icons/fa6";
import { getSocket } from "../lib/socket";

export default function Home() {
  const [IsShare, setIsShare] = useState(false)
  const [roomID, setroomID] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initializedRef = useRef(false);

  const shapeState = useShapeStore();
  const toolState = useToolStore();
  const router = useRouter()

  useEffect(() => {
    if (!shapeState.hasHydrated) return;
    if (!canvasRef.current) return;
    if (initializedRef.current) return;

    const hash = window.location.hash
    const room = hash.split("#room=")[1]
    let ws:WebSocket ;
    if (room) {    
      setroomID(room)
       ws = getSocket()
      ws.onopen =()=>{
        ws.send(
        JSON.stringify({
          type: "join-room",
          roomId: room,
        })
      );

      ws.onmessage=(event)=>{
        const data = JSON.parse(event.data);
        console.log(data)
      }
      initDraw(canvasRef.current!, room, ws );  
      }
    }

    if (!room) {
      initDraw(canvasRef.current)
    }


    initializedRef.current = true;

  }, [shapeState.hasHydrated]);

 
  if (!shapeState.hasHydrated) {
    return null; 
  }


  const StartSession =()=>{
    const NewroomId = uuidv4()
    setroomID(NewroomId)
   router.push(`#room=${NewroomId}`)

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

        {
          IsShare && (
            <div className="session-box absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[40vw] bg-gray-800 rounded-md p-2 ">
             {!roomID && (
              <div className="flex flex-col gap-2 justify-center items-center">
                 <h1 className="text-[#a8a5ff] text-2xl font-bold font-[ComicShans]">Live Collabaration</h1>
              <h3 className="text-gray-300">Invite people to collaborate on your drawing.</h3>
              <h3 className="text-gray-300 text-center">Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.</h3>
                <button onClick={StartSession} className="flex justify-center items-center py-2 px-4 rounded-md bg-[#a8a5ff] cursor-pointer  hover:scale-105"><IoPlayOutline /> Start Session</button>
              </div>
             )}

             {
              roomID && (
                <div className="mx-4 mt-8 text-gray-300">
                  <h1 className="font-sans text-xl font-semibold mb-8">Live collabration</h1>
                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="name">Your Name</label>
                    <input className="w-full outline-none border-[1.3px] border-gray-700 rounded-md py-1.5 px-4" type="text" />
                  </div>
                  <div className="flex flex-col gap-2 mb-6">
                    <label htmlFor="name">Link</label>
                    <div className="flex gap-2 justify-center items-center">
                    <input value={window.location.href} disabled className="w-full outline-none border-[1.3px] border-gray-700 rounded-md py-1.5 px-4 placeholder:text-gray-400" type="text" />
                      <button onClick={StartSession} className="flex justify-center items-center gap-2 py-2 px-4 rounded-md text-black font-sans whitespace-nowrap bg-[#a8a5ff] cursor-pointer  hover:scale-105"><MdContentCopy /> Copy link</button>
                    </div>
                  </div>
                  <h1 className="line w-full bg-gray-600 h-[1.2px] my-2"></h1>
                  <h2 className="text-sm mb-4">🔒 Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.</h2>
                  <h2 className="text-sm mb-2">Stopping the session will disconnect you from the room, but you'll be able to continue working with the scene, locally. Note that this won't affect other people, and they'll still be able to collaborate on their version.</h2>

                  <div className="stop-session w-full flex items-center justify-center mt-6">
                     <button onClick={StartSession} className="flex justify-center items-center gap-2 py-2 px-4 rounded-md font-sans whitespace-nowrap border-[1.2px] border-red-300 text-red-300 hover:text-red-400 hover:border-red-400 cursor-pointer"><FaStop /> Stop Session</button>
                  </div>
                </div>
              )
             }
             </div>
             
          )
        }

      <div className="tool-box w-full absolute top-0 p-4 flex items-center justify-between">
        <div className="hamburger text-white text-2xl p-2 bg-gray-900 cursor-pointer">
          <MdMenu />
        </div>
        <TopBar />
        <div className="share cursor-pointer">
          <h1 onClick={()=>setIsShare(!IsShare)} className="p-2 px-3 bg-[#a8a5ff] rounded font-thin">
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
