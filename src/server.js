import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection", (socket)=>{
    sockets.push(socket);
    console.log("Connected Successfully");
    socket["nickname"] = "Anon";
    socket.on("message", (message) => {
        const data = JSON.parse(message);
        if(data.type === "nickname"){
            socket["nickname"] = data.payload;
        } else if( data.type === "message"){
            sockets.forEach((asocket) => {
                asocket.send(`${socket["nickname"]}: ${data.payload}`);
            });
        }
    });
    socket.on("close", ()=> console.log("DisConnected!"));
});


server.listen(3000, handleListen);