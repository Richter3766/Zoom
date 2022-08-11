const socket = io();

const myFace = document.querySelector("#myFace");
const selectCam = document.querySelector("#select-cam");
const nickForm = document.querySelector("#nickForm");
const roomForm = document.querySelector("#roomForm");
const msgForm = document.querySelector("#msgForm");

const muteBtn = myFace.querySelector("#mute");
const cameraBtn = myFace.querySelector("#camera");

let myStream;
let isMute = false;
let isCameraOff = false;

async function getMedia(){
    const video = myFace.querySelector("video");
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true,
        });
        video.srcObject = myStream;
    }catch(e){
        console.log(e);
    }
}

async function getCam(){
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cam = devices.filter((device)=> device.kind === "videoinput");
    cam.forEach((camera) => {
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.innerText = camera.label;
        selectCam.appendChild(option);
    });
}

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

function handleToMuteClick(event){
    event.preventDefault();
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
    });
    if(!isMute){
        isMute = true;
        muteBtn.innerText = "Unmute";
    }else{
        isMute = false;
        muteBtn.innerText = "Mute";
    }
}

function handleToCameraClick(event){
    event.preventDefault();
    myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
    });
    if(!isCameraOff){
        isCameraOff = true;
        cameraBtn.innerText = "Turn on";
    }else{
        isCameraOff = false;
        cameraBtn.innerText = "Turn off";
    }

}
msgForm.hidden = true;
getMedia();
getCam();
muteBtn.addEventListener("click", handleToMuteClick);
cameraBtn.addEventListener("click", handleToCameraClick);

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