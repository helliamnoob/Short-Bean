const faceSocketController = (io) => {
    let userSockets = {}; // { userId: socketId }
    
    io.on("connection", (socket) => {
        console.log('a user connected:', socket.id);
        socket.on("register", (userId) => {
            userSockets[userId] = socket.id;
            console.log("Registered:", userId, "with socket ID:", socket.id);
            console.log(userSockets);  
        });
        
        socket.on('invite_face_chat', (inviteeId, inviterId, roomId) => {
            console.log("Invitation for user ID:", inviteeId, "from user ID:", inviterId);
            const invitedUserSocketId = userSockets[inviteeId];
            if (invitedUserSocketId) {
                io.to(invitedUserSocketId).emit('receive_invite', inviterId, roomId); 
            } else {
                console.log("No socket ID found for user ID:", inviteeId);
            }
        });
        
        socket.on('accept_face_chat', (inviterId, inviteeId, roomId) => {
            console.log("Room ID:", roomId);
            const inviterSocketId = userSockets[inviterId];
            const inviteeSocketId = userSockets[inviteeId];
        
            if(inviterSocketId && inviteeSocketId) {
                try {
                    socket.join(roomId); 
                    io.sockets.sockets.get(inviterSocketId).join(roomId); 
                    io.to(inviteeSocketId).emit('start_face_chat', roomId);
                } catch (error) {
                    console.error("Error while joining the room:", error);
                    socket.emit('error_notification', 'Failed to join the chat room.');  // Error notification
                }
            } else {
                console.log("Socket ID not found.");
                socket.emit('error_notification', 'An error occurred while connecting. Please try again.');  // Error notification
            }
        });
        socket.on('join_room', (roomName) => {
            console.log(`[SERVER] User ${socket.id} is attempting to join room ${roomName}`);
            socket.join(roomName);
        
            // 방에 입장한 사용자를 알리기 위한 메시지 (옵션)
            io.to(roomName).emit('user_joined', { userId: socket.id, roomName });
            console.log(`[SERVER] User ${socket.id} has joined room ${roomName} and 'user_joined' event emitted`);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Find the disconnected user and remove from the tracking object
            for(let userId in userSockets){
                if(userSockets[userId] === socket.id){
                    delete userSockets[userId];
                    break;
                }
            }

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
