const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let LastTwentyMessages = [];

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("message", (msg) => {
    console.log("Message received: ", msg);
    if (LastTwentyMessages.length >= 20) {
      LastTwentyMessages.pop;
    }
    LastTwentyMessages.push(msg);
    console.log(LastTwentyMessages);
    io.emit("message", msg); // Broadcast toall clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
  socket.on("image", (image) => {
    io.emit("image", image);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
