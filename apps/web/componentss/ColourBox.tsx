import React from 'react'

interface colourBoxProps {
  colour:string,
  padding:string,
  active?:boolean,
  setColour:(colour:string)=>void
}

const ColourBox = ({colour, padding, active, setColour}:colourBoxProps) => {
  return (
    <div onClick={()=>setColour(colour)} style={{backgroundColor:`${colour}`}} className={` ${padding} ${active?"border-3 border-[#4c4897]":""} rounded-md w-fit cursor-pointer hover:scale-110`}>
      
    </div>
  )
}

export default ColourBox
