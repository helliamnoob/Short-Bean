const jwt = require('jsonwebtoken');
const { Users } = require('./models');
require('dotenv').config();
const connectedUsers = []; // 현재 접속한 사용자 목록을 저장할 객체
module.exports = (io) => {
  io.on('connection', (socket) => {
    const authorization = socket.handshake.auth.token;
    const [tokenType, token] = authorization.split('%20');
    const { userId, userName } = getUserInfo(token);
    socket['name'] = userName;

    console.log(`${socket.name}님이 입장했습니다.`);
    const user = { userId, userName };
    connectedUsers.push(user);
    console.log(connectedUsers);
    // 새로운 사용자가 접속했음을 모든 클라이언트에 알림
    io.emit('show_users', connectedUsers);

    // 연결이 끊길 때 사용자 목록에서 제거
    socket.on('disconnect', () => {
      delete connectedUsers[socket.id];
      io.emit('user_disconnected', socket.id);
    });

    socket.on('enter_room', (roomName, done) => {
      socket.join(roomName);
      done();
      socket.to(roomName).emit('welcome', socket.name);
    });

    socket.on('new_message', (msg, room, done) => {
      socket.to(room).emit('new_message', `${socket.name}: ${msg}`);
      done();
    });
    // 여기서 socket[id] 랑 room 이랑 msg 이용해서 저장하기
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.name));
    });
  });

  // socket.on('disconnect', () => {
  //   io.sockets.emit('room_change', publicRooms());
  // });

  // socket.on('nickname', (nickname) => {
  //   socket['nickname'] = nickname;
  // });
  function untitle() {
    const users = [];
    const sids = io.sockets.adapter.sids;
    sids.forEach((_, sid) => {
      users.push(sid);
    });
    return users;
  }
  function getUserInfo(token) {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    return decodedToken;
  }
};
