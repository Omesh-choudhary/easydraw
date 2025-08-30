import {WebSocketServer} from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import type WebSocket from "ws";
const wss = new WebSocketServer({port:8080});
interface Room {
  [roomName: string]: {
    userId: string;
    websocket: WebSocket;
  }[];
}

const rooms:Room ={};
function checkUser (token:string):string | null{

    const decoded = jwt.verify(token,JWT_SECRET)
    if (typeof decoded === "string") {
        return null ;
    }

     if (!decoded || !decoded.id) {
        return null ;
     }

     return decoded.id

}
wss.on("connection",(ws,request)=>{

    const url = request.url ;
     if (!url) {
        return 
     }

     const queryparams = new URLSearchParams(url.split("?")[1])
     const token = queryparams.get("token") ?? ""
     const userId = checkUser(token)

     if (userId==null) {
        ws.close()
        return null;
     }

    ws.on("message",(data)=>{
       console.log(data)
            const parsedData = JSON.parse(data as unknown as string)
            console.log(parsedData)
     
            if (parsedData.type =="join_room") {
                const roomName = parsedData.roomName

                if (!rooms[`${roomName}`]) {
                    rooms[`${roomName}`]=[]
                }

                rooms[`${roomName}`]?.push({userId:userId, websocket:ws })
                ws.send("room joined successfully")
            }

            if (parsedData.type == "leave_room") {
                const roomName = parsedData.roomName

                if (!rooms[`${roomName}`]) {
                    return ws.send("invalid roomName")
                }
                
                rooms[`${roomName}`]?.filter((room)=>room.userId == userId)
                
            }

            if (parsedData.type == "chat") {
                
                const roomName = parsedData.roomName

                if (!rooms[`${roomName}`]) {
                    return ws.send("invalid roomName")
                }

                rooms[`${roomName}`]?.forEach((room)=>{
                    room.websocket.send(parsedData.message)
                })
            }
        
    })
})