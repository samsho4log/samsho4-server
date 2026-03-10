const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

const users = {};
const rooms = {};

function getUserList() {
  return Object.values(users).map((user) => ({
    nickname: user.nickname,
    roomId: user.roomId
  }));
}

function getRoomList() {
  return Object.values(rooms).map((room) => ({
    id: room.id,
    title: room.title,
    host: room.hostNickname,
    player1: room.player1Nickname,
    player2: room.player2Nickname
  }));
}

function broadcastLobby() {
  io.emit("userList", getUserList());
  io.emit("roomList", getRoomList());
}

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("joinLobby", (nickname) => {
    if (!nickname || !nickname.trim()) return;

    users[socket.id] = {
      nickname: nickname.trim(),
      roomId: null
    };

    socket.emit("chatMessage", "[시스템] 로비에 입장했습니다.");
    io.emit("chatMessage", `[로비] ${nickname.trim()} 님이 입장했습니다.`);
    broadcastLobby();
  });

  socket.on("sendLobbyChat", (msg) => {
    if (!users[socket.id]) return;
    if (!msg || !msg.trim()) return;

    io.emit("chatMessage", `${users[socket.id].nickname}: ${msg.trim()}`);
  });

  socket.on("createRoom", (title) => {
    if (!users[socket.id]) return;
    if (!title || !title.trim()) return;

    const roomId = "room_" + Date.now();

    rooms[roomId] = {
      id: roomId,
      title: title.trim(),
      hostSocketId: socket.id,
      hostNickname: users[socket.id].nickname,
      player1SocketId: socket.id,
      player1Nickname: users[socket.id].nickname,
      player2SocketId: null,
      player2Nickname: null
    };

    users[socket.id].roomId = roomId;

    io.emit("chatMessage", `[로비] ${users[socket.id].nickname} 님이 방 '${title.trim()}' 을 만들었습니다.`);
    broadcastLobby();
  });

  socket.on("joinRoom", (roomId) => {
    if (!users[socket.id]) return;
    if (!rooms[roomId]) return;

    const room = rooms[roomId];
    const user = users[socket.id];

    if (user.roomId === roomId) return;

    if (user.roomId && rooms[user.roomId]) {
      const oldRoom = rooms[user.roomId];

      if (oldRoom.player1SocketId === socket.id) {
        oldRoom.player1SocketId = null;
        oldRoom.player1Nickname = null;
      }
      if (oldRoom.player2SocketId === socket.id) {
        oldRoom.player2SocketId = null;
        oldRoom.player2Nickname = null;
      }

      if (!oldRoom.player1SocketId && !oldRoom.player2SocketId) {
        delete rooms[user.roomId];
      }
    }

    if (!room.player1SocketId) {
      room.player1SocketId = socket.id;
      room.player1Nickname = user.nickname;
      user.roomId = roomId;
      io.emit("chatMessage", `[로비] ${user.nickname} 님이 '${room.title}' 방의 Player1 으로 입장했습니다.`);
    } else if (!room.player2SocketId) {
      room.player2SocketId = socket.id;
      room.player2Nickname = user.nickname;
      user.roomId = roomId;
      io.emit("chatMessage", `[로비] ${user.nickname} 님이 '${room.title}' 방의 Player2 으로 입장했습니다.`);
    } else {
      socket.emit("chatMessage", "[시스템] 방이 가득 찼습니다. 다음 단계에서 관전자 기능을 붙이면 됩니다.");
      return;
    }

    broadcastLobby();
  });

  socket.on("leaveRoom", () => {
    if (!users[socket.id]) return;

    const user = users[socket.id];
    if (!user.roomId) return;

    const room = rooms[user.roomId];
    if (!room) {
      user.roomId = null;
      broadcastLobby();
      return;
    }

    if (room.player1SocketId === socket.id) {
      room.player1SocketId = null;
      room.player1Nickname = null;
    }
    if (room.player2SocketId === socket.id) {
      room.player2SocketId = null;
      room.player2Nickname = null;
    }

    io.emit("chatMessage", `[로비] ${user.nickname} 님이 '${room.title}' 방에서 나갔습니다.`);
    user.roomId = null;

    if (!room.player1SocketId && !room.player2SocketId) {
      delete rooms[room.id];
    }

    broadcastLobby();
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      if (user.roomId && rooms[user.roomId]) {
        const room = rooms[user.roomId];

        if (room.player1SocketId === socket.id) {
          room.player1SocketId = null;
          room.player1Nickname = null;
        }
        if (room.player2SocketId === socket.id) {
          room.player2SocketId = null;
          room.player2Nickname = null;
        }

        if (!room.player1SocketId && !room.player2SocketId) {
          delete rooms[user.roomId];
        }
      }

      io.emit("chatMessage", `[로비] ${user.nickname} 님이 퇴장했습니다.`);
      delete users[socket.id];
      broadcastLobby();
    }

    console.log("user disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
