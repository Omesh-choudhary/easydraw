
import { IconType } from "react-icons";

interface iconProps {
  icon:IconType,
  bgColour?:string,
  className?:string,
  title?:string,
  active?:boolean,
  bold?:number
  fn?:()=>void
}

const Icon = ({icon:IconComponent,bgColour,className, title, active, fn, bold}:iconProps) => {
  return (
      <IconComponent strokeWidth={bold?bold:1} onClick={()=>fn?fn():null}  size={40} data-tool={title} style={{padding:"12px"}}  className={` ${className} ${active?"bg-[#403e6a] ":bgColour} text-white font-black rounded-md  ${!active?"hover:bg-[#302f2f]":""} cursor-pointer`} />
  )
}

export default Icon
