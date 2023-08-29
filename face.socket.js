const faceSocketController = (io) => {
    let userSockets = {}; // { userId: socketId }

    io.on("connection", (socket) => {
        console.log('a user connected:', socket.id);

        // 사용자가 연결될 때, userSockets 에 사용자 ID와 소켓 ID 저장
        socket.on("register", (userId) => {
            userSockets[userId] = socket.id;
        });

        socket.on("join_room", (roomName) => {
            socket.join(roomName);
            socket.to(roomName).emit("welcome");
        });

        // 유저에게 초대장 보내기
        socket.on('invite_face_chat', (userId) => {
            const invitedUserSocketId = userSockets[userId];
            if (invitedUserSocketId) {
                io.to(invitedUserSocketId).emit('receive_invite', socket.id);  // 초대한 사람의 소켓 ID 전송
            }
        });

        socket.on("accept_face_chat", (inviterSocketId) => {
            io.to(inviterSocketId).emit("start_face_chat");
        });

        socket.on("offer", (offer, roomName) => {
            socket.to(roomName).emit("offer", offer);
        });

        socket.on("answer", (answer, roomName) => {
            socket.to(roomName).emit("answer", answer);
        });

        socket.on("ice", (ice, roomName) => {
            socket.to(roomName).emit("ice", ice);
        });
    });
};

module.exports = faceSocketController;
