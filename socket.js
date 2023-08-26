const jwt = require('jsonwebtoken');
const { Users } = require('./models');
require('dotenv').config();

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const authorization = socket.handshake.auth.token;
    const [tokenType, token] = authorization.split('%20');
    const { user_id, user_name } = await getUserInfo(token);
    socket['name'] = user_name;

    console.log(`${socket.name}님이 입장했습니다.`);

    io.sockets.emit('show_users', onlineUser());
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
  function onlineUser() {
    const users = [];
    const sids = io.sockets.adapter.sids;
    sids.forEach((_, sid) => {
      users.push(sid);
    });
    return users;
  }
  async function getUserInfo(token) {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    const userInfo = await Users.findOne({ where: { user_id: userId } });
    return userInfo;
  }
};
