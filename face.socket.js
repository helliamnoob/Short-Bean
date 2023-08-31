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
                io.to(invitedUserSocketId).emit('receive_invite', userId, socket.id); 
            } else {
                console.log("No socket ID found for user ID:", userId);
            }
        });
        
        socket.on('accept_face_chat', (inviterId) => {
            const inviterSocketId = userSockets[inviterId];
            const roomName = `${inviterSocketId}_${socket.id}`;  // 방 이름 생성
            console.log("Creating room with name:", roomName);
            
            if(inviterSocketId) {
                socket.join(roomName); // 초대를 수락한 사용자 (현재 소켓)을 방에 조인
                io.sockets.sockets.get(inviterSocketId).join(roomName); // 초대를 보낸 사용자의 소켓을 방에 조인
                console.log("Both users have joined the room:", roomName);
                        
                io.to(socket.id).emit('start_face_chat', roomName);
                io.to(inviterSocketId).emit('start_face_chat', roomName); 
                console.log("Sent 'start_face_chat' event to both users in room:", roomName);
            } else {
                console.log("Inviter socket ID not found.");
            }
        });

        socket.on('join_room', (roomName) => {
            console.log(`[SERVER] User ${socket.id} is attempting to join room ${roomName}`);
            socket.join(roomName);
        
            // 방에 입장한 사용자를 알리기 위한 메시지 (옵션)
            io.to(roomName).emit('user_joined', { userId: socket.id, roomName });
            console.log(`[SERVER] User ${socket.id} has joined room ${roomName} and 'user_joined' event emitted`);
        });
        
        socket.on("offer", (offer, roomName) => {
            console.log(`[SERVER] Received an 'offer' from ${socket.id} for room ${roomName}`);
            socket.to(roomName).emit("offer", offer);
            console.log(`[SERVER] 'offer' event emitted to room ${roomName}`);
        });
        
        socket.on("answer", (answer, roomName) => {
            console.log(`[SERVER] Received an 'answer' from ${socket.id} for room ${roomName}`);
            socket.to(roomName).emit("answer", answer);
            console.log(`[SERVER] 'answer' event emitted to room ${roomName}`);
        });
        
        socket.on("ice", (ice, roomName) => {
            console.log(`[SERVER] Received an 'ice' candidate from ${socket.id} for room ${roomName}`);
            socket.to(roomName).emit("ice", ice);
            console.log(`[SERVER] 'ice' event emitted to room ${roomName}`);
        });
    });

    


};
module.exports = faceSocketController;
