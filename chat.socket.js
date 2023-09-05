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
        done(targetUserName);
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
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user_joined', { userId: socket.id, roomId });
    });

    socket.on('offer', (offer, roomId) => {
      console.log(`[SERVER] Received an 'offer' from ${socket.id} for room ${roomId}`);
      socket.to(roomId).emit('offer', offer);
      console.log(`[SERVER] 'offer' event emitted to room ${roomId}`);
    });

    socket.on('answer', (answer, roomId) => {
      console.log(`[SERVER] Received an 'answer' from ${socket.id} for room ${roomId}`);
      socket.to(roomId).emit('answer', answer);
      console.log(`[SERVER] 'answer' event emitted to room ${roomId}`);
    });

    socket.on('ice', (ice, roomId) => {
      console.log(`[SERVER] Received an 'ice' candidate from ${socket.id} for room ${roomId}`);
      socket.to(roomId).emit('ice', ice);
      console.log(`[SERVER] 'ice' event emitted to room ${roomId}`);
    });

    socket.on('draw', (data, roomId) => {
      socket.to(roomId).emit('draw', data);
    });


    // socket.on('disconnect', () => {
    //   console.log('User disconnected:', socket.id);

    //   // Find the disconnected user and remove from the tracking object
    //   for (let userId in userSockets) {
    //     if (userSockets[userId] === socket.id) {
    //       delete userSockets[userId];
    //       break;
    //     }
    //   }
    // });

    // 예림님쪽 invite
    socket.on('register', (userId) => {
      userSockets[userId] = socket.id;
      console.log('Registered:', userId, 'with socket ID:', socket.id);
      console.log(userSockets);
    });

    socket.on('invite_face_chat', (inviteeId, inviterId, roomId) => {
      console.log('Invitation for user ID:', inviteeId, 'from user ID:', inviterId);
      const invitedUserSocketId = userSockets[inviteeId];
      if (invitedUserSocketId) {
        io.to(invitedUserSocketId).emit('receive_invite', inviterId, roomId);
      } else {
        console.log('No socket ID found for user ID:', inviteeId);
      }
    });

    socket.on('accept_face_chat', (inviterId, inviteeId, roomId) => {
      console.log('Room ID:', roomId);
      const inviterSocketId = userSockets[inviterId];
      const inviteeSocketId = userSockets[inviteeId];

      if (inviterSocketId && inviteeSocketId) {
        try {
          socket.join(roomId);
          io.sockets.sockets.get(inviterSocketId).join(roomId);
          io.to(inviteeSocketId).emit('start_face_chat', roomId);
        } catch (error) {
          console.error('Error while joining the room:', error);
          socket.emit('error_notification', 'Failed to join the chat room.'); // Error notification
        }
      } else {
        console.log('Socket ID not found.');
        socket.emit('error_notification', 'An error occurred while connecting. Please try again.'); // Error notification
      }
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

// 쓰레드분리