const SocketIO = require("socket.io");
const express = require("express");
const http = require("http");

module.exports = (server) => {
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = SocketIO(httpServer);

  wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });

    socket.on("offer", (offer, roomName) => {
      socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName) => {
      socket.to(roomName).emit("answer", answer);
    });

    socket.on("ice", (ice, roomName) => {
      socket.to(roomName).emit("ice", ice);
    });
  });

  return httpServer;
};
