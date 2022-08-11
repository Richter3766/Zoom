const socket = io();

const myFace = document.querySelector("#myFace");
const selectCam = document.querySelector("#select-cam");

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

getMedia();
getCam();
muteBtn.addEventListener("click", handleToMuteClick);
cameraBtn.addEventListener("click", handleToCameraClick);