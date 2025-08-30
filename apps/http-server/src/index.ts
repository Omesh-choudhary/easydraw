import express from "express"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware"
import {createRoomScehma, createUserScehma, signinUserScehma} from "@repo/common/types"
import prisma from "@repo/db/client"
import bcrypt from "bcryptjs"
import {JWT_SECRET} from "@repo/backend-common/config"
const app = express()
app.use(express.json())

app.post("/signup",async(req,res)=>{
    // db call
   const result = createUserScehma.safeParse(req.body)
   if (!result.success) {
  
    res.status(411).json({
        error:"Invalid credentials",
    })
    return ;
   }

   try {

    const hashedPassword = bcrypt.hashSync(result.data.password,10)

    const user = await prisma.user.create({
        data:{
           name:result.data.name,
           email:result.data.email,
           password:hashedPassword
        }
    })

    res.json({
        userId:user.id
    })
    
   } catch (error) {
    res.status(411).json({
        messagge:"User already registered with this email",
    })
   }
    
})

app.post("/signin",async(req,res)=>{
    // db call

    const result = signinUserScehma.safeParse(req.body)

    if (!result.success) {
        res.status(411).json({
            message:"Invalid credentials"
        })
        return ;
    }

    try {

        const existUser = await prisma.user.findFirst({
            where:{
                email:result.data.email
            }
        })

        if (!existUser) {
            res.status(411).json({
                message:"Invalid email or password"
            })
            return ;
        }

        const isPasswordCorrect = bcrypt.compare(result.data.password,existUser?.password || "")

        if (!isPasswordCorrect) {
            res.status(411).json({
                message:"Invalid email or password"
            })

            return ;
        }

        const token = jwt.sign({
                     id:existUser.id
            },JWT_SECRET,{expiresIn:"24h"})

         res.json({
                   token
                 })

        
    } catch (error) {
        res.status(411).json({
            message:"something went wrong"
        })
    }
     
})

app.post("/room",middleware,async(req,res)=>{
       const result = createRoomScehma.safeParse(req.body)

    if (!result.success) {
        res.status(411).json({
            message:"Invalid credentials"
        })
        return ;
    }
    try {
        // @ts-ignore
        const userId = req.userId


        const room = await prisma.room.create({
            data:{
               slug: result.data.name,
               adminId:userId
            }
        })

        res.json({
            roomId:room.id
        })
    } catch (error) {

        res.status(401).json({
            message:"room already exists with this name"
        })
    }


})


app.listen(3001)