import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const io = SocketIO(server);

function publicRoom(){
    const roomList = [];
    const {
        sockets: {
            adapter: {sids, rooms},
            },
        } = io;
        rooms.forEach((_, key)=>{
            if(sids.get(key) === undefined){
                roomList.push(key);
            }
        });
         return roomList;
    } 

function roomSize(roomName){
    return io.sockets.adapter.rooms.get(roomName).size;
}

io.on("connection", socket => {
    socket["nickname"] = "Anon";
    io.sockets.emit("room-change", publicRoom());

    socket.on("room", (room) => {
        socket.join(room);
        socket.to(room).emit("welcome", socket.nickname, roomSize(room));
        io.sockets.emit("room-change", publicRoom());
    });

    socket.on("room-change", (room, done)=>{
        done(roomSize(room));
    })

    socket.on("msg", (msg, done)=>{
        socket.rooms.forEach((room) => {
            socket.to(room).emit("msg", msg, socket.nickname);
        });
        done(msg);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname, roomSize(room) - 1);
        });
    });

    socket.on("disconnect", ()=>{
        io.sockets.emit("room-change", publicRoom());
    });

    socket.on("nick", (nick) => {
        socket["nickname"] = nick;
    });
})
// const wss = new WebSocket.Server({server});
// const sockets = [];
// wss.on("connection", (socket)=>{
//     sockets.push(socket);
//     console.log("Connected Successfully");
//     socket["nickname"] = "Anon";
//     socket.on("message", (message) => {
//         const data = JSON.parse(message);
//         if(data.type === "nickname"){
//             socket["nickname"] = data.payload;
//         } else if( data.type === "message"){
//             sockets.forEach((asocket) => {
//                 asocket.send(`${socket["nickname"]}: ${data.payload}`);
//             });
//         }
//     });
//     socket.on("close", ()=> console.log("DisConnected!"));
// });


server.listen(3000, handleListen);