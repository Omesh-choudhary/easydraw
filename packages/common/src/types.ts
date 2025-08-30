import z from "zod"


export const createUserScehma = z.object({
    name:z.string(),
    email:z.email().min(3),
    password:z.string(),
})

export const signinUserScehma = z.object({
    email:z.email().min(3),
    password:z.string(),
})

export const createRoomScehma = z.object({
    name:z.string().min(3).max(30)
})