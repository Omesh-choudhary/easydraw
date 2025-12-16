"use client"
import React, { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { FaArrowPointer, FaArrowRightLong, FaRegCircle, FaRegSquare } from 'react-icons/fa6'
import { BsDiamond } from 'react-icons/bs'
import { MdArrowForward } from 'react-icons/md'
import { LuEraser, LuPencil, LuShapes } from 'react-icons/lu'
import { ImTextColor } from 'react-icons/im'
import { CiImageOn, CiLock } from 'react-icons/ci'
import { TfiLayoutLineSolid } from 'react-icons/tfi'
import { useToolStore } from '../app/store/toolStore'

export interface easyDrawState {
    activeTool: {
      locked:boolean,
      type:string
    },
    strokeColour: string,
    bgColour:string,
    strokeWidth:number,
    strokeStyle:string,
    opacity:number
}
 const TopBar = () => {


const activeTool = useToolStore((state)=>state.activeTool)
const setActiveTool = useToolStore((state)=>state.setActiveTool)
const setLocked = useToolStore((state)=>state.setLocked)
const hasHydrated = useToolStore((state)=>state.hasHydrated)

if (!hasHydrated) return null

 
  const EventHandler =(value:string)=>{
     
    if (value) {
      setActiveTool(value)
    }

  }

  const LockHandler =()=>{
    setLocked(!activeTool.locked)
  }

   return (
     <div className='topbar w-fit h-full flex justify-center items-center gap-2 rounded-xl p-1 px-2 bg-[#1b1a1a] '>
       <Icon active={activeTool.locked=== true} icon={CiLock} fn={()=>LockHandler()} title='cursor' />
        <div className='text-gray-700'>|</div>
       <Icon active={activeTool.type==="cursor"} icon={FaArrowPointer} fn={()=>EventHandler("cursor")} title='cursor' />
       <Icon active={activeTool.type==="rectangle"} icon={FaRegSquare} fn={()=>EventHandler("rectangle")} title='rectangle' />
       <Icon active={activeTool.type==="diamond"} icon={BsDiamond} fn={()=>EventHandler("diamond")} title='diamond' />
       <Icon active={activeTool.type==="circle"} icon={FaRegCircle} fn={()=>EventHandler("circle")} title='circle' />
       <Icon active={activeTool.type==="arrow"} icon={FaArrowRightLong} fn={()=>EventHandler("arrow")} title='arrow' />
       <Icon active={activeTool.type==="line"} icon={TfiLayoutLineSolid} fn={()=>EventHandler("line")} title='line' />
       <Icon active={activeTool.type==="pencil"} icon={LuPencil} fn={()=>EventHandler("pencil")} title='pencil' />
       <Icon active={activeTool.type==="text"} icon={ImTextColor} fn={()=>EventHandler("text")} title='text' />
       <Icon active={activeTool.type==="image"} icon={CiImageOn} fn={()=>EventHandler("image")} title='image' />
       <Icon active={activeTool.type==="eraser"} icon={LuEraser} fn={()=>EventHandler("eraser")} title='eraser' />
       <Icon active={activeTool.type==="shapes"} icon={LuShapes} title='shapes' />
     </div>
   )
 }
 
 export default TopBar
 