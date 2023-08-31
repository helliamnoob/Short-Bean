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

        socket.on('accept_face_chat', (inviteeId) => {
            // 새로운 룸을 생성합니다. 예를 들어 초대한 사람과 수락한 사람의 소켓 ID를 조합하여 룸 이름을 생성합니다.
            const roomName = `${socket.id}_${inviteeId}`;
            
            // 초대한 사람과 수락한 사람 모두 새로운 룸에 입장시킵니다.
            io.sockets.sockets.get(socket.id).join(roomName);
            io.sockets.sockets.get(inviteeId).join(roomName);
            
            // 두 사용자에게 채팅을 시작하라는 메시지와 함께 룸 이름을 전송합니다.
            io.to(socket.id).emit('start_face_chat', roomName);
            io.to(inviteeId).emit('start_face_chat', roomName); 
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
