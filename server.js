const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
