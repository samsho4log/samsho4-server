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
    users[socket.id] = {
      nickname: nickname || "익명",
    };

    io.emit("userList", Object.values(users).map((u) => u.nickname));
    io.emit("chatMessage", `${users[socket.id].nickname} 님이 입장했습니다.`);
  });

  socket.on("chatMessage", (msg) => {
    if (!users[socket.id]) return;
    io.emit("chatMessage", `${users[socket.id].nickname}: ${msg}`);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("chatMessage", `${users[socket.id].nickname} 님이 퇴장했습니다.`);
      delete users[socket.id];
      io.emit("userList", Object.values(users).map((u) => u.nickname));
    }
    console.log("user disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
