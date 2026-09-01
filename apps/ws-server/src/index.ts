import {WebSocketServer, WebSocket} from "ws"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/common"
const wss = new WebSocketServer({port:8080})

 type room = {
    [roomName:string] :
        {
            socket : WebSocket
        }[]
 }

const rooms:room ={}
wss.on("connection", (ws)=>{
    ws.on("message", (msg)=>{


        const body = JSON.parse(msg.toString())


        if (body.type === "join-room") {

             if (!rooms[`${body.roomId}`]) {
             rooms[body.roomId] = []
           }

           rooms[body.roomId]?.push({socket:ws})

            
        }

        if (body.type === "leave-room") {

            let leftUsers= rooms[body.roomId]?.filter(s=> s.socket !== ws)

            if (leftUsers) {
                rooms[body.roomId] = leftUsers
            }
            
        }

        if (body.type === "mouse-move") {
        rooms[body.roomId]?.forEach((s) => {
            if (s.socket !== ws && s.socket.readyState === WebSocket.OPEN) {
            s.socket.send(JSON.stringify(body)); 
            }
        });
        }

       

    })

    // const url = request.url

    // if (!url) {
    //     ws.close()
    //     return
    // }

    // const queryParam = new URLSearchParams(url.split("?")[1])
    // const token = queryParam.get("token") || ""
    // const decoded = jwt.verify(token, JWT_SECRET || "")

    // if (!decoded) {
        
    //     ws.close()
    //     return
    // }

})