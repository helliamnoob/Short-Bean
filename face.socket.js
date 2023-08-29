const faceSocketController = (io) => {
    let userSockets = {}; // { userId: socketId }

    io.on("connection", (socket) => {
        console.log('a user connected:', socket.id);

        socket.on("register", (userId) => {
            userSockets[userId] = socket.id;
            console.log("Registered:", userId, "with socket ID:", socket.id);
            console.log(userSockets);  
        });
        
        socket.on('invite_face_chat', (userId) => {
            console.log("Invitation for user ID:", userId);
            const invitedUserSocketId = userSockets[userId];
            if (invitedUserSocketId) {
                io.to(invitedUserSocketId).emit('receive_invite', socket.id); 
            } else {
                console.log("No socket ID found for user ID:", userId);
            }
        });

      io.on('connection', (socket) => {
    socket.on('accept_face_chat', (inviterSocketId) => {
        // 초대를 수락한 사용자에게 이벤트 전송
        socket.emit('start_face_chat');
        
        // 초대를 발송한 사용자에게 이벤트 전송
        io.to(inviterSocketId).emit('start_face_chat');
    });
});

        socket.on("join_room", (roomName) => {
            socket.join(roomName);
            socket.to(roomName).emit("welcome");
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