import { WebSocketServer } from "ws";
import "dotenv/config"
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/http-backend/http";
interface User{
    ws:WebSocket,
    room:string[],
    userId:string
}

const wss = new WebSocketServer({ port: 8080 });

console.log(JWT_SECRET)

wss.on("connection",function connection(ws,request) {
    const url=request.url;
    if(!url) return;
    const queryParams=new URLSearchParams(url.split('?')[1]);
    const token=queryParams.get('token') || "";
//@ts-ignore
    const decode= jwt.verify(token,JWT_SECRET);
    if(!decode || !(decode as JwtPayload).userid){
        ws.close()
        return;
    }


  ws.on("message", function message(data) {
    ws.send("pong");
    
  });
});
