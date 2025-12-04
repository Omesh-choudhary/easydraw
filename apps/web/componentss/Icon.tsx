
import { IconType } from "react-icons";

interface iconProps {
  icon:IconType,
  bgColour?:string,
  className?:string,
  title?:string,
  active?:boolean
}

const Icon = ({icon:IconComponent,bgColour,className, title, active}:iconProps) => {
  return (
      <IconComponent  size={40} data-tool={title} style={{padding:"12px"}}  className={` ${className} ${active?"bg-[#403e6a]":""} text-white font-black rounded-md ${bgColour} ${!active?"hover:bg-[#302f2f]":""} cursor-pointer`} />
  )
}

export default Icon
