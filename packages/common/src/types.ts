import z from "zod"


export const createUserScehma = z.object({
    username:z.string().min(3).max(20),
    password:z.string(),
    name:z.string()
})

export const signinUserScehma = z.object({
    username:z.string().min(3).max(20),
    password:z.string(),
    name:z.string()
})

export const createRoomScehma = z.object({
    name:z.string().min(3).max(30)
})