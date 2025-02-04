import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";
import { middleware } from "./middleware.js";
import {CreateUserSchema,CreateRoomSchema,SigninSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";




const app =express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hi there ");
})

app.post("/signin",(req,res)=>{
 const userid=1;
 const token =jwt.sign({
    userid
 },process.env.JWT_SECRET??"");

 res.json({
    token
 })
})

app.post("/signup", async (req,res)=>{
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const hasedPassword= await bcrypt.hash(parsedData.data.password,10);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                
                password: hasedPassword,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }

})
app.post("/room",middleware,(req,res)=>{

})

app.listen(8081,()=>{
console.log("listening on port 8081");
});