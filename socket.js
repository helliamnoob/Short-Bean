module.exports = (io) => {
  function publicRooms() {
    // const sids = io.sockets.adapter.sids;
    // const rooms = io.sockets.adapter.rooms; << 초보버전들
    const {
      sockets: {
        adapter: { sids, rooms },
      },
    } = io;
    const publicRooms = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRooms.push(key);
      }
    });
    return publicRooms;
  }
  function countRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
  }

  io.on("connection", (socket) => {
    socket["nickname"] = "anonymous";
    socket.onAny((event) => {
      console.log(`socket Event : ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
      socket.join(roomName);
      done();
      socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
      io.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
    });
    socket.on("disconnect", () => {
      io.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, room, done) => {
      socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
      done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
  });
};
