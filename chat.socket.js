const jwt = require('jsonwebtoken');
const { Chats, Users, TutorInfos } = require('./models');
const Chat = require('./schemas/chat');
const { Op } = require('sequelize');
require('dotenv').config();

const connectedUsers = []; // 현재 접속한 사용자 목록을 저장할 객체
module.exports = (io) => {
  let userSockets = {}; // { userId: socketId }
  io.on('connection', async (socket) => {
    // socket보낼 때 토큰을 같이 보냄
    const userId = decodeJwt(socket);
    const { isTutor, userName } = await getMyInfo(userId);

    // 가져온 데이터로 새로운 유저객체 생성
    const user = {
      userId,
      userName,
      isTutor,
      socketId: socket.id,
    };

    connectedUsers.push(user);

    // 새로운 사용자가 접속했음을 모든  알림
    io.emit('show_users', connectedUsers);

    // 연결이 끊길 때 사용자 목록에서 제거
    socket.on('disconnect', () => {
      const disconnectedUser = connectedUsers.find((user) => user.socketId === socket.id);
      if (disconnectedUser) connectedUsers.splice(connectedUsers.indexOf(disconnectedUser), 1);
      io.emit('show_users', connectedUsers);
    });

    // 방에 입장할 때
    socket.on('enter_room', async (targetUserId, targetUserName, done) => {
      if (userId == targetUserId) {
        socket.emit('sameUser');
        return;
      }
      // 현재 유저와 가져온 유저와의 채팅방이 있는지 확인
      const roomInfo = await getRoomInfo(userId, targetUserId);

      if (!roomInfo) {
        // 방 없을 시
        socket.emit('no_room', targetUserId);
      } else {
        // 방이 존재할 시
        if (roomInfo.user_id == userId) {
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
      await saveMsg(room, socket, msg);
      // 룸에 있는 사용자에게 보내기
      // 시간 추가해야한다.
      socket.to(room).emit('new_message', `${userName}: ${msg}`);
      done();
    });
    // 나갈 때 알림
    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => socket.to(room).emit('bye', userName));
    });
    // 튜터만 보여주기
    socket.on('show_tutor', (done) => {
      const tutors = connectedUsers.filter((user) => user.isTutor === true);
      done(tutors);
    });
    // 예림님쪽
    console.log('a user connected:', socket.id);
    socket.on('register', (userId) => {
      userSockets[userId] = socket.id;
      console.log('Registered:', userId, 'with socket ID:', socket.id);
      console.log(userSockets);
    });

    socket.on('invite_face_chat', (userId) => {
      console.log('Invitation for user ID:', userId);
      const invitedUserSocketId = userSockets[userId];
      if (invitedUserSocketId) {
        io.to(invitedUserSocketId).emit('receive_invite', socket.id);
      } else {
        console.log('No socket ID found for user ID:', userId);
      }
    });

    socket.on('accept_face_chat', (inviteeId) => {
      io.to(socket.id).emit('start_face_chat');
      io.to(inviteeId).emit('start_face_chat');

      socket.on('accept_face_chat', (inviteeId) => {
        io.to(inviteeId).emit('start_face_chat');
      });

      socket.on('join_room', (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit('welcome');
      });

      socket.on('offer', (offer, roomName) => {
        socket.to(roomName).emit('offer', offer);
      });
      socket.on('answer', (answer, roomName) => {
        socket.to(roomName).emit('answer', answer);
      });
      socket.on('ice', (ice, roomName) => {
        socket.to(roomName).emit('ice', ice);
      });
    });
  });
};

async function saveMsg(room, socket, msg) {
  const newChat = new Chat({
    room_id: room,
    is_send: socket.roomOwner,
    message_content: msg,
  });
  await newChat.save();
}

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

async function getMyInfo(user_id) {
  let isTutor;
  const myInfo = await Users.findOne({
    include: [
      {
        model: TutorInfos,
      },
    ],
    where: { user_id },
  });
  if (myInfo.dataValues.TutorInfo) {
    isTutor = true;
  } else {
    isTutor = false;
  }

  const userName = myInfo.dataValues.user_name;

  return { isTutor, userName };
}

function decodeJwt(socket) {
  const authorization = socket.handshake.auth.token;
  const [tokenType, token] = authorization.split('%20');
  const { user_id } = jwt.verify(token, process.env.SECRET_KEY);
  return user_id;
}

async function getRoomInfo(user_id, targetUserId) {
  const roomInfo = await Chats.findOne({
    attributes: ['chat_id', 'user_id', 'target_user_id'],
    where: {
      [Op.or]: [
        { user_id, target_user_id: targetUserId },
        { user_id: targetUserId, target_user_id: user_id },
      ],
    },
  });

  return roomInfo;
}
