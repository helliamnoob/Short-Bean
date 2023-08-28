const jwt = require('jsonwebtoken');
const { Chats } = require('./models');
const { Op } = require('sequelize');

require('dotenv').config();
const connectedUsers = []; // 현재 접속한 사용자 목록을 저장할 객체
module.exports = (io) => {
  io.on('connection', (socket) => {
    const authorization = socket.handshake.auth.token;
    const [tokenType, token] = authorization.split('%20');
    const { userId, userName } = jwt.verify(token, process.env.SECRET_KEY);

    console.log(`${userName}님이 입장했습니다.`);
    const user = { userId, userName, socketId: socket.id };
    connectedUsers.push(user);
    // 새로운 사용자가 접속했음을 모든 클라이언트에 알림
    io.emit('show_users', connectedUsers);

    // 연결이 끊길 때 사용자 목록에서 제거
    socket.on('disconnect', () => {
      const disconnectedUser = connectedUsers.find((user) => user.socketId === socket.id);
      if (disconnectedUser) connectedUsers.splice(connectedUsers.indexOf(disconnectedUser), 1);
      io.emit('show_users', connectedUsers);
    });

    socket.on('enter_room', async (targetUserId, done) => {
      const roomInfo = await Chats.findOne({
        attributes: ['chat_id', 'user_id', 'target_user_id'],
        where: {
          [Op.or]: [
            { user_id: userId, target_user_id: targetUserId },
            { user_id: targetUserId, target_user_id: userId },
          ],
        },
      });
      // 에러처리 필요
      if (roomInfo) {
        const roomId = roomInfo.chat_id;
        // console.log(roomId);
        socket.join(roomInfo.chat_id);
        done(userName);
        socket.to(roomId).emit('welcome', userName);
      }
    });

    socket.on('new_message', (msg, room, done) => {
      socket.to(room).emit('new_message', `${userName}: ${msg}`);
      done();
    });
    // 여기서 socket[id] 랑 room 이랑 msg 이용해서 저장하기
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => socket.to(room).emit('bye', userName));
    });
  });
};
