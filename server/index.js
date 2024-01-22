const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 3003;
const io = require("socket.io")(server, { cors: { origin: "*" } });

const { MongoClient, ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

class DBActions {
  constructor() {
    const ipAdress = "127.0.0.1";
    const PORT = "27777";
    const databaseName = "gomoku";
    const connectionString = `mongodb://${ipAdress}:${PORT}/${databaseName}`;
    this.client = new MongoClient(connectionString);
    this.conn = null;
  }
}






io.on("connection", (socket) => {
  console.log("Ktoś dołączył");

  socket.on("disconnect", () => {
    console.log("Ktoś wyszedł");
  });
});

server.listen(port, () => {
  console.log(`Aplikacja działa na http://localhost:${port}`);
});