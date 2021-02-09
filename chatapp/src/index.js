const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) =>{
    socket.emit("message", "Boas vindas");
    socket.broadcast.emit("message", "A new user has joined!");
    
    socket.on("sendMessage", (message, callback) =>{
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback("profanity is not allowed");
        }else{
            io.emit("message", message);
            callback("delivered!");
        }
    });

    socket.on("sendLocation", (location, callback) =>{
        io.emit("sendLocation", location);
        callback();
    });

    socket.on("disconnect", () =>{
        io.emit("message", "A user has left");
    });
});


server.listen(port, () =>{
    console.log("Server is up in port ", port);
});