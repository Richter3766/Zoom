const nickForm = document.querySelector("#nickForm");
const msgForm = document.querySelector("#msgForm");
const msgUl = document.querySelector("ul");

const socket = new WebSocket(`ws://${window.location.host}`);

const NICKNAME = "nickname";
const MESSAGE = "message";

socket.addEventListener("open", ()=>{
    console.log("Connected to Server");
});

socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    msgUl.append(li);
});

socket.addEventListener("close", ()=>{
    console.log("Disconnected from Server");
});

function makeFormObj(type, payload){
    const newObj = {type: type, payload: payload};
    return newObj;
}

function handleToNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input")
    socket.send(
        JSON.stringify(
            makeFormObj(NICKNAME, input.value)));
    input.value = "";
}

function handleToSubmit(event){
    event.preventDefault();
    const input = msgForm.querySelector("input")
    socket.send(
        JSON.stringify(
            makeFormObj(MESSAGE, input.value)));
    input.value = "";
}

nickForm.addEventListener("submit", handleToNickSubmit);
msgForm.addEventListener("submit", handleToSubmit);