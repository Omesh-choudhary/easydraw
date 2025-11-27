import {WebSocketServer} from "ws"


const wss = new WebSocketServer({port:8080})


wss.on("connection", (ws)=>{

    ws.on("message", (data)=>{
        console.log("message received :", data.toString())
        ws.send("hi")
    })
})