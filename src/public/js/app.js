const socket = io();

const nickForm = document.querySelector("#nickForm");
const roomForm = document.querySelector("#roomForm");
const msgForm = document.querySelector("#msgForm");

function addMsg(message){
    const ul = document.querySelector("#msgDiv ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.append(li);
}

function handleToNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.emit("nick", input.value);

    const nick = document.querySelector("#nickDiv h2");
    nick.innerText = `Your nickname is ${input.value}`;
    input.value = "";
}

function handleToRoomSubmit(event){
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("room", input.value);
    socket.emit("room-change", input.value, (roomSize)=>{
        const h3 = document.querySelector("#roomDiv h3");
        h3.innerText = `roomSize: ${roomSize}`;
    });

    const h2 = document.querySelector("#roomDiv h2");
    h2.innerText = `Room ${input.value}`;
    input.value = "";

    roomForm.hidden = true;
    msgForm.hidden = false;
}

function handleToMsgSubmit(event){
    event.preventDefault();
    const input = msgForm.querySelector("input");
    socket.emit("msg", input.value, (msg)=>{
        addMsg(`You: ${msg}`);
    });
    input.value = "";
}

msgForm.hidden = true;

nickForm.addEventListener("submit", handleToNickSubmit)
roomForm.addEventListener("submit", handleToRoomSubmit);
msgForm.addEventListener("submit", handleToMsgSubmit);

socket.on("msg", (msg, nickname)=>{
    addMsg(`${nickname}: ${msg}`);
});

socket.on("welcome", (nick, roomSize)=>{
    addMsg(`${nick} is joined`);
    const h3 = document.querySelector("#roomDiv h3");
    h3.innerText = `roomSize: ${roomSize}`;
});

socket.on("bye", (nick, roomSize) => {
    addMsg(`${nick} is left`);
    const h3 = document.querySelector("#roomDiv h3");
    h3.innerText = `roomSize: ${roomSize}`;
})

socket.on("room-change", (rooms) => {
    const roomList = document.querySelector("#roomDiv ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){ 
        return;
    }
    rooms.forEach((room)=>{
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
})