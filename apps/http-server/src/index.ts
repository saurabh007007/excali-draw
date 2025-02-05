import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcryptjs from "bcryptjs"
import { middleware } from "./middleware.js";
import {CreateUserSchema,CreateRoomSchema,SigninSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";

import {JWT_SECRET} from "@repo/http-backend/http" 




const app =express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hi there ");
})

app.post("/signin",(req,res)=>{
 const parsedData=SigninSchema.safeParse(req.body);
 const {username,pasdword}=parsedData.data;

 const hashverify=bcryptjs.compare()
 const token =jwt.sign({
   username
 },JWT_SECRET);

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
        const hashedPassword= await bcryptjs.hash(parsedData.data.password,10)
        console.log(hashedPassword)
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id,
            message:"user signup succesfully"
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