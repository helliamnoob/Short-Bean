const SocketIO = require("socket.io");
const express = require("express");
const http = require("http");

module.exports = (server) => {
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = SocketIO(httpServer);

  wsServer.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('send-invite', (data) => {
        // 다른 모든 클라이언트에게 초대 메세지 전송
        socket.broadcast.emit('receive-invite', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

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
