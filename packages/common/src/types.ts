import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8),
    name: z.string().min(3)
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})