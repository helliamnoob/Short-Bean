module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("새로운 소켓 연결됨");

    socket.on("chatMessage", (message) => {
      io.emit("chatMessage", message);
    });
  });
};
