const socket = io();
//4:52
//Constants
const $messageForm = document.querySelector("#formulario");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;


socket.on("message", (message) =>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message
    });
    $messages.insertAdjacentHTML("beforeend",html)
});

socket.on("sendLocation", (location) =>{
    console.log(`Location: ${location.latitude}, ${location.longitude}`);
});

$messageForm.addEventListener("submit", (event) =>{
    
    $messageFormButton.setAttribute("disabled", "disabled");
    socket.emit("sendMessage", document.querySelector("#message").value, (ack) =>{
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();
        console.log(ack);
    });
    event.preventDefault();
});

document.querySelector('#send-location').addEventListener("click", () =>{
    if(!navigator.geolocation){
        return alert("your browser do not support geolocation");
    }
    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit("sendLocation", {latitude: position.coords.latitude, longitude: position.coords.longitude}, () =>{
            console.log("Location shared!");
        });
    });
});