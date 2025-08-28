import express from "express"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware"
import {createUserScehma} from "@repo/common/types"
const app = express()


app.post("/signup",(req,res)=>{
    // db call
   const result = createUserScehma.safeParse(req.body)

   if (!result.success) {
    
    res.json({
        error:"Invalid credentials"
    })
    return ;
   }
    res.json({
        "user":"1"
    })
})

app.post("/signin",(req,res)=>{
    // db call
     const userId = 1 ;
     const token = jwt.sign({
        userId
     },"jwt-secret",{expiresIn:"24h"})

    res.json({
        token
    })
})

app.post("/room",middleware,(req,res)=>{

    res.json({
        "roomid":"24noer34"
    })

})


app.listen(3000)