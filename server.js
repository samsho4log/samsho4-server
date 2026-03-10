const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("join", (nickname) => {
    users[socket.id] = nickname || "익명";
    io.emit("chat", users[socket.id] + " joined");
  });

  socket.on("chat", (msg) => {
    const nickname = users[socket.id] || "익명";
    io.emit("chat", nickname + ": " + msg);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("chat", users[socket.id] + " left");
      delete users[socket.id];
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
