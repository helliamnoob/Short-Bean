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

       // 초대를 수락했을 때 처리하는 로직
       // 초대를 수락한 사용자와 초대를 발송한 사용자에게 이벤트 전송
       // 기존의 'accept_face_chat' 이벤트 핸들러 삭제 후 아래의 로직으로 대체합니다.
       socket.on('accept_face_chat', (inviterSocketId) => {
        // 초대를 수락한 사용자에게 이벤트 전송
        io.to(socket.id).emit('start_face_chat');
        
        // 초대를 발송한 사용자에게도 같은 메세지 전송
        io.to(inviterSocketId).emit('start_face_chat');
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
            // 클라이언트 연결이 끊어졌을 때 처리하는 로직
        socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        for(let userId in userSockets){
            if(userSockets[userId] === socket.id){
                delete userSockets[userId];
            }
        }
        console.log(userSockets);  // 콘솔 출력으로 현재 남아있는 유저들 확인 
     });
    });


};

module.exports = faceSocketController;