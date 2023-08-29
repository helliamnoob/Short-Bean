const jwt = require('jsonwebtoken');
const { Chats } = require('./models');
const Chat = require('./schemas/chat');
const { Op } = require('sequelize');

require('dotenv').config();
const connectedUsers = []; // 현재 접속한 사용자 목록을 저장할 객체
let roomOwner;
module.exports = (io) => {
  io.on('connection', (socket) => {
    const authorization = socket.handshake.auth.token;
    const [tokenType, token] = authorization.split('%20');
    const { user_id, userName } = jwt.verify(token, process.env.SECRET_KEY);

    console.log(`${userName}님이 입장했습니다.`);
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

    socket.on('enter_room', async (targetUserId, targetUserName, done) => {
      const roomInfo = await Chats.findOne({
        attributes: ['chat_id', 'user_id', 'target_user_id'],
        where: {
          [Op.or]: [
            { user_id, target_user_id: targetUserId },
            { user_id: targetUserId, target_user_id: user_id },
          ],
        },
      });
      // 가져올때 ,, 방이없을경우,,
      if (roomInfo) {
        if (roomInfo.user_id == user_id) {
          roomOwner = true;
        } else {
          roomOwner = false;
        }
        console.log(roomInfo.user_id);
        console.log(user_id);
        console.log(roomOwner);
        const roomId = roomInfo.chat_id;
        socket.join(roomId);
        done(userName, targetUserName);
        socket.to(roomId).emit('welcome', userName);

        const chatData = await Chat.find({ room_id: roomId })
          .sort({ created_at: -1 })
          .select('is_send message_content created_at')
          .exec();
        const exChatMessages = getMessage(chatData, userName, targetUserName);
        socket.emit('enter_room', roomId, exChatMessages);
      }
    });

    socket.on('new_message', async (msg, room, done) => {
      const newChat = new Chat({
        room_id: room,
        is_send: roomOwner,
        message_content: msg,
      });
      console.log(roomOwner);
      await newChat.save();
      socket.to(room).emit('new_message', `${userName}: ${msg}`);
      done();
    });
    // 여기서 socket[id] 랑 room 이랑 msg 이용해서 저장하기
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => socket.to(room).emit('bye', userName));
    });
  });
};

function getMessage(chatData, userName, targetUserName) {
  const messages = [];

  chatData.forEach((chat) => {
    const senderName = chat.is_send === roomOwner ? userName : targetUserName;
    const message = `${senderName} : ${chat.message_content}`;
    messages.push(message);
  });
  return messages;
}
