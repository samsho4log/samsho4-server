const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {

  console.log("user connected");

  socket.on("join", (nickname) => {
    socket.nickname = nickname;
    io.emit("chat", nickname + " joined");
  });

  socket.on("chat", (msg) => {
    io.emit("chat", socket.nickname + ": " + msg);
  });

});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
