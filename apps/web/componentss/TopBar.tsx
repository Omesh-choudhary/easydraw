"use client"
import React, { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { FaArrowPointer, FaArrowRightLong, FaRegCircle, FaRegSquare } from 'react-icons/fa6'
import { BsDiamond } from 'react-icons/bs'
import { MdArrowForward } from 'react-icons/md'
import { LuEraser, LuPencil, LuShapes } from 'react-icons/lu'
import { ImTextColor } from 'react-icons/im'
import { CiImageOn } from 'react-icons/ci'
import { TfiLayoutLineSolid } from 'react-icons/tfi'

export interface easyDrawState {
    activeTool: string,
    strokeColour: string,
    bgColour:string,
    strokeWidth:number,
    strokeStyle:string,
    opacity:number
}
 const TopBar = () => {
const [state, setstate] = useState<easyDrawState>()
const [activeTool, setActiveTool] = useState<string | null>(null)

   let raw:easyDrawState;
   useEffect(() => {
     raw = JSON.parse(localStorage.getItem("easyDrawState") || "{}")
     console.log(raw)
    if (raw){
      setActiveTool(raw.activeTool)
      setstate(raw)
    }
      
  }, [])
//  const [activeTool, setActiveTool] = useRecoilState(tool);
 
  const EventHandler =(e:React.MouseEvent)=>{
     console.log(state)
    const target = e.target as HTMLElement;


    const tool = target.closest("[data-tool]")?.getAttribute("data-tool");
     
    if (tool) {
      setActiveTool(tool)
      let obj = {...state, activeTool:tool}
      console.log(obj)
      localStorage.setItem("easyDrawState", JSON.stringify(obj))
    }


  }

   return (
     <div onClick={(e)=>EventHandler(e)} className='topbar w-fit h-full flex justify-center items-center gap-2 rounded-xl p-1 px-2 bg-[#1b1a1a] '>
       <Icon active={activeTool==="cursor"} icon={FaArrowPointer} title='cursor' />
       <Icon active={activeTool==="rectangle"} icon={FaRegSquare} title='rectangle' />
       <Icon active={activeTool==="diamond"} icon={BsDiamond} title='diamond' />
       <Icon active={activeTool==="circle"} icon={FaRegCircle} title='circle' />
       <Icon active={activeTool==="arrow"} icon={FaArrowRightLong} title='arrow' />
       <Icon active={activeTool==="line"} icon={TfiLayoutLineSolid} title='line' />
       <Icon active={activeTool==="pencil"} icon={LuPencil} title='pencil' />
       <Icon active={activeTool==="text"} icon={ImTextColor} title='text' />
       <Icon active={activeTool==="image"} icon={CiImageOn} title='image' />
       <Icon active={activeTool==="eraser"} icon={LuEraser} title='eraser' />
       <Icon active={activeTool==="shapes"} icon={LuShapes} title='shapes' />
     </div>
   )
 }
 
 export default TopBar
 