const jwt = require('jsonwebtoken');
const { Users } = require('./models');
require('dotenv').config();

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket['nickname'] = 'aa';
    const authorization = socket.handshake.auth.token;
    const [tokenType, token] = authorization.split('%');
    console.log(token);
    // const user = getUsers(token);
    // console.log(user);

    // console.log(tokenType, token);
    io.sockets.emit('room_change', publicRooms());
    io.sockets.emit('show_users', getUser());
    socket.onAny((event) => {
      console.log(`socket Event : ${event}`);
    });
    socket.on('enter_room', (roomName, done) => {
      socket.join(roomName);
      done();
      socket.to(roomName).emit('welcome', socket.id, countRoom(roomName));
      io.sockets.emit('room_change', publicRooms());
    });
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.id, countRoom(room) - 1));
    });
    socket.on('disconnect', () => {
      io.sockets.emit('room_change', publicRooms());
    });

    socket.on('new_message', (msg, room, done) => {
      socket.to(room).emit('new_message', `${socket.id}: ${msg}`);
      done();
    });
    socket.on('nickname', (nickname) => {
      socket['nickname'] = nickname;
    });
  });

  function publicRooms() {
    // const sids = io.sockets.adapter.sids;
    // const rooms = io.sockets.adapter.rooms;
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
  function getUser() {
    const users = [];
    const sids = io.sockets.adapter.sids;
    sids.forEach((_, sid) => {
      users.push(sid);
    });
    return users;
  }
  async function getUsers(token) {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decodedToken);
    const userId = decodedToken.user_id;
    const user = await Users.findOne({ where: { user_id: userId } });
    console.log(user);
    return user;
  }
};
