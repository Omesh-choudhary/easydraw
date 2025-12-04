import z from "zod"

export const JWT_SECRET= "jdwr09^&%#$@*$$%$%^^$%^napihpfpahhv"


export const SignUpSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(6).max(25),
    name:z.string()
})


export const SignInSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(6).max(25),
})


export const CreateRoomSchema = z.object({
    name:z.string().min(3).max(20)
})




