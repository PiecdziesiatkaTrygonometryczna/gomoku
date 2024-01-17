const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 3003;
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Ktoś dołączył");

  socket.on("disconnect", () => {
    console.log("Ktoś wyszedł");
  });

    socket.on("joinRoom", (roomCode) => {
    console.log(`Użytkownik dołączył do pokoju ${roomCode}`);
    socket.join(roomCode);
  });
});

server.listen(port, () => {
  console.log(`Aplikacja działa na http://localhost:${port}`);
});
