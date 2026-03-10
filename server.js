const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Samsho4 server running");
});

server.listen(process.env.PORT || 3000);
