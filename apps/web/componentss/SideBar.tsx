import React, { useEffect, useState } from 'react'
import ColourBox from './ColourBox'
import Icon from './Icon'
import { TfiLayoutLineSolid, TfiLineDashed } from 'react-icons/tfi'
import { TbLineDotted } from 'react-icons/tb'
import { LuSquareDashed } from 'react-icons/lu'
import { GiSquare } from 'react-icons/gi'
import { RiDownloadLine, RiUploadLine } from 'react-icons/ri'
import { GoArrowDown, GoArrowUp } from 'react-icons/go'
import { easyDrawState } from './TopBar'



const SideBar = () => {
    const [state, setstate] = useState<easyDrawState>()
    const [stroke, setstroke] = useState<string>("")
    const [strokeWidth, setstrokeWidth] = useState<number>(1)
    const [strokeStyle, setstrokeStyle] = useState<string>("solid")
    const [bgColour, setbgColour] = useState<string >("")
    const [opacity, setopacity] = useState<number | string>(100)

    useEffect(()=>{
        let easyDrawState = JSON.parse(localStorage.getItem("easyDrawState") || "{}")
        if (easyDrawState) {
         setstate(easyDrawState)
        easyDrawState.bgColour?setbgColour(easyDrawState.bgColour):null
        easyDrawState.strokeColour?setstroke(easyDrawState.strokeColour):null
        easyDrawState.strokeWidth?setstrokeWidth(easyDrawState.strokeWidth):null
        easyDrawState.strokeStyle?setstrokeStyle(easyDrawState.strokeStyle):null
        easyDrawState.opacity?setopacity(easyDrawState.opacity*100):null
       }
    },[])

    const ColourHandler =(colour:string, box:string)=>{
        let easyDrawState = JSON.parse(localStorage.getItem("easyDrawState") || "{}")
        if (easyDrawState) {
            setstate(easyDrawState)
        }
         let obj
        if (box === "stroke" && state) {
            setstroke(colour)  
            obj = {...easyDrawState, strokeColour:colour}  
            setstate(obj)
            
        } 
        if (box === "bgColour" && colour && state) {
            console.log(box)
            setbgColour(colour)
            obj = {...easyDrawState, bgColour:colour}  
            setstate(obj)
        }
            console.log(obj)

        localStorage.setItem("easyDrawState", JSON.stringify(obj))

    }

    const StrokeHandler =(stroke:number | string)=>{
           let easyDrawState = JSON.parse(localStorage.getItem("easyDrawState") || "{}")
        if (easyDrawState) {
            setstate(easyDrawState)
        }
         let obj
        if (typeof stroke === 'number') {
            setstrokeWidth(stroke)
            obj = {...easyDrawState, strokeWidth:stroke }  
            setstate(obj)
        } 
        if (typeof stroke === 'string') {
            setstrokeStyle(stroke)
            obj = {...easyDrawState, strokeStyle:stroke }  
            setstate(obj)
        }

        localStorage.setItem("easyDrawState", JSON.stringify(obj))
    }

    const OpacityHandler =(value:string | number)=>{
       setopacity(value)
       let easyDrawState = JSON.parse(localStorage.getItem("easyDrawState") || "{}")
       let obj = {...easyDrawState, opacity:Number(value)/100}
       localStorage.setItem("easyDrawState", JSON.stringify(obj))
    }

  return (
    <div className='w-52  bg-[#222222] h-[72vh] absolute left-5 top-20 rounded-md p-2'>

        <div className="stroke-box ">
            <h3 className='text-xs font-semibold text-gray-300 '>Stroke</h3>
            <div className="storke-colours flex justify-start items-center py-2 gap-1.5">
                <ColourBox active={stroke === "rgba(255, 255, 255, 1)"}    setColour={(colour)=>ColourHandler(colour,"stroke")}   colour='rgba(255, 255, 255, 1)' padding='p-3'/>
                <ColourBox active={stroke === "rgba(220, 29, 115, 1)"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='rgba(220, 29, 115, 1)' padding='p-3'/>
                <ColourBox active={stroke === "rgba(39, 220, 29, 1)"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='rgba(39, 220, 29, 1)' padding='p-3'/>
                <ColourBox active={stroke === "rgba(29, 169, 220, 1)"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='rgba(29, 169, 220, 1)' padding='p-3'/>
                <ColourBox active={stroke === "rgba(230, 141, 45, 1)"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='rgba(230, 141, 45, 1)' padding='p-3'/>
                <h1 className='text-gray-600'>|</h1>
                <div style={{backgroundColor:`${stroke || "rgba(255, 255, 255, 1)"}`}} className={`colour-box p-4 rounded-md`}></div>
                {/* <ColourBox colour={stroke || "#fff"} padding='p-4'/> */}

            </div>

            <div className='bg-[#784003]'></div>
        </div>

        <div className="bg-box my-4 ">
            <h3 className='text-xs font-semibold text-gray-300 '>Background</h3>
           <div className="bg-colours flex justify-start items-center py-2 gap-1.5 ">
                <ColourBox active={bgColour === "transparent"}   setColour={()=>ColourHandler("transparent","bgColour")}  colour='#403f3e' padding='p-3'/>
                <ColourBox active={bgColour === "rgba(143, 6, 68, 1)"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='rgba(143, 6, 68, 1)' padding='p-3'/>
                <ColourBox active={bgColour === "rgba(8, 116, 3, 1)"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='rgba(8, 116, 3, 1)' padding='p-3'/>
                <ColourBox active={bgColour === "rgba(4, 103, 139, 1)"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='rgba(4, 103, 139, 1)' padding='p-3'/>
                <ColourBox active={bgColour === "rgba(120, 64, 3, 1)"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='rgba(120, 64, 3, 1)' padding='p-3'/>
                <h1 className='text-gray-600'>|</h1>
                <div style={{backgroundColor:`${bgColour || "#403f3e"}`}} className={`colour-box p-4 rounded-md`}></div>

            </div>       
        </div>


        <div className="stroke-width-box my-4">
            <h3 className='text-xs font-semibold text-gray-300 '>Stroke width</h3>
            <div className="storke-colours flex justify-start items-center py-2 gap-1.5">
                <Icon bold={1} active={strokeWidth === 1} fn={()=>StrokeHandler(1)} icon={TfiLayoutLineSolid} bgColour='bg-[#333232]' />
                <Icon bold={2} active={strokeWidth === 2} fn={()=>StrokeHandler(2)} icon={TfiLayoutLineSolid} bgColour='bg-[#333232]'  />
                <Icon bold={3} active={strokeWidth === 3} fn={()=>StrokeHandler(3)} icon={TfiLayoutLineSolid} bgColour='bg-[#333232]'  />

            </div>

            
        </div>



        <div className="stroke-style-box my-4 ">
            <h3 className='text-xs font-semibold text-gray-300 '>Stroke style</h3>
            <div className="storke-colours flex justify-start items-center py-2 gap-1.5">
                <Icon active={strokeStyle === "solid"} fn={()=>StrokeHandler("solid")} icon={TfiLayoutLineSolid} bgColour='bg-[#333232]' />
                <Icon active={strokeStyle === "dashed"} fn={()=>StrokeHandler("dashed")} icon={TfiLineDashed} bgColour='bg-[#333232]' />
                <Icon active={strokeStyle === "dotted"} fn={()=>StrokeHandler("dotted")} icon={TbLineDotted} bgColour='bg-[#333232]' />

            </div>  
        </div>

         <div className="Edge-type-box my-4 ">
            <h3 className='text-xs font-semibold text-gray-300 '>Edges</h3>
            <div className="edges flex justify-start items-center py-2 gap-1.5">
                <Icon icon={GiSquare} bgColour='bg-[#333232]' />
                <Icon icon={LuSquareDashed} bgColour='bg-[#333232]' />
            </div>   
        </div>

        <div className="Opacity-box my-4 ">
            <h3 className='text-xs font-semibold text-gray-300 '>Opacity</h3>
            <div className="Opacity  py-2 gap-1.5">
               <input value={opacity} onChange={(e)=>OpacityHandler(e.target.value)} className='w-full accent-[#413f85] bg-gray-500 border-none outline-none h-1' type="range" min={0} max={100} name="opacity" id="" />
               <div className="range text-white text-xs w-full flex justify-between items-center">
                <h4>0</h4>
                <h4>100</h4>
               </div>
            </div>   
        </div>


         <div className="Layers-box my-4 ">
            <h3 className='text-xs font-semibold text-gray-300 '>Layers</h3>
            <div className="storke-colours flex justify-start items-center py-2 gap-1.5">
                <Icon icon={RiDownloadLine} bgColour='bg-[#333232]' />
                <Icon icon={GoArrowDown} bgColour='bg-[#333232]' />
                <Icon icon={GoArrowUp} bgColour='bg-[#333232]' />
                <Icon icon={RiUploadLine} bgColour='bg-[#333232]' />

            </div>  
        </div>
      
    </div>
  )
}

export default SideBar
