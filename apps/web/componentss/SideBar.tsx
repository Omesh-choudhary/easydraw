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
    const [bgColour, setbgColour] = useState<string >("")

    useEffect(()=>{
        let easyDrawState = JSON.parse(localStorage.getItem("easyDrawState") || "{}")
        if (easyDrawState) {
         setstate(easyDrawState)
        easyDrawState.bgColour?setbgColour(easyDrawState.bgColour):null
        easyDrawState.strokeColour?setstroke(easyDrawState.strokeColour):null
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

    const StrokeHandler =()=>{

    }
  return (
    <div className='w-52  bg-[#222222] h-[72vh] absolute left-5 top-20 rounded-md p-2'>

        <div className="stroke-box ">
            <h3 className='text-xs font-semibold text-gray-300 '>Stroke</h3>
            <div className="storke-colours flex justify-start items-center py-2 gap-1.5">
                <ColourBox active={stroke === "#fff"}    setColour={(colour)=>ColourHandler(colour,"stroke")}   colour='#fff' padding='p-3'/>
                <ColourBox active={stroke === "#dc1d73"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='#dc1d73' padding='p-3'/>
                <ColourBox active={stroke === "#27dc1d"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='#27dc1d' padding='p-3'/>
                <ColourBox active={stroke === "#1da9dc"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='#1da9dc' padding='p-3'/>
                <ColourBox active={stroke === "#e68d2d"} setColour={(colour)=>ColourHandler(colour,"stroke")} colour='#e68d2d' padding='p-3'/>
                <h1 className='text-gray-600'>|</h1>
                <div style={{backgroundColor:`${stroke || "#fff"}`}} className={`colour-box p-4 rounded-md`}></div>
                {/* <ColourBox colour={stroke || "#fff"} padding='p-4'/> */}

            </div>

            
        </div>

        <div className="bg-box my-4 ">
            <h3 className='text-xs font-semibold text-gray-300 '>Background</h3>
           <div className="bg-colours flex justify-start items-center py-2 gap-1.5 ">
                <ColourBox active={bgColour === "#403f3e"}   setColour={(colour)=>ColourHandler(colour,"bgColour")}  colour='#403f3e' padding='p-3'/>
                <ColourBox active={bgColour === "#dc1d73ab"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='#dc1d73ab' padding='p-3'/>
                <ColourBox active={bgColour === "#27dc1d9d"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='#27dc1d9d' padding='p-3'/>
                <ColourBox active={bgColour === "#1da9dc9d"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='#1da9dc9d' padding='p-3'/>
                <ColourBox active={bgColour === "#c06c12b0"} setColour={(colour)=>ColourHandler(colour,"bgColour")} colour='#c06c12b0' padding='p-3'/>
                <h1 className='text-gray-600'>|</h1>
                <div style={{backgroundColor:`${bgColour || "#403f3e"}`}} className={`colour-box p-4 rounded-md`}></div>

            </div>       
        </div>


        <div className="stroke-width-box my-4">
            <h3 className='text-xs font-semibold text-gray-300 '>Stroke width</h3>
            <div className="storke-colours flex justify-start items-center py-2 gap-1.5">
                <Icon   icon={TfiLayoutLineSolid} bgColour='bg-[#333232]' />
                <Icon icon={TfiLayoutLineSolid} bgColour='bg-[#333232]'  />
                <Icon icon={TfiLayoutLineSolid}  bgColour='bg-[#333232]'  />

            </div>

            
        </div>



        <div className="stroke-style-box my-4 ">
            <h3 className='text-xs font-semibold text-gray-300 '>Stroke style</h3>
            <div className="storke-colours flex justify-start items-center py-2 gap-1.5">
                <Icon icon={TfiLayoutLineSolid} bgColour='bg-[#333232]' />
                <Icon icon={TfiLineDashed} bgColour='bg-[#333232]' />
                <Icon icon={TbLineDotted} bgColour='bg-[#333232]' />

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
               <input className='w-full accent-[#413f85] bg-gray-500 border-none outline-none h-1' type="range" min={0} max={100} defaultValue={100} name="opacity" id="" />
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
