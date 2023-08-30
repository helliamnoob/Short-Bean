const jwt = require('jsonwebtoken');
const { Chats } = require('./models');
const Chat = require('./schemas/chat');
const { Op } = require('sequelize');
require('dotenv').config();

const connectedUsers = []; // 현재 접속한 사용자 목록을 저장할 객체
module.exports = (io) => {
  io.on('connection', (socket) => {
    // socket보낼 때 토큰을 같이 보냄
    const authorization = socket.handshake.auth.token;
    const [tokenType, token] = authorization.split('%20');
    const { user_id, userName } = jwt.verify(token, process.env.SECRET_KEY);

    // 가져온 데이터로 새로운 유저객체 생성
    const user = { userId: user_id, userName, socketId: socket.id };
    connectedUsers.push(user);

    // 새로운 사용자가 접속했음을 모든 클라이언트에 알림
    io.emit('show_users', connectedUsers);

    // 연결이 끊길 때 사용자 목록에서 제거
    socket.on('disconnect', () => {
      const disconnectedUser = connectedUsers.find((user) => user.socketId === socket.id);
      if (disconnectedUser) connectedUsers.splice(connectedUsers.indexOf(disconnectedUser), 1);
      io.emit('show_users', connectedUsers);
    });

    // 방에 입장할 때
    socket.on('enter_room', async (targetUserId, targetUserName, done) => {
      // 현재 유저와 가져온 유저와의 채팅방이 있는지 확인
      const roomInfo = await Chats.findOne({
        attributes: ['chat_id', 'user_id', 'target_user_id'],
        where: {
          [Op.or]: [
            { user_id, target_user_id: targetUserId },
            { user_id: targetUserId, target_user_id: user_id },
          ],
        },
      });

      if (!roomInfo) {
        // 방 업을 시
        socket.emit('no_room', targetUserId);
      } else {
        // 방이 존재할 시
        if (roomInfo.user_id == user_id) {
          socket.roomOwner = true;
        } else {
          socket.roomOwner = false;
        }
        const roomId = roomInfo.chat_id;
        const exChatMessages = await getMessage(roomId, userName, targetUserName, socket.roomOwner);
        socket.join(roomId);
        socket.to(roomId).emit('welcome', userName);

        socket.emit('enter_room', roomId, exChatMessages);
        done(userName, targetUserName);
      }
    });

    socket.on('new_message', async (msg, room, done) => {
      // 새로운 채팅데이터 생성
      const newChat = new Chat({
        room_id: room,
        is_send: socket.roomOwner,
        message_content: msg,
      });
      await newChat.save();

      // 룸에 있는 사용자에게 보내기
      // 시간 추가해야한다.
      socket.to(room).emit('new_message', `${userName}: ${msg}`);
      done();
    });
    // 나갈 때 알림
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => socket.to(room).emit('bye', userName));
    });
  });
};

async function getMessage(roomId, userName, targetUserName, roomOwner) {
  const messages = [];

  const chatData = await Chat.find({ room_id: roomId })
    .sort({ created_at: 1 })
    .select('is_send message_content created_at')
    .exec();

  chatData.forEach((chat) => {
    const senderName = chat.is_send === roomOwner ? userName : targetUserName;
    const message = `${senderName} : ${chat.message_content}`;
    messages.push(message);
  });
  return messages;
}
