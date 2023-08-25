const jwt = require('jsonwebtoken');
const { Users } = require('./models');
require('dotenv').config();

module.exports = (io) => {
  io.on('connection', (socket) => {
    const authorization = socket.handshake.auth.token;
    const [tokenType, token] = authorization.split('%20');
    console.log(authorization);
    console.log(token);
    const decodedToken = jwt.verify(token, 'aaa');
    console.log(decodedToken);
    // 콘솔에는 원래 그렇게
    console.log(`${socket.id}가 입장했습니다.`);
    io.sockets.emit('show_users', getUser());

    socket.on('enter_room', (roomName, done) => {
      socket.join(roomName);
      done();
      socket.to(roomName).emit('welcome', socket.id);
    });

    socket.on('new_message', (msg, room, done) => {
      socket.to(room).emit('new_message', `${socket.id}: ${msg}`);
      done();
    });
    // 여기서 socket[id] 랑 room 이랑 msg 이용해서 저장하기
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => socket.to(room).emit('bye', socket.id));
    });
  });
  // const authorization = socket.handshake.auth.token;
  // const [tokenType, token] = authorization.split('%');
  // console.log(token);
  // const user = getUsers(token);
  // console.log(user);

  // console.log(tokenType, token);
  // io.sockets.emit('room_change', publicRooms());
  // socket.onAny((event) => {
  //   console.log(`socket Event : ${event}`);
  // });

  // socket.on('disconnect', () => {
  //   io.sockets.emit('room_change', publicRooms());
  // });

  // socket.on('nickname', (nickname) => {
  //   socket['nickname'] = nickname;
  // });
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
