const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=>{
    console.log("Connected to Server");
});

socket.addEventListener("message", (message)=>{

    console.log(`${message.data} is from Server`);
});

socket.addEventListener("close", ()=>{
    console.log("Disconnected from Server");
});

setTimeout(() => {
    socket.send("hello from browser");
}, 10000);